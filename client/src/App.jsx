import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentEvents from './pages/student/Events';
import StudentCalendar from './pages/student/CalendarView';
import OrganizerDashboard from './pages/organizer/Dashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import ManageEvents from './pages/organizer/ManageEvents';
import EventDetails from './pages/student/EventDetails';
import StudentProfile from './pages/student/Profile';

// Protected route wrapper
const Protected = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard'} /> : <Register />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<Protected role="student"><StudentDashboard /></Protected>} />
      <Route path="/student/events" element={<Protected role="student"><StudentEvents /></Protected>} />
      <Route path="/student/events/:id" element={<Protected role="student"><EventDetails /></Protected>} />
      <Route path="/student/calendar" element={<Protected role="student"><StudentCalendar /></Protected>} />
      <Route path="/student/profile" element={<Protected role="student"><StudentProfile /></Protected>} />

      {/* Organizer Routes */}
      <Route path="/organizer/dashboard" element={<Protected role="organizer"><OrganizerDashboard /></Protected>} />
      <Route path="/organizer/create" element={<Protected role="organizer"><CreateEvent /></Protected>} />
      <Route path="/organizer/events" element={<Protected role="organizer"><ManageEvents /></Protected>} />
      <Route path="/organizer/edit/:id" element={<Protected role="organizer"><CreateEvent isEdit /></Protected>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
