import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setAllEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isOnCampus = (e) => e.college && e.college.toUpperCase() === 'SRMIST RAMAPURAM';

  const onCampusEvents = allEvents.filter(isOnCampus);
  const offCampusEvents = allEvents.filter(e => !isOnCampus(e));

  // Placeholder images
  const onCampusImages = [
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
  ];

  const offCampusImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&h=500&fit=crop',
  ];

  const getImage = (event, idx) => {
    if (event.posterUrl) return `http://localhost:5000${event.posterUrl}`;
    const imgs = isOnCampus(event) ? onCampusImages : offCampusImages;
    return imgs[idx % imgs.length];
  };

  return (
    <div className="bg-background text-on-surface min-h-screen font-body selection:bg-primary/30">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface-container-low flex flex-col py-6 font-headline font-medium hidden md:flex" style={{ boxShadow: '20px 0 40px rgba(0,0,0,0.4)' }}>
        <div className="px-6 mb-10">
          <h1 className="text-xl font-black text-primary uppercase tracking-widest">Campulse</h1>
          <p className="text-[10px] text-secondary/60 mt-1 uppercase tracking-[0.2em]">College Event Hub</p>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/student/dashboard" className="bg-primary text-background rounded-lg mx-2 my-1 px-4 py-3 font-bold flex items-center gap-3 scale-[1.02] duration-200">
            <span className="material-symbols-outlined filled">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/student/events" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">event</span>
            <span>Events</span>
          </Link>
          <Link to="/student/calendar" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">calendar_month</span>
            <span>Calendar</span>
          </Link>
          <a href="#" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="mt-auto px-4 pt-6 space-y-1 border-t border-outline-variant/10">
          <Link to="/student/events" className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-4 hover:shadow-[0_0_20px_rgba(186,158,255,0.2)] transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            <span>Find Events</span>
          </Link>
          <a href="#" className="text-on-surface/60 px-4 py-2 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all">
            <span className="material-symbols-outlined">help</span>
            <span>Help</span>
          </a>
          <button onClick={handleLogout} className="w-full text-left text-on-surface/60 px-4 py-2 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto md:pl-72">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full bg-surface-container border-none rounded-xl py-2 pl-10 pr-4 text-on-surface focus:ring-2 focus:ring-secondary/50 placeholder:text-outline/60"
                placeholder="Search events, clubs, or venues..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface/70 hover:text-primary transition-colors active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface/70 hover:text-primary transition-colors active:scale-95">
              <span className="material-symbols-outlined">bookmarks</span>
            </button>
            <Link to="/student/profile" className="h-10 w-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-colors">
              <span className="text-sm font-bold text-primary">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="md:ml-64 pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Personalized Greeting */}
          <section className="mb-12 relative">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-tertiary font-label font-semibold tracking-[0.2em] uppercase text-xs mb-2 block">
                  Welcome back, {user?.name || 'Student'}
                </span>
                <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface tracking-tighter leading-none">
                  The campus is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">buzzing</span> tonight.
                </h2>
              </div>
              <div className="flex gap-3">
                <Link to="/student/events?tab=on-campus" className="bg-tertiary/10 border border-tertiary/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-tertiary/20 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-tertiary text-sm">school</span>
                  <span className="text-xs font-bold text-tertiary">{onCampusEvents.length} On Campus</span>
                </Link>
                <Link to="/student/events?tab=off-campus" className="bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/20 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-secondary text-sm">explore</span>
                  <span className="text-xs font-bold text-secondary">{offCampusEvents.length} Off Campus</span>
                </Link>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-14">
              {/* ========== ON CAMPUS EVENTS SECTION ========== */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-xl">school</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-extrabold tracking-tight">
                        On Campus
                        <span className="ml-3 text-xs font-bold px-2.5 py-1 rounded-full bg-tertiary/20 text-tertiary">
                          {onCampusEvents.length} Events
                        </span>
                      </h3>
                      <p className="text-sm text-on-surface-variant">Events at SRMIST Ramapuram, Chennai</p>
                    </div>
                  </div>
                  <Link
                    to="/student/events"
                    className="text-sm font-bold text-tertiary flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>

                {/* Featured On-Campus Card */}
                {onCampusEvents[0] && (
                  <Link
                    to={`/student/events/${onCampusEvents[0].id}`}
                    className="block mb-6 relative rounded-2xl overflow-hidden group"
                  >
                    <div className="aspect-[21/9] w-full relative">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={getImage(onCampusEvents[0], 0)}
                        alt={onCampusEvents[0].title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-tertiary/30 backdrop-blur-md text-tertiary text-[10px] font-black uppercase tracking-widest border border-tertiary/30">
                          📍 On Campus
                        </span>
                        <span className="px-3 py-1 rounded-full bg-surface-container/60 backdrop-blur-md text-on-surface text-[10px] font-bold uppercase">
                          {onCampusEvents[0].category}
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-3xl font-headline font-bold text-white mb-2">
                          {onCampusEvents[0].title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-on-surface/80">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(onCampusEvents[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {onCampusEvents[0].location || 'Campus'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {onCampusEvents[0].time || '10:00 AM'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* On-Campus Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {onCampusEvents.slice(1, 4).map((event, idx) => (
                    <Link
                      key={event.id}
                      to={`/student/events/${event.id}`}
                      className="group flex gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/10 hover:border-tertiary/30 transition-all hover:shadow-lg"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={getImage(event, idx + 1)}
                          alt={event.title}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time || '10:00 AM'}
                        </p>
                        <h5 className="text-sm font-bold leading-tight mb-1 group-hover:text-tertiary transition-colors line-clamp-1">
                          {event.title}
                        </h5>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          <span className="truncate">{event.location || 'Campus'}</span>
                        </p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-[10px] font-bold">
                          {event.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ========== OFF CAMPUS EVENTS SECTION ========== */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-xl">explore</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-extrabold tracking-tight">
                        Off Campus
                        <span className="ml-3 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/20 text-secondary">
                          {offCampusEvents.length} Events
                        </span>
                      </h3>
                      <p className="text-sm text-on-surface-variant">Events from top colleges across Tamil Nadu</p>
                    </div>
                  </div>
                  <Link
                    to="/student/events"
                    className="text-sm font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>

                {/* Off-Campus Horizontal Scroll */}
                <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x">
                  {offCampusEvents.slice(0, 6).map((event, idx) => (
                    <Link
                      key={event.id}
                      to={`/student/events/${event.id}`}
                      className="min-w-[300px] max-w-[320px] group rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/10 hover:border-secondary/30 transition-all snap-start shrink-0 hover:shadow-xl"
                    >
                      <div className="aspect-[16/10] w-full relative overflow-hidden">
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          src={getImage(event, idx)}
                          alt={event.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary/20 backdrop-blur-md text-secondary text-[10px] font-bold border border-secondary/30">
                          🌐 {event.college}
                        </span>
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-surface-container/80 backdrop-blur-md rounded-xl px-3 py-1.5 text-center border border-outline-variant/20">
                            <p className="text-[10px] uppercase font-bold text-secondary">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </p>
                            <p className="text-lg font-black font-headline leading-none">
                              {new Date(event.date).getDate()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="text-sm font-bold leading-tight mb-1.5 group-hover:text-secondary transition-colors line-clamp-1">
                          {event.title}
                        </h5>
                        <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            <span className="truncate max-w-[150px]">{event.location}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ========== QUICK STATS ROW ========== */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 bg-gradient-to-br from-tertiary/10 to-transparent rounded-2xl border border-tertiary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-tertiary">school</span>
                    <span className="text-sm font-bold text-on-surface-variant">On Campus</span>
                  </div>
                  <div className="text-4xl font-black text-tertiary font-headline">{onCampusEvents.length}</div>
                  <p className="text-xs text-on-surface-variant mt-1">SRM Ramapuram events available</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-secondary/10 to-transparent rounded-2xl border border-secondary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-secondary">explore</span>
                    <span className="text-sm font-bold text-on-surface-variant">Off Campus</span>
                  </div>
                  <div className="text-4xl font-black text-secondary font-headline">{offCampusEvents.length}</div>
                  <p className="text-xs text-on-surface-variant mt-1">Events from other colleges</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    <span className="text-sm font-bold text-on-surface-variant">Total</span>
                  </div>
                  <div className="text-4xl font-black text-primary font-headline">{allEvents.length}</div>
                  <p className="text-xs text-on-surface-variant mt-1">Events to discover</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl md:hidden z-50 flex justify-around items-center py-4 px-6">
        <Link to="/student/dashboard" className="text-primary flex flex-col items-center gap-1">
          <span className="material-symbols-outlined filled">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link to="/student/events" className="text-on-surface/60 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold">Explore</span>
        </Link>
        <Link to="/student/calendar" className="text-on-surface/60 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px] font-bold">Calendar</span>
        </Link>
        <Link to="/student/profile" className="text-on-surface/60 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
