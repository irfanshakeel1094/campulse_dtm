import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap, Bell, Sun, Moon, LogOut, User, ChevronDown, Menu, X,
  LayoutDashboard, CalendarDays, BookOpen, PlusCircle, List
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/student/events', label: 'Events', icon: <BookOpen size={16} /> },
    { to: '/student/calendar', label: 'Calendar', icon: <CalendarDays size={16} /> },
  ];

  const organizerLinks = [
    { to: '/organizer/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/organizer/create', label: 'Post Event', icon: <PlusCircle size={16} /> },
    { to: '/organizer/events', label: 'My Events', icon: <List size={16} /> },
  ];

  const navLinks = user?.role === 'student' ? studentLinks : organizerLinks;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? (user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard') : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-tertiary rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-black gradient-text">Campulse</span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.to
                      ? 'bg-primary/15 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(prev => !prev)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors relative"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-tertiary rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden animate-slide-up">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
                        <h3 className="font-semibold text-on-surface">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary hover:text-primary-dim font-medium">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-on-surface-variant text-sm">
                            <Bell size={32} className="mx-auto mb-2 opacity-30" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              className={`notif-item ${!notif.read ? 'bg-primary/10' : ''}`}
                              onClick={() => markRead(notif.id)}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-primary' : 'bg-outline-variant'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-on-surface leading-snug">{notif.message}</p>
                                <p className="text-xs text-on-surface-variant mt-1">
                                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-tertiary rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-on-surface max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-on-surface-variant" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden animate-slide-up">
                      <div className="px-4 py-3 border-b border-outline-variant/10">
                        <p className="font-semibold text-sm text-on-surface truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant capitalize">{user.role} • {user.college}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 !text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {user && (
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg"
                onClick={() => setMobileOpen(prev => !prev)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {user && mobileOpen && (
          <div className="md:hidden pb-3 border-t border-outline-variant/10 pt-2 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === link.to
                    ? 'text-primary bg-primary/15'
                    : 'text-on-surface-variant'
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
