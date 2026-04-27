import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        // Only show events created by this organizer (match by organizer name or email)
        const myEvents = res.data.filter(e =>
          e.organizer === user?.name ||
          e.organizer === user?.email ||
          e.organizerId === user?.id
        );
        setEvents(myEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Calculate real stats from actual events
  const totalRegistrations = events.reduce((sum, e) => {
    const regs = Array.isArray(e.registrations) ? e.registrations : [];
    return sum + regs.length;
  }, 0);

  const getEventStatus = (event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffHours = (eventDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) return { label: 'Completed', color: 'bg-outline-variant/20 text-on-surface-variant', icon: 'check_circle' };
    if (diffHours < 24) return { label: 'Today', color: 'bg-tertiary/20 text-tertiary', icon: 'timer' };
    if (diffHours < 168) return { label: 'This Week', color: 'bg-primary/20 text-primary', icon: 'calendar_today' };
    return { label: 'Upcoming', color: 'bg-secondary/20 text-secondary', icon: 'event' };
  };

  const getRegistrationCount = (event) => {
    if (Array.isArray(event.registrations)) return event.registrations.length;
    if (typeof event.registrations === 'string') {
      try { return JSON.parse(event.registrations).length; } catch { return 0; }
    }
    return 0;
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop',
  ];

  return (
    <div className="bg-background text-on-background antialiased overflow-x-hidden min-h-screen relative bg-grid">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface-container-low flex-col py-6 font-headline font-medium hidden md:flex" style={{ boxShadow: '20px 0 40px rgba(0,0,0,0.4)' }}>
        <div className="px-6 mb-10">
          <div className="text-xl font-black text-primary uppercase tracking-widest">Campulse</div>
          <div className="text-on-surface/60 text-xs mt-1">College Event Hub</div>
        </div>

        <nav className="flex-1 space-y-1">
          <a className="bg-primary text-background rounded-lg mx-2 my-1 px-4 py-3 font-bold flex items-center gap-3 transition-all scale-[1.02] hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <Link to="/organizer/events" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">event</span>
            <span>Events</span>
          </Link>
          <Link to="/organizer/create" className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">add_circle</span>
            <span>Organize</span>
          </Link>
          <a className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="px-4 mb-6">
          <Link to="/organizer/create" className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary py-3 rounded-full font-bold shadow-[0_0_20px_rgba(186,158,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Create Event
          </Link>
        </div>

        <div className="border-t border-outline-variant/10 pt-6">
          <a className="text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">help</span>
            <span>Help</span>
          </a>
          <button onClick={handleLogout} className="w-full text-left text-on-surface/60 mx-2 my-1 px-4 py-3 hover:bg-surface-container rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 min-h-screen bg-surface text-on-surface relative">
        <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute top-1/2 -left-20 w-[320px] h-[320px] bg-secondary/10 blur-[110px] rounded-full" />

        {/* Header Section */}
        <header className="sticky top-0 z-20 px-6 md:px-10 pt-12 pb-8 flex justify-between items-end bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Organizer Hub</h1>
            <p className="text-on-surface-variant font-body">
              {events.length > 0
                ? `Managing ${events.length} event${events.length > 1 ? 's' : ''}.`
                : 'Welcome! Create your first event to get started.'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-on-surface font-bold">{user?.name || 'Organizer'}</p>
              <p className="text-primary text-sm font-medium">{user?.email || 'Organizer'}</p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 bg-surface-container flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{user?.name?.[0]?.toUpperCase() || 'O'}</span>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-16 space-y-10 relative z-10">
          {/* Quick Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 glass-card rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <span className="text-tertiary text-xs font-label tracking-widest uppercase mb-4 block">Total Registrations</span>
                <h2 className="text-6xl font-headline font-black text-on-surface">{totalRegistrations}</h2>
                <p className="text-on-surface-variant mt-2">
                  {events.length > 0
                    ? `Across ${events.length} event${events.length > 1 ? 's' : ''} you've created`
                    : 'No events created yet'
                  }
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-secondary-container">event</span>
              </div>
              <h3 className="text-3xl font-headline font-bold text-on-surface">{events.length}</h3>
              <p className="text-on-surface-variant text-sm mt-1">Your Events</p>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-tertiary filled">groups</span>
              </div>
              <h3 className="text-3xl font-headline font-bold text-on-surface">
                {events.length > 0 ? Math.round(totalRegistrations / events.length) : 0}
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">Avg per Event</p>
            </div>
          </section>

          {/* Active Events & Management Split */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Your Active Events */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-headline font-extrabold tracking-tight">Your Events</h2>
                <Link to="/organizer/events" className="text-primary hover:underline text-sm font-bold">View All</Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 5).map((event, idx) => {
                    const status = getEventStatus(event);
                    const regCount = getRegistrationCount(event);

                    return (
                      <div key={event.id} className="group relative bg-surface-container-low hover:bg-surface-container rounded-xl transition-all duration-300 overflow-hidden flex items-center gap-6 p-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src={event.posterUrl ? `http://localhost:5000${event.posterUrl}` : placeholderImages[idx % 3]}
                            alt={event.title}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`${status.color} text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter`}>
                            {status.label}
                          </span>
                          <h4 className="text-lg font-headline font-bold mt-1 truncate">{event.title}</h4>
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                              <span className="material-symbols-outlined text-sm">group</span>
                              <span>{regCount} Registered</span>
                            </div>
                            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                              <span className="material-symbols-outlined text-sm">{status.icon}</span>
                              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              <span className="truncate max-w-[120px]">{event.location || 'TBD'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pr-2 flex gap-2">
                          <Link
                            to={`/organizer/edit/${event.id}`}
                            className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state for new organizers */
                <div className="text-center py-16 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20">
                  <span className="material-symbols-outlined text-6xl mb-4 block text-on-surface-variant/30">event_note</span>
                  <h3 className="text-xl font-headline font-bold mb-2">No events yet</h3>
                  <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
                    You haven't created any events. Start organizing your first campus event and engage students!
                  </p>
                  <Link
                    to="/organizer/create"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Create Your First Event
                  </Link>
                </div>
              )}
            </div>

            {/* Right: Management & Info */}
            <div className="space-y-8">
              {/* Account Info */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h3 className="font-headline font-bold text-lg">Your Profile</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Name</label>
                    <p className="text-sm font-medium mt-0.5">{user?.name || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Email</label>
                    <p className="text-sm font-medium mt-0.5">{user?.email || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">College</label>
                    <p className="text-sm font-medium mt-0.5">{user?.college || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Role</label>
                    <p className="text-sm font-medium mt-0.5 capitalize">{user?.role || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-tertiary">bolt</span>
                  <h3 className="font-headline font-bold text-lg">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/organizer/create"
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">add_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">Create Event</p>
                      <p className="text-[10px] text-on-surface-variant">Set up a new campus event</p>
                    </div>
                  </Link>
                  <Link
                    to="/organizer/events"
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-secondary/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">list_alt</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-secondary transition-colors">Manage Events</p>
                      <p className="text-[10px] text-on-surface-variant">Edit or delete your events</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Event Summary Chart (only if events exist) */}
              {events.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline font-bold text-sm">Registrations</h3>
                    <span className="text-[10px] font-bold bg-surface-bright px-2 py-0.5 rounded text-on-surface-variant">Per Event</span>
                  </div>
                  <div className="h-24 flex items-end gap-1 px-2">
                    {events.slice(0, 7).map((event, i) => {
                      const count = getRegistrationCount(event);
                      const maxCount = Math.max(...events.map(getRegistrationCount), 1);
                      const height = Math.max((count / maxCount) * 100, 8);
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm bg-primary/40 hover:bg-primary transition-colors cursor-pointer relative group"
                          style={{ height: `${height}%` }}
                          title={`${event.title}: ${count} registrations`}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface-container px-1.5 py-0.5 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-center mt-4 text-on-surface-variant">
                    Showing registration counts for your events
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* FAB */}
      <Link to="/organizer/create" className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center z-50 hover:scale-110 active:scale-90 transition-all duration-300">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 700" }}>add</span>
      </Link>
    </div>
  );
}
