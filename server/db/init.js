const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // First, create connection without database to create the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✓ Connected to MySQL');

    // Create database
    const dbName = process.env.DB_NAME || 'campulse_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' created/exists`);

    // Select the database
    await connection.query(`USE ${dbName}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split and execute statements
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✓ Database tables created');

    // Migrate data from LowDB if available
    const dataPath = path.join(__dirname, '../data');
    const usersFile = path.join(dataPath, 'users.json');
    const eventsFile = path.join(dataPath, 'events.json');

    if (fs.existsSync(usersFile)) {
      try {
        const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        if (usersData.users && usersData.users.length > 0) {
          console.log(`\nMigrating ${usersData.users.length} users from LowDB...`);
          for (const user of usersData.users) {
            // Convert ISO string to MySQL datetime format
            const createdAt = user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
            await connection.query(
              `INSERT IGNORE INTO users (id, name, email, passwordHash, role, college, interests, registeredEvents, bookmarks, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                user.id,
                user.name,
                user.email,
                user.passwordHash,
                user.role,
                user.college,
                JSON.stringify(user.interests || []),
                JSON.stringify(user.registeredEvents || []),
                JSON.stringify(user.bookmarks || []),
                createdAt
              ]
            );
          }
          console.log(`✓ Migrated ${usersData.users.length} users`);
        }
      } catch (err) {
        console.error('Error migrating users:', err.message);
      }
    }

    if (fs.existsSync(eventsFile)) {
      try {
        const eventsData = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        if (eventsData.events && eventsData.events.length > 0) {
          console.log(`\nMigrating ${eventsData.events.length} events from LowDB...`);
          for (const event of eventsData.events) {
            const eventCreatedAt = event.createdAt ? new Date(event.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
            await connection.query(
              `INSERT IGNORE INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                event.id,
                event.title,
                event.description,
                event.date,
                event.time,
                event.location,
                event.college,
                event.organizer,
                event.category,
                event.posterUrl,
                event.registrationUrl,
                JSON.stringify(event.registrations || []),
                eventCreatedAt
              ]
            );
          }
          console.log(`✓ Migrated ${eventsData.events.length} events`);
        }
      } catch (err) {
        console.error('Error migrating events:', err.message);
      }
    }

    await connection.end();
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    process.exit(1);
  }
}

initializeDatabase();
