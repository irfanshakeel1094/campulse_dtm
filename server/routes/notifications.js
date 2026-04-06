const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

// GET /api/notifications — get current user's notifications
router.get('/', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [notifs] = await conn.query(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
      [req.user.id]
    );
    res.json(notifs || []);
  } catch (err) {
    console.error(err);
    res.json([]);
  } finally {
    conn.release();
  }
});

// PATCH /api/notifications/read-all — mark all as read (Must come BEFORE /:id routes)
router.patch('/read-all', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE notifications SET `read` = TRUE WHERE userId = ?', [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// PATCH /api/notifications/:id/read — mark as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [notifs] = await conn.query(
      'SELECT * FROM notifications WHERE id = ? AND userId = ?',
      [req.params.id, req.user.id]
    );

    if (notifs.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await conn.query('UPDATE notifications SET `read` = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Internal helper to create event reminder notifications
router.post('/remind', authMiddleware, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const notifId = uuidv4();
    await conn.query(
      'INSERT INTO notifications (id, userId, message, type, read) VALUES (?, ?, ?, ?, ?)',
      [notifId, req.user.id, 'Event reminder: Your registered event is coming up!', 'reminder', false]
    );
    res.json({ message: 'Reminders sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
