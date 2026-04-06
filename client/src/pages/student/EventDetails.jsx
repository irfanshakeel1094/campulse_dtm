import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistered(true);
  };

  if (loading) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">event_busy</span>
          <h2 className="text-2xl font-bold font-headline mb-2">Event not found</h2>
          <Link to="/student/events" className="text-primary hover:underline">Browse all events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background selection:bg-primary/30 min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl bg-gradient-to-b from-surface-container-low to-transparent">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary font-headline">Campulse</Link>
            <nav className="hidden md:flex gap-6 items-center font-headline tracking-tight">
              <Link to="/student/events" className="text-primary border-b-2 border-primary pb-1 hover:text-primary transition-colors duration-300">Events</Link>
              <Link to="/student/dashboard" className="text-on-surface/70 hover:text-primary transition-colors duration-300">Dashboard</Link>
              <Link to="/student/calendar" className="text-on-surface/70 hover:text-primary transition-colors duration-300">Calendar</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-surface-container px-4 py-2 rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-outline mr-2 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface" placeholder="Search events..." type="text" />
            </div>
            <button className="active:scale-95 duration-200 text-on-surface/70 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`active:scale-95 duration-200 transition-colors ${bookmarked ? 'text-primary' : 'text-on-surface/70 hover:text-primary'}`}
            >
              <span className={`material-symbols-outlined ${bookmarked ? 'filled' : ''}`}>bookmarks</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
              <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA4c6xDZEoVK9pUaKw8B6l9IUHUwm0CWuiNUy0N6-PrSEwB9L0jKJnCOrykB6AycWzj9thsswsK4fhoIIMUTX_7h_W8Sov3IghBX77taGnT9XUZbiN-IJv_aE3I-u31lERXSMr-Zb7OpZIMPNKpdSg06ppppPtvyzWrqySW33I1kiWsQwjEML38ZJCOxOyUh-9m85k6r7g4pOUDs2_ST37G5JR_GfcF1T8bSlzxLUSXnuAK3Cl6BGl0sEY5LfG6MRQO_iQjkTHeZI" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Hero Banner */}
        <div className="relative w-full h-[512px] md:h-[614px] overflow-hidden">
          <img
            alt={event.title}
            className="w-full h-full object-cover"
            src={event.posterUrl ? `http://localhost:5000${event.posterUrl}` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1 rounded-full bg-primary-dim text-on-primary text-xs font-bold uppercase tracking-widest font-label">
                {event.category || 'Technology'}
              </span>
              <span className={`px-4 py-1 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest font-label ${
                event.college?.toUpperCase() === 'SRMIST RAMAPURAM'
                  ? 'bg-tertiary/30 text-tertiary border border-tertiary/30'
                  : 'bg-secondary/30 text-secondary border border-secondary/30'
              }`}>
                {event.college?.toUpperCase() === 'SRMIST RAMAPURAM' ? '📍 On Campus' : `🌐 ${event.college}`}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface mb-4 max-w-4xl leading-none">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                About the Event
              </h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
                <p>{event.description || 'Join us for an exciting event on campus. This is an immersive experience designed to bridge the gap between academic theory and industry reality.'}</p>
              </div>
            </section>

            {/* Agenda */}
            <section className="bg-surface-container-low rounded-xl p-8">
              <h2 className="text-2xl font-headline font-bold mb-8">Event Agenda</h2>
              <div className="space-y-6">
                <div className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <span className="text-primary font-headline font-bold">{event.time || '09:00'}</span>
                    <div className="w-px h-full bg-outline-variant/30 my-2"></div>
                  </div>
                  <div className="pb-6">
                    <h3 className="text-on-surface font-bold text-xl">Opening Keynote</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Welcome address and introduction to the agenda</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <span className="text-primary font-headline font-bold">11:30</span>
                    <div className="w-px h-full bg-outline-variant/30 my-2"></div>
                  </div>
                  <div className="pb-6">
                    <h3 className="text-on-surface font-bold text-xl">Workshop Session</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Hands-on coding session (Bring your laptops)</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <span className="text-primary font-headline font-bold">14:00</span>
                  </div>
                  <div className="pb-6">
                    <h3 className="text-on-surface font-bold text-xl">Networking & Closing</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Networking session and certificate distribution</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Organizer Info */}
            <section>
              <h2 className="text-2xl font-headline font-bold mb-6">Hosted by</h2>
              <div className="flex items-center gap-6 bg-surface-container p-6 rounded-xl border border-outline-variant/10">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-bright p-2">
                  <img alt="Organizer Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm8dgJcZrYXIbsTRLz8BjxJsevIXE8-HLAhJdCDZOiGidW1ObkKUq66e_Zd43S6brw6f9w6llqd6CdPd7yiqEe9KvZIl5hag3Rc2wS8_NIlPeU1OuE-3liOJnCavF_eDbkDDZan3e5ai6-fJITQ0k2ohtAviCuTSXyltXig2ks7Zx7WflWcbKqXFBl7W3z3IyO7AVtFtYEM4Tyx0qXBmx35YkgfMNcT7-hlzuL43PN1bGJEjTuNVBsYAq0VlCHYRYTY2PSpq89j8U" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">{event.organizer || event.college || 'Campulse Tech Society'}</h3>
                  <p className="text-on-surface-variant text-sm mb-3">Empowering students through innovation and community.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold border border-outline-variant text-on-surface hover:bg-surface-bright transition-all">Follow</button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold border border-outline-variant text-on-surface hover:bg-surface-bright transition-all">View Profile</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-surface-container rounded-xl p-8 border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">calendar_today</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-on-surface-variant text-sm">{event.time || '09:00 AM'} - 05:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold">{event.venue || event.location || 'Innovation Center'}</p>
                      <p className="text-on-surface-variant text-sm">{event.college || 'Main Campus'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold">{event.capacity || '450'} Registered</p>
                      <p className="text-on-surface-variant text-sm">Limited spots remaining</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/20">
                    {(event.registrationUrl || event.googleFormLink) ? (
                      <a
                        href={event.registrationUrl || event.googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary text-center font-bold rounded-full shadow-[0_0_20px_rgba(186,158,255,0.2)] hover:shadow-[0_0_30px_rgba(186,158,255,0.4)] active:scale-95 transition-all"
                      >
                        Register via Google Form
                      </a>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={registered}
                        className="block w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary text-center font-bold rounded-full shadow-[0_0_20px_rgba(186,158,255,0.2)] hover:shadow-[0_0_30px_rgba(186,158,255,0.4)] active:scale-95 transition-all disabled:opacity-50"
                      >
                        {registered ? '✓ Registered' : 'Register Now'}
                      </button>
                    )}
                    <p className="text-center text-xs text-on-surface-variant mt-4">
                      {event.registrationFee || 'Free'} • Registration closes soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Widget */}
              <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10">
                <div className="h-40 bg-surface-bright relative">
                  <img alt="Map Preview" className="w-full h-full object-cover opacity-50 grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZf4FMJzBXwovjo94EZ8DbRW7Fjl_izMEwg0LzqdKWWkLz3LpRneQfi5-VFUl0neudMOD1mcu6P9VIMXCNCl3tRUC8wQrtqa77YgbqklHnFsN6kSztPabtqA21HddNP9LIL_cQugVQkX_eM-OUSgtfZNs9qrqys3l44pUiaLdKHdotTYWpU3sFtsAEeQAFYCNIrMtnMZG18VA4BLPtKT4MgN9hl6o9e8ySXiAP51d4cDsSLSN54XMqyFkl-4onGiH95MSFc_t9RGk" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl filled">location_on</span>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm font-medium">Get Directions</span>
                  <span className="material-symbols-outlined text-on-surface-variant">open_in_new</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight">Similar Events</h2>
              <p className="text-on-surface-variant mt-2">More happenings you might be interested in.</p>
            </div>
            <Link to="/student/events" className="text-primary font-bold flex items-center gap-2 hover:underline">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Python for Bio-Informatics', desc: 'Deep dive into data processing for biological systems using modern Python libraries.', date: 'OCT 15', time: '2:00 PM', badge: 'FREE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDatTrWEmswofsdLBWx4vMw1pC-a0Z3n9CW2s2gOvDZ29v1eltxdsG1NsTltMDiWd8XRzxB4Vatzckkj1TOh-2Gddw_T34_XFoKLYkH9m_KIr1b7yEOvrdlr35LeZHVqFsIqwhZY51UYpBBnxidthxZufIKT2zNjRJU--EW7FZA99UvndgwHH3S_kB8_zMPV5QgAYJFL9U1Ctuj-hmjZTfmMsJrSw04uIR3-MS9VpEB9HgCCRe3XpbxKKBxB57MCPWeFREijzdExcY' },
              { title: 'Robotics Expo 2024', desc: 'See the latest student-built autonomous vehicles and robotic platforms in action.', date: 'OCT 18', time: 'Lab 4A', badge: 'INVITE ONLY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0rblKquVmogb0hmgE_O7tI9ddnpZkTufxnuNMPKJ3n8TG0FaEbywzMBRQEKMZeDL8n4XP41nYp-DkpqVQKhC6fIe1qUfwlj2Ozd1hbmT4DyIMc_szUSPjL2wpVDNI5iI6_WneeIVGilRdk-D2TL2wvZHPa7m8uT_qczFKcd8qdPIKvlBAoPVkzHEkTqztUVJGJ45uRXq4aLO3Pn04cOS5UdlJ76ugvVKc_itZDq-3EFvCJedYJBNr2nZvJGjGByYu2bdb9YWBDxU' },
              { title: "Founder's Pitch Night", desc: 'Watch campus entrepreneurs pitch their startups to local VC firms and angel investors.', date: 'OCT 22', time: '120 attending', badge: '$10.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdzjFRCtMVtkFSqbwAuUVDQxXq3NRIEYQjJFQmFSMjvUPwLzQruiHh0CaVNF3PSMUILC_kqth-TVKVZRKBhB5aAeuFVHmcxbGJMLnZLrC-uUjZg_t0W08rHW15yNCi_8Yge_n_wQQihZGzHj4tJNHqEJujbJjXun1FNs2VlGh9YMrQ0a9CTsHUkNlsYfTGkKA_JkGdkBv3uG77kuhSneEHCsY1SmRFZwZZv_hGcI2-i3-Di4ZiIcVGjdeuaOVjafV9EzSIT634N_Q' },
            ].map((card, i) => (
              <div key={i} className="group bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 hover:translate-y-[-8px] transition-all duration-300">
                <div className="relative h-48">
                  <img alt={card.title} className="w-full h-full object-cover" src={card.img} />
                  <div className="absolute top-4 right-4 bg-surface-container/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-primary">{card.date}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">{card.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {card.time}
                    </div>
                    <span className="text-xs font-bold text-tertiary">{card.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-2xl font-bold tracking-tighter text-primary font-headline">Campulse</span>
            <p className="text-on-surface-variant text-sm mt-2">Connecting campus energy to digital reality.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-on-surface-variant">
            <a className="hover:text-primary transition-colors">Support</a>
            <a className="hover:text-primary transition-colors">Privacy Policy</a>
            <a className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined p-2 rounded-full bg-surface-container hover:bg-surface-bright transition-colors cursor-pointer">share</span>
            <span className="material-symbols-outlined p-2 rounded-full bg-surface-container hover:bg-surface-bright transition-colors cursor-pointer">mail</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-outline-variant/5 text-center text-xs text-outline">
          © 2024 Campulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
