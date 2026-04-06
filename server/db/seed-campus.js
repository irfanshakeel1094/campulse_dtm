const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedCampusEvents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campulse_db',
    port: process.env.DB_PORT || 3306,
  });

  console.log('✓ Connected to MySQL');

  // Clear old events
  await connection.query('DELETE FROM events');
  console.log('✓ Cleared old events');

  // ─────────────────────────────────────────────
  //  ON-CAMPUS EVENTS (SRM Ramapuram, Chennai)
  // ─────────────────────────────────────────────
  const onCampusEvents = [
    {
      id: 'on-001',
      title: 'SRM TechFest Hackathon 2026',
      description: 'SRM Ramapuram\'s flagship 24-hour hackathon. Build innovative solutions across AI, IoT, Blockchain & Web3 tracks. Top teams win ₹1,00,000 in prizes and internship offers from sponsor companies. Open to all departments.',
      date: '2026-04-20',
      time: '09:00 AM',
      location: 'Main Auditorium & CS Labs, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Hackathon',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-hackathon-2026',
    },
    {
      id: 'on-002',
      title: 'Full-Stack Web Development Bootcamp',
      description: 'Intensive 3-day bootcamp covering React.js, Node.js, MongoDB, and deployment on AWS. Hands-on projects include building a real-time chat app and an e-commerce platform. Certificate provided upon completion.',
      date: '2026-04-15',
      time: '10:00 AM',
      location: 'Computer Lab 1, Block A, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-webdev-bootcamp',
    },
    {
      id: 'on-003',
      title: 'AI & Machine Learning Symposium',
      description: 'Industry experts from Google, Microsoft, and TCS share insights on generative AI, large language models, and real-world ML deployment. Panel discussion on AI careers in India. Networking lunch included.',
      date: '2026-04-22',
      time: '10:00 AM',
      location: 'Seminar Hall, Block C, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Symposium',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-ai-symposium',
    },
    {
      id: 'on-004',
      title: 'Cybersecurity CTF Challenge',
      description: 'Capture The Flag competition with beginner, intermediate, and advanced tracks. Categories include web exploitation, reverse engineering, cryptography, and forensics. Top 10 get certificates from EC-Council.',
      date: '2026-04-18',
      time: '02:00 PM',
      location: 'Cyber Lab, Block B, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Competition',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-ctf-2026',
    },
    {
      id: 'on-005',
      title: 'Data Science with Python Workshop',
      description: 'Learn pandas, NumPy, matplotlib, and scikit-learn through real-world datasets. Build a movie recommendation system and a stock price predictor. Laptops required. Prerequisites: Basic Python knowledge.',
      date: '2026-04-25',
      time: '11:00 AM',
      location: 'Innovation Hub, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-datascience',
    },
    {
      id: 'on-006',
      title: 'Arduino & IoT Robotics Workshop',
      description: 'Build and program robots using Arduino, ESP32, and Raspberry Pi. Design a smart home prototype with sensors, actuators, and Blynk IoT dashboard. All components provided. No prior hardware experience needed.',
      date: '2026-04-21',
      time: '01:00 PM',
      location: 'Robotics Lab, Block D, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-robotics-iot',
    },
    {
      id: 'on-007',
      title: 'CodeSprint 5.0 — Competitive Programming',
      description: 'Timed coding contest on HackerRank. 5 rounds of increasing difficulty covering arrays, graphs, dynamic programming, and greedy algorithms. Winners qualify for ICPC regional prep camp. Solo participation only.',
      date: '2026-04-19',
      time: '04:00 PM',
      location: 'Computer Lab 2, Block A, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Coding Contest',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-codesprint',
    },
    {
      id: 'on-008',
      title: 'Cloud Computing & DevOps Seminar',
      description: 'Introduction to AWS, Azure, and GCP with live demos. Learn Docker, Kubernetes, CI/CD pipelines, and Infrastructure as Code. Industry speakers from Zoho and Freshworks. Free AWS credits for participants.',
      date: '2026-04-23',
      time: '02:30 PM',
      location: 'Auditorium, Block C, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Seminar',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-cloud-devops',
    },
    {
      id: 'on-009',
      title: 'UI/UX Design Hackathon — DesignJam',
      description: 'Design challenge focused on solving real campus problems. Use Figma to create mobile-first prototypes. Mentors from Zoho and Freshworks. Best designs get implemented in the college app. Teams of 2-3.',
      date: '2026-04-28',
      time: '09:00 AM',
      location: 'Design Studio, Block F, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Hackathon',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-designjam',
    },
    {
      id: 'on-010',
      title: 'Blockchain & Web3 Developer Workshop',
      description: 'Deep dive into Solidity, smart contracts, and decentralized apps. Build and deploy an NFT marketplace on Ethereum testnet. Covers wallet integration with MetaMask. Intermediate JS knowledge required.',
      date: '2026-04-27',
      time: '10:00 AM',
      location: 'Tech Hub, Block E, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-blockchain',
    },
    {
      id: 'on-011',
      title: 'Game Development with Unity',
      description: 'Create 2D and 3D games using Unity Engine and C#. Build a complete platformer game from scratch. Learn physics, animation, and publishing to Google Play. No prior game dev experience needed.',
      date: '2026-04-30',
      time: '02:00 PM',
      location: 'Game Dev Lab, Block G, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Dr. Rajesh Kumar',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-gamedev',
    },
    {
      id: 'on-012',
      title: 'SRM Entrepreneurship Summit — StartupSRM',
      description: 'Pitch your startup idea to angel investors and VCs from Chennai startup ecosystem. Workshops on business model canvas, fundraising, and growth hacking. Top 3 ideas get seed funding of ₹50,000 each.',
      date: '2026-05-02',
      time: '10:00 AM',
      location: 'Convention Center, SRM Ramapuram',
      college: 'SRMIST RAMAPURAM',
      organizer: 'Prof. Meera Nair',
      category: 'Summit',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srm-startup-summit',
    },
  ];

  // ─────────────────────────────────────────────
  //  OFF-CAMPUS EVENTS (Other TN Colleges)
  // ─────────────────────────────────────────────
  const offCampusEvents = [
    {
      id: 'off-001',
      title: 'Pragyan — NIT Trichy Tech Fest',
      description: 'NIT Trichy\'s international techno-managerial fest. Features coding contests, robotics battles, paper presentations, and workshops by IIT alumni. Over 5,000 participants from 200+ colleges across India.',
      date: '2026-04-12',
      time: '09:00 AM',
      location: 'NIT Trichy Campus, Tiruchirappalli',
      college: 'NIT Tiruchirappalli',
      organizer: 'Pragyan Committee',
      category: 'Hackathon',
      posterUrl: null,
      registrationUrl: 'https://www.pragyan.org/register',
    },
    {
      id: 'off-002',
      title: 'graVITas — VIT Vellore Tech Fest',
      description: 'VIT Vellore\'s flagship technical festival with 60+ events across coding, robotics, AI, and design. International hackathon with ₹5,00,000 prize pool. Celebrity tech talk and EDM night included.',
      date: '2026-04-14',
      time: '08:00 AM',
      location: 'VIT Main Campus, Vellore',
      college: 'VIT Vellore',
      organizer: 'graVITas Core Team',
      category: 'Summit',
      posterUrl: null,
      registrationUrl: 'https://gravitas.vit.ac.in/register',
    },
    {
      id: 'off-003',
      title: 'Kurukshetra — CEG Anna University Fest',
      description: 'Anna University\'s premier techno-management fest. Flagship events include code-a-thon, robo wars, drone racing, and startup pitch competition. Guest lectures by ISRO and DRDO scientists.',
      date: '2026-04-16',
      time: '09:30 AM',
      location: 'College of Engineering Guindy, Anna University, Chennai',
      college: 'Anna University CEG',
      organizer: 'Kurukshetra Team',
      category: 'Competition',
      posterUrl: null,
      registrationUrl: 'https://kurukshetra.org.in/register',
    },
    {
      id: 'off-004',
      title: 'Shaastra — IIT Madras Tech Fest',
      description: 'One of India\'s largest student-run tech fests. Workshops on quantum computing, space tech, and nanotechnology. International programming contest and robotics challenge. Transportation provided from SRM.',
      date: '2026-05-01',
      time: '08:00 AM',
      location: 'IIT Madras Campus, Adyar, Chennai',
      college: 'IIT Madras',
      organizer: 'Shaastra Committee',
      category: 'Summit',
      posterUrl: null,
      registrationUrl: 'https://shaastra.org/register',
    },
    {
      id: 'off-005',
      title: 'Flutter & Firebase Workshop — Sathyabama',
      description: 'Hands-on workshop on building cross-platform mobile apps with Flutter and Firebase. Build a social media app with authentication, real-time database, and cloud functions. Open to all Tamil Nadu students.',
      date: '2026-04-17',
      time: '10:00 AM',
      location: 'IT Block, Sathyabama University, Chennai',
      college: 'Sathyabama University',
      organizer: 'Prof. Lakshmi Priya',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/sathyabama-flutter',
    },
    {
      id: 'off-006',
      title: 'Cloud Native Day — VIT Chennai',
      description: 'Full-day conference on cloud-native technologies. Talks on Kubernetes, microservices, serverless architecture, and observability. Sponsored by Google Cloud and Red Hat. Free cloud credits for attendees.',
      date: '2026-04-24',
      time: '09:00 AM',
      location: 'VIT Chennai Campus, Vandalur',
      college: 'VIT Chennai',
      organizer: 'Amit Sharma',
      category: 'Seminar',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/vit-cloud-native',
    },
    {
      id: 'off-007',
      title: 'RoboRace 2026 — SSN College',
      description: 'Build autonomous line-following and obstacle-avoiding robots. Categories: Line follower, maze solver, sumo bot. Prize pool of ₹75,000. Workshop on Day 1, competition on Day 2. Components can be purchased on-site.',
      date: '2026-04-26',
      time: '10:00 AM',
      location: 'SSN College of Engineering, Kalavakkam, Chennai',
      college: 'SSN College of Engineering',
      organizer: 'SSN Robotics Club',
      category: 'Competition',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/ssn-roborace',
    },
    {
      id: 'off-008',
      title: 'Ethical Hacking Bootcamp — SRM KTR',
      description: '2-day intensive bootcamp on ethical hacking and penetration testing. Covers Kali Linux, Burp Suite, Metasploit, and OWASP Top 10. CTF challenge on Day 2. CEH preparation material provided. Open to all colleges.',
      date: '2026-04-29',
      time: '09:00 AM',
      location: 'Tech Park, SRM Kattankulathur Campus',
      college: 'SRMIST Kattankulathur',
      organizer: 'CyberSRM Club',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/srmktr-hacking',
    },
    {
      id: 'off-009',
      title: 'TechSpark — Madras Institute of Technology',
      description: 'MIT Chennai\'s annual tech symposium. Events include paper presentation, project expo, debugging contest, and AI art challenge. Special session on satellite technology by former ISRO chairman.',
      date: '2026-05-03',
      time: '09:00 AM',
      location: 'MIT Campus, Chromepet, Chennai',
      college: 'MIT Chennai (Anna University)',
      organizer: 'TechSpark Committee',
      category: 'Symposium',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/mit-techspark',
    },
    {
      id: 'off-010',
      title: 'Data Analytics Summit — PSG Tech Coimbatore',
      description: 'Industry-academia conference on data analytics, business intelligence, and AI-driven decision making. Speakers from TCS, Infosys, and CTS. Case study competitions with real-world datasets. Travel reimbursement available.',
      date: '2026-05-05',
      time: '10:00 AM',
      location: 'PSG College of Technology, Coimbatore',
      college: 'PSG College of Technology',
      organizer: 'PSG Analytics Club',
      category: 'Summit',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/psg-data-summit',
    },
    {
      id: 'off-011',
      title: 'Innovate TN — Loyola College Hackathon',
      description: '36-hour social impact hackathon. Build tech solutions for healthcare, education, agriculture, and smart cities. Mentorship from Chennai startup founders. Top 5 teams present to government officials.',
      date: '2026-05-07',
      time: '06:00 PM',
      location: 'Loyola College, Nungambakkam, Chennai',
      college: 'Loyola College Chennai',
      organizer: 'Loyola Tech Society',
      category: 'Hackathon',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/loyola-innovate',
    },
    {
      id: 'off-012',
      title: 'ML Ops & GenAI Workshop — SASTRA Thanjavur',
      description: 'Advanced workshop on MLOps pipelines, model deployment with FastAPI, and building GenAI applications using LangChain and vector databases. Hands-on with Hugging Face transformers. Intermediate Python required.',
      date: '2026-05-08',
      time: '09:30 AM',
      location: 'SASTRA University, Thanjavur',
      college: 'SASTRA University',
      organizer: 'SASTRA AI Club',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/sastra-mlops',
    },
    {
      id: 'off-013',
      title: 'Embedded Systems Workshop — CEG Anna Univ',
      description: 'ARM Cortex-M programming, RTOS concepts, and embedded Linux. Build a weather station with ESP32 and publish data to ThingSpeak. IEEE certification for participants. Limited to 60 seats.',
      date: '2026-05-10',
      time: '10:00 AM',
      location: 'ECE Dept, College of Engineering Guindy, Chennai',
      college: 'Anna University CEG',
      organizer: 'IEEE Student Branch CEG',
      category: 'Workshop',
      posterUrl: null,
      registrationUrl: 'https://forms.google.com/ceg-embedded',
    },
  ];

  // Insert all events
  const insertQuery = `INSERT INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  console.log('\n📍 Inserting ON-CAMPUS events (SRM Ramapuram)...');
  for (const e of onCampusEvents) {
    await connection.query(insertQuery, [e.id, e.title, e.description, e.date, e.time, e.location, e.college, e.organizer, e.category, e.posterUrl, e.registrationUrl, '[]']);
    console.log(`  ✓ ${e.title}`);
  }

  console.log('\n🌐 Inserting OFF-CAMPUS events (Other TN Colleges)...');
  for (const e of offCampusEvents) {
    await connection.query(insertQuery, [e.id, e.title, e.description, e.date, e.time, e.location, e.college, e.organizer, e.category, e.posterUrl, e.registrationUrl, '[]']);
    console.log(`  ✓ ${e.title} — ${e.college}`);
  }

  // Update organizer users for off-campus colleges
  const offCampusOrganizers = [
    { id: 'user-org-nit', name: 'Pragyan Committee', email: 'pragyan@nitt.edu', college: 'NIT Tiruchirappalli' },
    { id: 'user-org-vit', name: 'graVITas Core Team', email: 'gravitas@vit.ac.in', college: 'VIT Vellore' },
    { id: 'user-org-ceg', name: 'Kurukshetra Team', email: 'kurukshetra@annauniv.edu', college: 'Anna University CEG' },
    { id: 'user-org-iitm', name: 'Shaastra Committee', email: 'shaastra@iitm.ac.in', college: 'IIT Madras' },
    { id: 'user-org-sathy', name: 'Prof. Lakshmi Priya', email: 'lakshmi@sathyabama.ac.in', college: 'Sathyabama University' },
    { id: 'user-org-ssn', name: 'SSN Robotics Club', email: 'robotics@ssn.edu.in', college: 'SSN College of Engineering' },
    { id: 'user-org-srmk', name: 'CyberSRM Club', email: 'cybersrm@srmist.edu.in', college: 'SRMIST Kattankulathur' },
    { id: 'user-org-psg', name: 'PSG Analytics Club', email: 'analytics@psgtech.ac.in', college: 'PSG College of Technology' },
    { id: 'user-org-loyola', name: 'Loyola Tech Society', email: 'tech@loyolacollege.edu', college: 'Loyola College Chennai' },
    { id: 'user-org-sastra', name: 'SASTRA AI Club', email: 'aiclub@sastra.ac.in', college: 'SASTRA University' },
  ];

  console.log('\n👥 Adding off-campus organizer accounts...');
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('password123', 10);

  for (const org of offCampusOrganizers) {
    try {
      await connection.query(
        'INSERT IGNORE INTO users (id, name, email, passwordHash, role, college, interests, registeredEvents, bookmarks, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [org.id, org.name, org.email, hash, 'organizer', org.college, '[]', '[]', '[]']
      );
      console.log(`  ✓ ${org.name} (${org.college})`);
    } catch (err) {
      console.log(`  ⊘ Skipped ${org.name}: ${err.message}`);
    }
  }

  await connection.end();

  console.log('\n✅ Campus events seeded successfully!');
  console.log(`   📍 ${onCampusEvents.length} ON-CAMPUS events (SRM Ramapuram Chennai)`);
  console.log(`   🌐 ${offCampusEvents.length} OFF-CAMPUS events (Other TN Colleges)`);
  console.log(`   📊 ${onCampusEvents.length + offCampusEvents.length} total events`);
  process.exit(0);
}

seedCampusEvents().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
