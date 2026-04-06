const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

// Helper: mysql2 auto-parses JSON columns, so handle both string and object
function safeParseJSON(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

// Multer config for poster uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

// GET /api/events/organizer/mine — get organizer's events (MUST come before /:id route)
router.get('/organizer/mine', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Organizers only' });
    }

    const [events] = await conn.query('SELECT * FROM events WHERE organizer = ?', [req.user.name]);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// GET /api/events — get all events with optional filters
router.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { category, college, search } = req.query;
    let query = 'SELECT * FROM events';
    const params = [];

    if (category || college || search) {
      query += ' WHERE 1=1';
      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }
      if (college) {
        query += ' AND college = ?';
        params.push(college);
      }
      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ? OR college LIKE ? OR category LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
    }

    query += ' ORDER BY date ASC';
    const [events] = await conn.query(query, params);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// GET /api/events/:id — get single event
router.get('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const event = events[0];
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// POST /api/events — create event (organizer only)
router.post('/', authMiddleware, upload.single('poster'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    // Map field names from frontend to database schema
    const { title, description, date, time, venue, location, category, mode, registrationFee, contactNumber, googleFormLink } = req.body;
    const finalLocation = venue || location || '';
    const registrationUrl = googleFormLink || '';

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    if (!registrationUrl) {
      return res.status(400).json({ message: 'Registration URL (Google Form link) is required' });
    }

    const eventId = uuidv4();
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    await conn.query(
      `INSERT INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [eventId, title, description || '', date, time || '', finalLocation, req.user.college, req.user.name, category || 'General', posterUrl, registrationUrl, JSON.stringify([])]
    );

    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [eventId]);
    res.status(201).json(events[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// PUT /api/events/:id — update event (owner organizer only)
router.put('/:id', authMiddleware, upload.single('poster'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    if (event.organizer !== req.user.name) {
      return res.status(403).json({ message: 'Not your event' });
    }

    // Map field names from frontend to database schema
    const updates = {};
    const { title, description, date, time, venue, location, category, mode, registrationFee, contactNumber, googleFormLink } = req.body;

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (venue !== undefined) updates.location = venue;
    if (location !== undefined && !venue) updates.location = location;
    if (category !== undefined) updates.category = category;
    if (googleFormLink !== undefined) updates.registrationUrl = googleFormLink;
    if (req.file) updates.posterUrl = `/uploads/${req.file.filename}`;

    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'college' && key !== 'organizer' && key !== 'id') {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }

    if (updateFields.length > 0) {
      updateValues.push(req.params.id);
      await conn.query(`UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
    }

    const [updated] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// DELETE /api/events/:id — delete event (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    if (event.organizer !== req.user.name) {
      return res.status(403).json({ message: 'Not your event' });
    }

    await conn.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// POST /api/events/:id/register — register student for event
router.post('/:id/register', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can register for events' });
    }

    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    const registrations = safeParseJSON(event.registrations, []);

    // Check if already registered
    if (registrations.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Add registration
    registrations.push(req.user.id);
    await conn.query('UPDATE events SET registrations = ? WHERE id = ?',
      [JSON.stringify(registrations), req.params.id]);

    // Add to user's registered events
    const [users] = await conn.query('SELECT registeredEvents FROM users WHERE id = ?', [req.user.id]);
    const userEvents = safeParseJSON(users[0].registeredEvents, []);
    userEvents.push(req.params.id);
    await conn.query('UPDATE users SET registeredEvents = ? WHERE id = ?',
      [JSON.stringify(userEvents), req.user.id]);

    res.json({ message: 'Successfully registered for event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// POST /api/events/:id/unregister — unregister student from event
router.post('/:id/unregister', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can unregister from events' });
    }

    const [events] = await conn.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    const registrations = safeParseJSON(event.registrations, []);

    // Remove registration
    const index = registrations.indexOf(req.user.id);
    if (index > -1) {
      registrations.splice(index, 1);
      await conn.query('UPDATE events SET registrations = ? WHERE id = ?',
        [JSON.stringify(registrations), req.params.id]);
    }

    // Remove from user's registered events
    const [users] = await conn.query('SELECT registeredEvents FROM users WHERE id = ?', [req.user.id]);
    const userEvents = safeParseJSON(users[0].registeredEvents, []);
    const eventIndex = userEvents.indexOf(req.params.id);
    if (eventIndex > -1) {
      userEvents.splice(eventIndex, 1);
      await conn.query('UPDATE users SET registeredEvents = ? WHERE id = ?',
        [JSON.stringify(userEvents), req.user.id]);
    }

    res.json({ message: 'Successfully unregistered from event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
