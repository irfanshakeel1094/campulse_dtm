# Campulse MySQL Setup Guide

## Prerequisites
- MySQL Server installed and running on your machine
- MySQL Workbench (or any MySQL client)
- Node.js installed

## Setup Instructions

### 1. **Update `.env` file** (if needed)
Edit `/server/.env` with your MySQL credentials:

```
PORT=5000
JWT_SECRET=3ea36dc24ad2c8ad7107cdff9b7a89bd6da34e7b6d367c7c8ff3590936d8a7de
JWT_EXPIRES_IN=7d

# MySQL Database Configuration
DB_HOST=localhost          # MySQL host
DB_PORT=3306              # MySQL port
DB_USER=root              # MySQL username
DB_PASSWORD=              # MySQL password (empty if no password)
DB_NAME=campulse_db       # Database name to create
```

### 2. **Initialize Database**
Run this command to create the database and tables:

```bash
cd server
npm run db:init
```

This will:
- ✅ Create the `campulse_db` database
- ✅ Create `users`, `events`, and `notifications` tables
- ✅ Migrate existing data from LowDB (if available)

### 3. **Start the Server**
```bash
npm start
```

You should see:
```
🚀 Campulse Server running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

## Database Schema

### Users Table
- `id` - UUID (Primary Key)
- `name` - User's full name
- `email` - User's email (Unique)
- `passwordHash` - Bcrypted password
- `role` - 'student' or 'organizer'
- `college` - College/Organization name
- `interests` - JSON array of interests
- `registeredEvents` - JSON array
- `bookmarks` - JSON array
- `createdAt` - Timestamp

### Events Table
- `id` - UUID (Primary Key)
- `title` - Event title
- `description` - Event description
- `date` - Event date
- `time` - Event time
- `location` - Event location
- `college` - College hosting event
- `organizer` - Organizer name
- `category` - Event category
- `posterUrl` - Path to poster image
- `registrationUrl` - External registration URL
- `registrations` - JSON array of registered users
- `createdAt` - Timestamp

### Notifications Table
- `id` - UUID (Primary Key)
- `userId` - User ID (Foreign Key)
- `message` - Notification message
- `type` - Type of notification
- `read` - Boolean read status
- `createdAt` - Timestamp

## Verification

To verify your setup is working:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Campulse API is running 🚀",
  "time": "2026-04-06T..."
}
```

## Troubleshooting

**Error: "connect ECONNREFUSED 127.0.0.1:3306"**
- Make sure MySQL server is running
- Check that host, port, username, and password in `.env` are correct

**Error: "Access denied for user"**
- Verify MySQL username and password in `.env`
- Try connecting manually with your MySQL client first

**Error: "Database 'campulse_db' doesn't exist"**
- Run `npm run db:init` again to create the database

## Next Steps

Your Campulse app is now running with MySQL!
- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:5000/api
- **Database**: campulse_db (MySQL)

Try registering a new account - data will be saved to MySQL! 🎉
