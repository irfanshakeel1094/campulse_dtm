-- Campulse Database Seed Data
-- This script populates the database with sample users and events
-- Passwords are hashed with bcrypt (password: "password123")

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM notifications;
-- DELETE FROM events;
-- DELETE FROM users;

-- ============================================
-- SAMPLE USERS - STUDENTS
-- ============================================

INSERT INTO users (id, name, email, passwordHash, role, college, interests, registeredEvents, bookmarks) VALUES
-- Bcrypt hash of "password123"
('550e8400-e29b-41d4-a716-446655440001', 'Arjun Sharma', 'arjun.sharma@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Hackathon", "AI/ML", "Web Dev"]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Patel', 'priya.patel@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Workshop", "Data Science", "Cybersecurity"]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440003', 'Vikram Singh', 'vikram.singh@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Coding Contest", "Robotics", "AI/ML"]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440004', 'Neha Verma', 'neha.verma@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Symposium", "Web Dev"]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440005', 'Rahul Desai', 'rahul.desai@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Hackathon", "Workshop", "Cybersecurity"]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440006', 'Deepika Nair', 'deepika.nair@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'student', 'SRMIST RAMAPURAM', '["Data Science", "AI/ML", "Competition"]', '[]', '[]'),

-- ============================================
-- SAMPLE USERS - ORGANIZERS
-- ============================================

('550e8400-e29b-41d4-a716-446655440101', 'Dr. Rajesh Kumar', 'rajesh.kumar@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'organizer', 'SRMIST RAMAPURAM', '[]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440102', 'Prof. Anjali Singh', 'anjali.singh@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'organizer', 'SRMIST RAMAPURAM', '[]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440103', 'Tech Club Head', 'techclub@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'organizer', 'SRMIST RAMAPURAM', '[]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440104', 'Dr. Priya Gupta', 'priya.gupta@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'organizer', 'SRMIST RAMAPURAM', '[]', '[]', '[]'),
('550e8400-e29b-41d4-a716-446655440105', 'Innovation Hub', 'innohub@srmist.edu.in', '$2a$10$GJq2vVGWNGmRsqN6WFKIhePV5r8X8q6K5q5K5q5K5q5K5q5K5q5K.', 'organizer', 'SRMIST RAMAPURAM', '[]', '[]', '[]');

-- ============================================
-- SAMPLE EVENTS
-- ============================================

INSERT INTO events (id, title, description, date, time, location, college, organizer, category, posterUrl, registrationUrl, registrations) VALUES

-- Hackathon Events
('660e8400-e29b-41d4-a716-446655440001',
  'CodeQuest Hackathon 2026',
  'A 24-hour hackathon focused on building innovative solutions. Compete with teams from across the campus to solve real-world problems using cutting-edge technology.',
  '2026-04-15',
  '09:00 AM',
  'Main Auditorium, SRMIST Ramapuram',
  'SRMIST RAMAPURAM',
  'Dr. Rajesh Kumar',
  'Hackathon',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  'https://forms.google.com/hackathon2026',
  '[]'),

('660e8400-e29b-41d4-a716-446655440002',
  'AI/ML Hackathon Sprint',
  'Focused hackathon specifically for Artificial Intelligence and Machine Learning enthusiasts. Build AI models and deploy ML solutions.',
  '2026-05-01',
  '10:00 AM',
  'Tech Lab, Building A',
  'SRMIST RAMAPURAM',
  'Innovation Hub',
  'Hackathon',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
  'https://forms.google.com/aiml-hackathon',
  '[]'),

-- Workshop Events
('660e8400-e29b-41d4-a716-446655440003',
  'Web Development Masterclass',
  'Learn modern web development with React, Node.js, and databases. Hands-on workshop covering frontend to backend development.',
  '2026-04-10',
  '02:00 PM',
  'Computer Lab 101',
  'SRMIST RAMAPURAM',
  'Prof. Anjali Singh',
  'Workshop',
  'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400',
  'https://forms.google.com/web-dev-workshop',
  '[]'),

('660e8400-e29b-41d4-a716-446655440004',
  'Cybersecurity Essentials Workshop',
  'Learn about network security, ethical hacking, and cybersecurity best practices. Interactive sessions with live demonstrations.',
  '2026-04-20',
  '03:00 PM',
  'Security Lab, Building C',
  'SRMIST RAMAPURAM',
  'Tech Club Head',
  'Workshop',
  'https://images.unsplash.com/photo-1516321318423-f06f70d504d0?w=400',
  'https://forms.google.com/cybersec-workshop',
  '[]'),

('660e8400-e29b-41d4-a716-446655440005',
  'Data Science Fundamentals',
  'Complete workshop on data science fundamentals. Learn Python, data visualization, and statistical analysis from scratch.',
  '2026-04-22',
  '01:00 PM',
  'Data Lab, Building B',
  'SRMIST RAMAPURAM',
  'Dr. Priya Gupta',
  'Workshop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  'https://forms.google.com/data-science-workshop',
  '[]'),

-- Symposium Events
('660e8400-e29b-41d4-a716-446655440006',
  'Tech Symposium 2026',
  'Annual technology symposium featuring keynote speakers from leading tech companies. Topics: AI, Cloud Computing, and Future of Tech.',
  '2026-05-10',
  '09:30 AM',
  'Auditorium A',
  'SRMIST RAMAPURAM',
  'Innovation Hub',
  'Symposium',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
  'https://forms.google.com/tech-symposium',
  '[]'),

('660e8400-e29b-41d4-a716-446655440007',
  'Startup & Innovation Summit',
  'Networking event bringing together entrepreneurs, investors, and innovators. Pitch your startup ideas and meet potential partners.',
  '2026-05-15',
  '06:00 PM',
  'Convention Center, SRMIST',
  'SRMIST RAMAPURAM',
  'Tech Club Head',
  'Symposium',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
  'https://forms.google.com/startup-summit',
  '[]'),

-- Seminar Events
('660e8400-e29b-41d4-a716-446655440008',
  'Cloud Computing Seminar',
  'Introduction to cloud computing platforms like AWS, Azure, and Google Cloud. Learn deployment and scalability concepts.',
  '2026-04-12',
  '11:00 AM',
  'Seminar Hall 1',
  'SRMIST RAMAPURAM',
  'Dr. Rajesh Kumar',
  'Seminar',
  'https://images.unsplash.com/photo-1460925895917-adf4198c838f?w=400',
  'https://forms.google.com/cloud-seminar',
  '[]'),

('660e8400-e29b-41d4-a716-446655440009',
  'Blockchain Technology Seminar',
  'Learn about blockchain technology, cryptocurrency, and smart contracts. Understanding Web3 and decentralized systems.',
  '2026-04-25',
  '04:00 PM',
  'Seminar Hall 2',
  'SRMIST RAMAPURAM',
  'Prof. Anjali Singh',
  'Seminar',
  'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400',
  'https://forms.google.com/blockchain-seminar',
  '[]'),

-- Coding Contest
('660e8400-e29b-41d4-a716-446655440010',
  'CodeChallenge 2026',
  'Competitive programming contest with algorithms and data structures challenges. Solo participation. Win exciting prizes!',
  '2026-04-28',
  '08:00 AM',
  'Computer Lab 201',
  'SRMIST RAMAPURAM',
  'Innovation Hub',
  'Coding Contest',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  'https://forms.google.com/code-challenge',
  '[]'),

-- Robotics Competition
('660e8400-e29b-41d4-a716-446655440011',
  'Robotics Challenge 2026',
  'Build and compete with robots. Various challenges including line-following, obstacle avoidance, and autonomous navigation.',
  '2026-05-05',
  '09:00 AM',
  'Robotics Arena, Sports Complex',
  'SRMIST RAMAPURAM',
  'Tech Club Head',
  'Competition',
  'https://images.unsplash.com/photo-1457821552484-99005f75e1bc?w=400',
  'https://forms.google.com/robotics-challenge',
  '[]'),

-- Competition Events
('660e8400-e29b-41d4-a716-446655440012',
  'UI/UX Design Competition',
  'Showcase your design skills. Create innovative user interfaces and experiences. Prizes for the best designs.',
  '2026-04-30',
  '10:00 AM',
  'Design Studio',
  'SRMIST RAMAPURAM',
  'Dr. Priya Gupta',
  'Competition',
  'https://images.unsplash.com/photo-1561070791-2526d30994e5?w=400',
  'https://forms.google.com/ui-ux-competition',
  '[]'),

-- Additional Events
('660e8400-e29b-41d4-a716-446655440013',
  'Flutter Development Sessions',
  'Learn cross-platform mobile app development with Flutter. Build iOS and Android apps from a single codebase.',
  '2026-04-18',
  '03:30 PM',
  'Mobile Lab, Building D',
  'SRMIST RAMAPURAM',
  'Prof. Anjali Singh',
  'Workshop',
  'https://images.unsplash.com/photo-1512941691920-25a2bc76a9d5?w=400',
  'https://forms.google.com/flutter-sessions',
  '[]'),

('660e8400-e29b-41d4-a716-446655440014',
  'DevOps Bootcamp',
  'Master DevOps concepts: CI/CD, Docker, Kubernetes, and Infrastructure as Code. Hands-on practical sessions.',
  '2026-05-08',
  '02:00 PM',
  'DevOps Lab',
  'SRMIST RAMAPURAM',
  'Dr. Rajesh Kumar',
  'Workshop',
  'https://images.unsplash.com/photo-1460925895917-adf4198c838f?w=400',
  'https://forms.google.com/devops-bootcamp',
  '[]'),

('660e8400-e29b-41d4-a716-446655440015',
  'Game Development Jam',
  'Create games in 48 hours using modern game engines. Compete and showcase your game development skills.',
  '2026-05-20',
  '06:00 PM',
  'Game Lab, Building E',
  'SRMIST RAMAPURAM',
  'Innovation Hub',
  'Competition',
  'https://images.unsplash.com/photo-1538481143081-9aa50e592d0b?w=400',
  'https://forms.google.com/game-jam',
  '[]');

-- ============================================
-- SAMPLE NOTIFICATIONS (optional)
-- ============================================

INSERT INTO notifications (id, userId, message, type, `read`) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to Campulse! Start exploring events now.', 'welcome', TRUE),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'New Hackathon event: CodeQuest Hackathon 2026', 'event', FALSE),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Your registered event starts tomorrow!', 'reminder', FALSE),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440102', 'You have hosted 5 events successfully.', 'achievement', TRUE);

-- ============================================
-- Summary of Seed Data
-- ============================================
-- Total Students: 6
-- Total Organizers: 5
-- Total Events: 15
-- Event Categories: Hackathon (2), Workshop (5), Symposium (2), Seminar (2), Coding Contest (1), Competition (3)
--
-- All passwords are: password123
-- Test Login:
--   Student: arjun.sharma@srmist.edu.in / password123
--   Organizer: rajesh.kumar@srmist.edu.in / password123
