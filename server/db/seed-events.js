const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const ON_CAMPUS_EVENTS = [
  {
    id: 'srm-001',
    title: 'HackSRM 2026 — 24-Hour Hackathon',
    description: 'SRMIST Ramapuram flagship hackathon! Build innovative solutions in 24 hours. Open to all branches. Cash prizes worth ₹1,50,000. Top teams get incubation support.',
    date: '2026-04-20',
    time: '09:00 AM',
    location: 'Tech Park, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'SRM Tech Club',
    category: 'Hackathon',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/hacksrm2026',
    registrations: '[]'
  },
  {
    id: 'srm-002',
    title: 'AI & Deep Learning Workshop',
    description: 'Hands-on workshop covering TensorFlow, PyTorch, and real-world AI model building. Learn to deploy ML models on cloud. Certificates for all participants.',
    date: '2026-04-25',
    time: '10:00 AM',
    location: 'Seminar Hall B, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'AI Club SRM',
    category: 'Workshop',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/aiworkshop2026',
    registrations: '[]'
  },
  {
    id: 'srm-003',
    title: 'CyberShield CTF 2026',
    description: 'Capture The Flag competition with challenges in web exploitation, reverse engineering, cryptography, and forensics. Prize pool: ₹50,000. Open to all departments.',
    date: '2026-05-02',
    time: '09:30 AM',
    location: 'Auditorium, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Cybersec Club SRM',
    category: 'Cybersecurity',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/ctf2026',
    registrations: '[]'
  },
  {
    id: 'srm-004',
    title: 'Full Stack Bootcamp — React & Node.js',
    description: '3-day intensive bootcamp covering React 19, Node.js, Express, and MySQL. Build a production-ready project from scratch. Industry mentors from TCS and Infosys.',
    date: '2026-05-10',
    time: '10:00 AM',
    location: 'Computer Lab 3, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Web Dev Club SRM',
    category: 'Web Dev',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/fullstack2026',
    registrations: '[]'
  },
  {
    id: 'srm-005',
    title: 'SRM Cloud Computing Summit',
    description: 'One-day summit with talks on AWS, Azure, and GCP. Hands-on labs on deploying containerized apps with Kubernetes. Guest speakers from Google and Microsoft.',
    date: '2026-05-15',
    time: '09:00 AM',
    location: 'Main Auditorium, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Cloud Computing Club SRM',
    category: 'Cloud Computing',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/cloudsummit2026',
    registrations: '[]'
  },
  {
    id: 'srm-006',
    title: 'CodeWars — Competitive Programming Contest',
    description: 'Multi-round competitive programming contest. Problems ranging from easy to expert. Top 3 coders win prizes and guaranteed internship interviews. Individual event.',
    date: '2026-05-20',
    time: '02:00 PM',
    location: 'Labs Block, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'DSA Club SRM',
    category: 'Coding Contest',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/codewars2026',
    registrations: '[]'
  },
  {
    id: 'srm-007',
    title: 'RoboSRM — Robotics Challenge',
    description: 'Design and build robots to complete obstacle courses and tasks. Categories: Line follower, Maze solver, and Freestyle. Workshop on Arduino basics included.',
    date: '2026-05-25',
    time: '10:00 AM',
    location: 'Mechanical Workshop, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Robotics Club SRM',
    category: 'Competition',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/robosrm2026',
    registrations: '[]'
  },
  {
    id: 'srm-008',
    title: 'Data Science Masterclass',
    description: 'Learn data wrangling with Pandas, visualization with Matplotlib & Plotly, and intro to machine learning pipelines. Hands-on Kaggle competition practice.',
    date: '2026-06-01',
    time: '10:00 AM',
    location: 'Seminar Hall A, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Data Science Club SRM',
    category: 'Data Science',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/datascience2026',
    registrations: '[]'
  },
  {
    id: 'srm-009',
    title: 'TECHNOVA 2026 — Annual Tech Symposium',
    description: 'SRMIST Ramapuram annual technical symposium with 15+ events including paper presentations, project expo, tech quiz, and keynote by industry leaders.',
    date: '2026-06-10',
    time: '08:30 AM',
    location: 'Entire Campus, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'CSE Department SRM',
    category: 'Symposium',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/technova2026',
    registrations: '[]'
  },
  {
    id: 'srm-010',
    title: 'Blockchain & Web3 Seminar',
    description: 'Explore blockchain fundamentals, smart contracts with Solidity, and building decentralized apps. Guest lecture by Polygon ecosystem developer.',
    date: '2026-06-15',
    time: '11:00 AM',
    location: 'IT Block Seminar Hall, SRM IST Ramapuram',
    college: 'SRMIST RAMAPURAM',
    organizer: 'Blockchain Club SRM',
    category: 'Seminar',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/blockchain2026',
    registrations: '[]'
  }
];

const OFF_CAMPUS_EVENTS = [
  {
    id: 'off-101',
    title: 'Pragyan 2026 — NIT Trichy Tech Fest',
    description: 'South India\'s largest technical festival. 60+ events across coding, robotics, quizzing, and management. Footfall of 30,000+ participants from across the nation.',
    date: '2026-04-18',
    time: '09:00 AM',
    location: 'NIT Trichy Campus, Tiruchirappalli',
    college: 'NIT Tiruchirappalli',
    organizer: 'Pragyan Team, NIT Trichy',
    category: 'Symposium',
    posterUrl: null,
    registrationUrl: 'https://www.pragyan.org/register',
    registrations: '[]'
  },
  {
    id: 'off-102',
    title: 'graVITas 2026 — VIT Vellore',
    description: 'VIT\'s premier international tech fest featuring hackathons, gaming, workshops, and cultural events. Prize pool over ₹10,00,000. Accommodation provided.',
    date: '2026-04-22',
    time: '10:00 AM',
    location: 'VIT Vellore Campus',
    college: 'VIT Vellore',
    organizer: 'graVITas Team, VIT',
    category: 'Hackathon',
    posterUrl: null,
    registrationUrl: 'https://gravitas.vit.ac.in/register',
    registrations: '[]'
  },
  {
    id: 'off-103',
    title: 'Kurukshetra 2026 — Anna University CEG',
    description: 'CEG Anna University\'s national-level techno-management fest. Events in robotics, coding, design thinking, and entrepreneurship. ₹5,00,000 in prizes.',
    date: '2026-05-05',
    time: '09:00 AM',
    location: 'Anna University CEG Campus, Guindy, Chennai',
    college: 'Anna University CEG',
    organizer: 'Kurukshetra Committee, CEG',
    category: 'Competition',
    posterUrl: null,
    registrationUrl: 'https://kurukshetra.org.in/register',
    registrations: '[]'
  },
  {
    id: 'off-104',
    title: 'Shaastra 2026 — IIT Madras',
    description: 'IIT Madras annual tech fest. Featured events: ML competition, drone racing, research paper presentation, and startup pitch. Travel reimbursement for finalists.',
    date: '2026-05-12',
    time: '08:00 AM',
    location: 'IIT Madras Campus, Chennai',
    college: 'IIT Madras',
    organizer: 'Shaastra Team, IIT Madras',
    category: 'Summit',
    posterUrl: null,
    registrationUrl: 'https://shaastra.org/register',
    registrations: '[]'
  },
  {
    id: 'off-105',
    title: 'TANCRYPT — Cybersecurity CTF at SSN',
    description: 'Tamil Nadu\'s biggest inter-college CTF competition hosted by SSN College of Engineering. 48-hour online jeopardy + on-site attack-defense finals.',
    date: '2026-05-18',
    time: '10:00 AM',
    location: 'SSN College of Engineering, Kalavakkam',
    college: 'SSN College of Engineering',
    organizer: 'CSE Dept, SSN College',
    category: 'Cybersecurity',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/tancrypt2026',
    registrations: '[]'
  },
  {
    id: 'off-106',
    title: 'CloudExpo 2026 — SRM Kattankulathur',
    description: 'Two-day cloud computing expo with workshops on AWS, GCP, and Azure. Industry speakers from Amazon and Microsoft. Hands-on certification prep sessions.',
    date: '2026-05-22',
    time: '09:30 AM',
    location: 'SRM IST Kattankulathur, Chennai',
    college: 'SRMIST Kattankulathur',
    organizer: 'Cloud Club, SRMIST KTR',
    category: 'Cloud Computing',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/cloudexpo2026',
    registrations: '[]'
  },
  {
    id: 'off-107',
    title: 'DataHack 2026 — PSG Tech',
    description: 'PSG Tech\'s inter-college data science hackathon. 24 hours of data crunching, model building, and storytelling. Sponsored by Zoho and Freshworks.',
    date: '2026-05-28',
    time: '09:00 AM',
    location: 'PSG College of Technology, Coimbatore',
    college: 'PSG College of Technology',
    organizer: 'AI/ML Club, PSG Tech',
    category: 'Data Science',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/datahack2026',
    registrations: '[]'
  },
  {
    id: 'off-108',
    title: 'Innovista 2026 — Loyola College Chennai',
    description: 'National-level project expo and innovation challenge. Present your final year project or startup idea to a panel of investors and industry experts.',
    date: '2026-06-05',
    time: '10:00 AM',
    location: 'Loyola College, Nungambakkam, Chennai',
    college: 'Loyola College Chennai',
    organizer: 'Innovation Cell, Loyola',
    category: 'Competition',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/innovista2026',
    registrations: '[]'
  },
  {
    id: 'off-109',
    title: 'WebSprint 2026 — Saveetha Engineering',
    description: 'Speed web development competition. Build a functional web app in 6 hours with a surprise theme. Individual and team categories available. Prizes worth ₹75,000.',
    date: '2026-06-12',
    time: '10:00 AM',
    location: 'Saveetha Engineering College, Chennai',
    college: 'Saveetha Engineering College',
    organizer: 'Dev Community, Saveetha',
    category: 'Web Dev',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/websprint2026',
    registrations: '[]'
  },
  {
    id: 'off-110',
    title: 'AI Conclave 2026 — VIT Chennai',
    description: 'VIT Chennai hosts an AI-focused conclave with paper presentations, poster sessions, and a hackathon track. Industry keynotes from Google DeepMind researchers.',
    date: '2026-06-18',
    time: '09:00 AM',
    location: 'VIT Chennai, Kelambakkam',
    college: 'VIT Chennai',
    organizer: 'AI Research Group, VIT Chennai',
    category: 'AI/ML',
    posterUrl: null,
    registrationUrl: 'https://forms.gle/aiconclave2026',
    registrations: '[]'
  }
];

async function seedEvents() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campulse_db',
    port: process.env.DB_PORT || 3306
  });

  try {
    // Clear old seeded events (keep user-created ones)
    const allSeeded = [...ON_CAMPUS_EVENTS, ...OFF_CAMPUS_EVENTS].map(e => e.id);
    if (allSeeded.length > 0) {
      const placeholders = allSeeded.map(() => '?').join(',');
      await conn.query(`DELETE FROM events WHERE id IN (${placeholders})`, allSeeded);
    }

    // Also clean up any old seed data with known prefixes
    await conn.query("DELETE FROM events WHERE id LIKE 'srm-%' OR id LIKE 'off-%' OR id LIKE 'evt-%'");

    console.log('✓ Cleaned old seeded events');

    // Insert on-campus events
    for (const event of ON_CAMPUS_EVENTS) {
      await conn.query(
        `INSERT INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [event.id, event.title, event.description, event.date, event.time, event.location, event.college, event.organizer, event.category, event.posterUrl, event.registrationUrl, event.registrations]
      );
    }
    console.log(`✓ Inserted ${ON_CAMPUS_EVENTS.length} on-campus (SRM Ramapuram) events`);

    // Insert off-campus events
    for (const event of OFF_CAMPUS_EVENTS) {
      await conn.query(
        `INSERT INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [event.id, event.title, event.description, event.date, event.time, event.location, event.college, event.organizer, event.category, event.posterUrl, event.registrationUrl, event.registrations]
      );
    }
    console.log(`✓ Inserted ${OFF_CAMPUS_EVENTS.length} off-campus events`);

    // Show summary
    const [onCampus] = await conn.query("SELECT COUNT(*) as cnt FROM events WHERE college = 'SRMIST RAMAPURAM'");
    const [offCampus] = await conn.query("SELECT COUNT(*) as cnt FROM events WHERE college != 'SRMIST RAMAPURAM'");
    console.log(`\n📊 Summary:`);
    console.log(`   On Campus (SRM Ramapuram): ${onCampus[0].cnt} events`);
    console.log(`   Off Campus (Other colleges): ${offCampus[0].cnt} events`);
    console.log(`\n✅ Seeding complete!`);

  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await conn.end();
  }
}

seedEvents();
