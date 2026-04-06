-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('student', 'organizer') NOT NULL,
  college VARCHAR(255),
  interests JSON,
  registeredEvents JSON,
  bookmarks JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date VARCHAR(255),
  time VARCHAR(255),
  location VARCHAR(255),
  college VARCHAR(255),
  organizer VARCHAR(255),
  category VARCHAR(100),
  posterUrl VARCHAR(500),
  registrationUrl VARCHAR(500),
  registrations JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_college (college),
  INDEX idx_organizer (organizer),
  FULLTEXT INDEX ft_title_desc (title, description)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36),
  message TEXT,
  type VARCHAR(50),
  `read` BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);
