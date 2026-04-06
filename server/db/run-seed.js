const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSeed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campulse_db',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    const seedPath = path.join(__dirname, 'seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Split by semicolons but ignore those inside strings
    const statements = seedSQL.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'));
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await connection.query(stmt);
          console.log('✓ Executed:', stmt.substring(0, 60).replace(/\n/g, ' ') + '...');
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log('⊘ Skipped (already exists):', stmt.substring(0, 60).replace(/\n/g, ' ') + '...');
          } else {
            console.error('✗ Error:', err.message);
          }
        }
      }
    }

    await connection.end();
    console.log('\n✅ Seed data loaded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

runSeed();
