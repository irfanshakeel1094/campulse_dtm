const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db/connection');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    let { name, email, password, role, college, interests } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Normalize email: trim and lowercase
    email = email.trim().toLowerCase();
    name = name.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate role
    if (!['student', 'organizer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // For organizers, college is required
    if (role === 'organizer' && (!college || !college.trim())) {
      return res.status(400).json({ message: 'College name is required for organizers' });
    }

    // Check if email already exists
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const userCollege = role === 'student' ? 'SRMIST RAMAPURAM' : college.trim();
    const userInterests = Array.isArray(interests) ? interests : [];

    // Insert user into database with all fields initialized
    await conn.query(
      'INSERT INTO users (id, name, email, passwordHash, role, college, interests, registeredEvents, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        userId,
        name,
        email,
        passwordHash,
        role,
        userCollege,
        JSON.stringify(userInterests),
        JSON.stringify([]),
        JSON.stringify([])
      ]
    );

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: userId, email, role, name, college: userCollege },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        college: userCollege,
        interests: userInterests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    let { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Normalize email: trim and lowercase
    email = email.trim().toLowerCase();

    // Validate role
    if (!['student', 'organizer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Find user by email and role
    const [users] = await conn.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or wrong role selected' });
    }

    const user = users[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, college: user.college },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Parse interests safely (mysql2 auto-parses JSON columns)
    let interests = [];
    if (user.interests) {
      interests = typeof user.interests === 'string' ? JSON.parse(user.interests) : user.interests;
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        interests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const { passwordHash, ...safeUser } = user;

    // Parse interests safely (mysql2 auto-parses JSON columns)
    if (safeUser.interests) {
      safeUser.interests = typeof safeUser.interests === 'string' ? JSON.parse(safeUser.interests) : safeUser.interests;
    } else {
      safeUser.interests = [];
    }

    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// PUT /api/auth/interests
router.put('/interests', require('../middleware/auth'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { interests } = req.body;

    // Validate interests is an array
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array' });
    }

    // Update user interests
    await conn.query('UPDATE users SET interests = ? WHERE id = ?', [JSON.stringify(interests), req.user.id]);

    res.json({ message: 'Interests updated', interests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
