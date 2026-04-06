# 🚀 Campulse — College Event Hub

**Campulse** is a modern, full-stack web platform designed to connect students with technical events from various colleges (like SRMIST Ramapuram). It provides a seamless experience for **students** to discover events and for **organizers** to manage and publish them.

![Campulse Banner](https://via.placeholder.com/1000x300.png?text=Campulse+-+College+Event+Hub) *(Feel free to replace this placeholder badge with an actual screenshot)*

## ✨ Features

* ** Role-Based Authentication:** Distinct roles and dynamic interfaces for both **Students** and **Organizers**.
* ** Student Dashboard & Calendar:** An intuitive dashboard for students to track upcoming events, discover SRM-specific activities, and view their schedule through a visual calendar.
* ** Organizer Management:** Organizers can seamlessly create events, upload promotional posters/banners, and link out to Google Forms for registration.
* ** Notification System:** Stay up-to-date with automatic alerts about newly posted and incoming events.

## 🛠️ Tech Stack

**Frontend:**
* [React.js](https://react.dev/) (via [Vite](https://vitejs.dev/))
* [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive styling
* [Lucide React](https://lucide.dev/) for crisp, consistent iconography
* `react-router-dom` for client-side routing
* `axios` for API queries

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) for the REST API
* REST API Architecture
* **LowDB** (JSON-file based memory storage) for persisting `users`, `events`, and `notifications` data.
* `bcryptjs` and `jsonwebtoken` for secure password hashing and JWT-based authentication.
* `multer` for robust file processing and image uploads.

## 🚀 Getting Started

Follow these steps to set up and run the Campulse platform locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.x or newer)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/kabilan-11129/CAMPULSE.git
cd CAMPULSE
```

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and start the development server.
```bash
cd server
npm install
# Ensures a .env file is set up with variables like PORT=5000 and JWT_SECRET=your_jwt_secret
npm start
```
*The backend API will run on `http://localhost:5000/api`*

### 3. Frontend Setup
Open a new terminal session, navigate to the `client` directory, install dependencies, and start the app.
```bash
cd client
npm install
npm run dev
```
*The frontend web application will run on `http://localhost:5173` (or the port specified by Vite in the terminal)*

## 📂 Project Structure

```bash
CAMPULSE/
├── client/                 # React Frontend (Vite)
│   ├── src/                # Source files (Pages, Components, Context, API interface)
│   ├── public/             # Static Assets
│   ├── index.html          # HTML Template
│   ├── package.json        
│   └── tailwind.config.js  
│
└── server/                 # Node/Express Backend
    ├── index.js            # Express Entry point
    ├── routes/             # API Router definitions (Auth, Events, Notifications)
    ├── middleware/         # Custom Middlewares (JWT auth checking, etc)
    ├── data/               # LowDB JSON databases (users.json, events.json, etc)
    ├── uploads/            # Multer stored static assets (Banners, Posters)
    └── package.json        
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
**Maintained by:** [kabilan-11129](https://github.com/kabilan-11129)
