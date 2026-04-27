import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function EventDiscovery() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const initialTab = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab); // 'all' | 'on-campus' | 'off-campus'

  const CATEGORIES = ['Hackathon', 'AI/ML', 'Web Dev', 'Cybersecurity', 'Cloud Computing', 'Workshop', 'Symposium', 'Coding Contest', 'Summit', 'Seminar', 'Competition', 'Data Science'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const isOnCampus = (event) => {
    return event.college && event.college.toUpperCase() === 'SRMIST RAMAPURAM';
  };

  const applyFilters = (list) => {
    let result = list;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.title?.toLowerCase().includes(term) ||
        e.college?.toLowerCase().includes(term) ||
        e.category?.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter(e => selectedCategories.includes(e.category));
    }
    return result;
  };

  const onCampusEvents = applyFilters(events.filter(isOnCampus));
  const offCampusEvents = applyFilters(events.filter(e => !isOnCampus(e)));
  const allFilteredEvents = applyFilters(events);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // On-campus placeholder images
  const onCampusImages = [
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=500&fit=crop',
  ];

  // Off-campus placeholder images
  const offCampusImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=800&h=500&fit=crop',
  ];

  const getEventImage = (event, idx) => {
    if (event.posterUrl) {
      return event.posterUrl.startsWith('http')
        ? event.posterUrl
        : `http://localhost:5000${event.posterUrl}`;
    }
    const images = isOnCampus(event) ? onCampusImages : offCampusImages;
    return images[idx % images.length];
  };

  // Render an event card
  const EventCard = ({ event, idx }) => {
    const onCamp = isOnCampus(event);
    return (
      <Link
        to={`/student/events/${event.id}`}
        className="group rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="aspect-[16/10] w-full relative overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={getEventImage(event, idx)}
            alt={event.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Category Tag */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container/60 backdrop-blur-md text-on-surface text-[10px] font-black uppercase tracking-widest">
            {event.category || 'Event'}
          </span>

          {/* Campus Badge */}
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
            onCamp
              ? 'bg-tertiary/20 text-tertiary border-tertiary/30'
              : 'bg-secondary/20 text-secondary border-secondary/30'
          }`}>
            {onCamp ? '📍 SRM' : '🌐 External'}
          </span>

          {/* Date overlay */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-surface-container/80 backdrop-blur-md rounded-xl px-3 py-2 text-center border border-outline-variant/20">
              <p className="text-[10px] uppercase font-bold text-tertiary">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </p>
              <p className="text-xl font-black font-headline leading-none">
                {new Date(event.date).getDate()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-lg font-headline font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h4>
          <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">
            {event.description || 'Exciting campus event'}
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-3">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="truncate">{event.location || event.venue || 'Campus'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              onCamp
                ? 'bg-tertiary/20 text-tertiary'
                : 'bg-secondary/20 text-secondary'
            }`}>
              {onCamp ? 'On Campus' : event.college}
            </span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">schedule</span>
              {event.time || '10:00 AM'}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  // Section renderer
  const EventSection = ({ title, subtitle, icon, events, colorClass, badgeText }) => {
    if (events.length === 0) return null;
    return (
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-headline font-extrabold tracking-tight flex items-center gap-3">
                {title}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colorClass}`}>
                  {events.length} {events.length === 1 ? 'Event' : 'Events'}
                </span>
              </h3>
              <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <EventCard key={event.id} event={event} idx={idx} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-background min-h-screen text-on-surface relative overflow-x-hidden bg-grid">
      <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-[320px] h-[320px] bg-secondary/10 blur-[110px] rounded-full" />
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary font-headline">Campulse</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/student/dashboard" className="text-on-surface/70 hover:text-primary transition-colors duration-300 font-headline tracking-tight">Dashboard</Link>
              <a className="text-primary border-b-2 border-primary pb-1 font-headline tracking-tight transition-colors duration-300">Events</a>
              <Link to="/student/calendar" className="text-on-surface/70 hover:text-primary transition-colors duration-300 font-headline tracking-tight">Calendar</Link>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full bg-surface-container border-none rounded-xl py-2 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary transition-all"
                placeholder="Search events, colleges, categories..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface/70 hover:text-primary transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/student/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer bg-surface-container flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface-container-low flex-col py-6 hidden lg:flex" style={{ boxShadow: '20px 0 40px rgba(0,0,0,0.4)' }}>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-background font-bold">bolt</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-primary uppercase tracking-widest font-headline">Campulse</h1>
            <p className="text-[10px] text-on-surface/60 font-medium uppercase tracking-tighter">College Event Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/student/dashboard" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all font-headline font-medium">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <a className="bg-primary text-background rounded-lg mx-2 my-1 px-4 py-3 font-bold flex items-center gap-3 scale-[1.02] transition-all">
            <span className="material-symbols-outlined">event</span>
            <span>Events</span>
          </a>
          <Link to="/student/calendar" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all font-headline font-medium">
            <span className="material-symbols-outlined">calendar_month</span>
            <span>Calendar</span>
          </Link>
          <a className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all font-headline font-medium">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="px-4 mt-auto space-y-4">
          <Link to="/student/events" className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(186,158,255,0.2)] hover:shadow-[0_10px_25px_rgba(186,158,255,0.4)] transition-all active:scale-95">
            <span className="material-symbols-outlined">rocket_launch</span>
            <span>Explore Events</span>
          </Link>
          <div className="pt-4 space-y-1">
            <a className="text-on-surface/60 mx-2 my-1 px-4 py-2 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all text-sm">
              <span className="material-symbols-outlined text-xl">help</span>
              <span>Help Center</span>
            </a>
            <button onClick={() => { logout(); window.location.href = '/'; }} className="w-full text-left text-on-surface/60 mx-2 my-1 px-4 py-2 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all text-sm">
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-24 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-black font-headline tracking-tighter mb-2">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Events</span>
            </h2>
            <p className="text-on-surface-variant">
              Explore {events.length} events from SRM Ramapuram and top colleges across Tamil Nadu.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {[
              { key: 'all', label: 'All Events', icon: 'apps', count: allFilteredEvents.length },
              { key: 'on-campus', label: 'On Campus', icon: 'school', count: onCampusEvents.length },
              { key: 'off-campus', label: 'Off Campus', icon: 'explore', count: offCampusEvents.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? tab.key === 'on-campus'
                      ? 'bg-tertiary text-background shadow-lg shadow-tertiary/20'
                      : tab.key === 'off-campus'
                      ? 'bg-secondary text-background shadow-lg shadow-secondary/20'
                      : 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-surface-container'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {/* Category filter dropdown */}
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-error flex items-center gap-1 px-3 py-1.5 rounded-full bg-error-container/30 hover:bg-error-container transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => {
              const count = events.filter(e => e.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    selectedCategories.includes(cat)
                      ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-primary/40'
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ALL EVENTS TAB */}
              {activeTab === 'all' && (
                <>
                  {/* On Campus Section */}
                  <EventSection
                    title="On Campus"
                    subtitle="Events at SRMIST Ramapuram, Chennai"
                    icon="school"
                    events={onCampusEvents}
                    colorClass="bg-tertiary/20 text-tertiary"
                    badgeText="SRM"
                  />

                  {/* Off Campus Section */}
                  <EventSection
                    title="Off Campus"
                    subtitle="Events from top colleges across Tamil Nadu"
                    icon="explore"
                    events={offCampusEvents}
                    colorClass="bg-secondary/20 text-secondary"
                    badgeText="External"
                  />

                  {onCampusEvents.length === 0 && offCampusEvents.length === 0 && (
                    <div className="text-center py-20 text-on-surface-variant">
                      <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">event_busy</span>
                      <p className="text-lg font-medium">No events found</p>
                      <p className="text-sm mt-1">Try adjusting your search or category filters.</p>
                    </div>
                  )}
                </>
              )}

              {/* ON CAMPUS TAB */}
              {activeTab === 'on-campus' && (
                <>
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-tertiary/10 to-transparent border border-tertiary/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-2xl">school</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-lg">SRMIST Ramapuram Events</h4>
                      <p className="text-sm text-on-surface-variant">Showing events happening at your campus. Don't miss out!</p>
                    </div>
                    <span className="ml-auto text-3xl font-black text-tertiary font-headline">{onCampusEvents.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {onCampusEvents.map((event, idx) => (
                      <EventCard key={event.id} event={event} idx={idx} />
                    ))}
                  </div>
                  {onCampusEvents.length === 0 && (
                    <div className="text-center py-20 text-on-surface-variant">
                      <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">event_busy</span>
                      <p className="text-lg font-medium">No on-campus events found</p>
                      <p className="text-sm mt-1">Try adjusting your search or category filters.</p>
                    </div>
                  )}
                </>
              )}

              {/* OFF CAMPUS TAB */}
              {activeTab === 'off-campus' && (
                <>
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-2xl">explore</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-lg">Off Campus Events</h4>
                      <p className="text-sm text-on-surface-variant">Events from top colleges across Tamil Nadu — VIT, IIT Madras, Anna University, and more.</p>
                    </div>
                    <span className="ml-auto text-3xl font-black text-secondary font-headline">{offCampusEvents.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {offCampusEvents.map((event, idx) => (
                      <EventCard key={event.id} event={event} idx={idx} />
                    ))}
                  </div>
                  {offCampusEvents.length === 0 && (
                    <div className="text-center py-20 text-on-surface-variant">
                      <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">event_busy</span>
                      <p className="text-lg font-medium">No off-campus events found</p>
                      <p className="text-sm mt-1">Try adjusting your search or category filters.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/60 backdrop-blur-xl border-t border-outline-variant/10 z-50 flex justify-around items-center py-3 px-4">
        <Link to="/student/dashboard" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <a className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined filled">event</span>
          <span className="text-[10px] font-bold">Events</span>
        </a>
        <Link to="/student/calendar" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px] font-bold">Calendar</span>
        </Link>
        <Link to="/student/profile" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
