import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const interests = user?.interests || [];

  const categoryIcons = {
    'Hackathon': 'code',
    'AI/ML': 'psychology',
    'Web Dev': 'language',
    'Cybersecurity': 'shield',
    'Cloud Computing': 'cloud',
    'Workshop': 'build',
    'Symposium': 'forum',
    'Coding Contest': 'emoji_events',
    'Summit': 'landscape',
    'Seminar': 'school',
    'Competition': 'military_tech',
    'Data Science': 'analytics',
  };

  return (
    <div className="bg-background text-on-surface min-h-screen relative overflow-x-hidden bg-grid">
      <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-[320px] h-[320px] bg-secondary/10 blur-[110px] rounded-full" />
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary font-headline">Campulse</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/student/dashboard" className="text-on-surface/70 hover:text-primary transition-colors font-headline text-sm">Dashboard</Link>
            <Link to="/student/events" className="text-on-surface/70 hover:text-primary transition-colors font-headline text-sm">Events</Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto relative z-10">
        {/* Profile Hero */}
        <section className="relative mb-10">
          <div className="h-40 rounded-2xl bg-gradient-to-r from-primary/30 via-tertiary/20 to-secondary/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(186,158,255,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(120,200,255,0.2),transparent_50%)]" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 px-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-primary/20 border-4 border-background">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-headline font-extrabold tracking-tight">{user?.name || 'Student'}</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-tertiary/20 text-tertiary text-xs font-bold uppercase tracking-wider">
                  {user?.role || 'Student'}
                </span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {user?.college || 'SRMIST RAMAPURAM'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full border border-error/30 text-error text-sm font-bold hover:bg-error/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Events Joined', value: '—', icon: 'event_available', color: 'primary' },
            { label: 'Interests', value: interests.length, icon: 'favorite', color: 'tertiary' },
            { label: 'College', value: user?.college?.split(' ')[0] || 'SRM', icon: 'school', color: 'secondary' },
            { label: 'Member Since', value: 'Apr 2026', icon: 'calendar_month', color: 'primary' },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl bg-surface-container border border-outline-variant/10`}>
              <span className={`material-symbols-outlined text-${stat.color} mb-2 block`}>{stat.icon}</span>
              <p className="text-2xl font-black font-headline">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Personal Info */}
          <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Personal Info
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Full Name</label>
                <p className="text-on-surface font-medium mt-0.5">{user?.name || '—'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Email</label>
                <p className="text-on-surface font-medium mt-0.5">{user?.email || '—'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">College</label>
                <p className="text-on-surface font-medium mt-0.5">{user?.college || '—'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Role</label>
                <p className="text-on-surface font-medium mt-0.5 capitalize">{user?.role || '—'}</p>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">favorite</span>
                Interests
              </h3>
            </div>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold flex items-center gap-2 border border-primary/20"
                  >
                    <span className="material-symbols-outlined text-sm">{categoryIcons[interest] || 'star'}</span>
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">interests</span>
                <p className="text-sm">No interests set yet</p>
                <p className="text-xs mt-1">Update your interests to get personalized event recommendations</p>
              </div>
            )}
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h3 className="text-lg font-headline font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student/events"
              className="p-5 rounded-2xl bg-surface-container border border-outline-variant/10 hover:border-primary/30 transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">explore</span>
              </div>
              <div>
                <p className="font-bold group-hover:text-primary transition-colors">Browse Events</p>
                <p className="text-xs text-on-surface-variant">Discover campus happenings</p>
              </div>
            </Link>
            <Link
              to="/student/calendar"
              className="p-5 rounded-2xl bg-surface-container border border-outline-variant/10 hover:border-secondary/30 transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary">calendar_month</span>
              </div>
              <div>
                <p className="font-bold group-hover:text-secondary transition-colors">Calendar</p>
                <p className="text-xs text-on-surface-variant">View your schedule</p>
              </div>
            </Link>
            <Link
              to="/student/dashboard"
              className="p-5 rounded-2xl bg-surface-container border border-outline-variant/10 hover:border-tertiary/30 transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary">dashboard</span>
              </div>
              <div>
                <p className="font-bold group-hover:text-tertiary transition-colors">Dashboard</p>
                <p className="text-xs text-on-surface-variant">Your personalized home</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 rounded-2xl border border-error/20 bg-error/5">
          <h3 className="text-lg font-headline font-bold text-error flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined">warning</span>
            Account
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">Manage your account settings</p>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 z-50 flex justify-around items-center py-3 px-4">
        <Link to="/student/dashboard" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/student/events" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">event</span>
          <span className="text-[10px]">Events</span>
        </Link>
        <Link to="/student/calendar" className="flex flex-col items-center gap-1 text-on-surface/60">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px]">Calendar</span>
        </Link>
        <Link to="/student/profile" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined filled">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
