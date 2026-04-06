import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, Users, ExternalLink, Search, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { format, parseISO, isPast } from 'date-fns';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/organizer/mine');
      setEvents(res.data);
      setFiltered(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(events); return; }
    const q = search.toLowerCase();
    setFiltered(events.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)));
  }, [search, events]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/events/${deleteId}`);
      setEvents(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    } catch {} finally {
      setDeleting(false);
    }
  };

  const upcoming = filtered.filter(e => !isPast(parseISO(e.date)));
  const past = filtered.filter(e => isPast(parseISO(e.date)));

  const renderTable = (list, title) => list.length === 0 ? null : (
    <div className="mb-8">
      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3">{title} ({list.length})</h3>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Mode</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Regs</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(event => {
                const over = isPast(parseISO(event.date));
                return (
                  <tr key={event.id} className="border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-surface-container/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                          ${over ? 'bg-slate-400' : event.isSRM ? 'bg-gradient-to-br from-primary-500 to-accent-500' : 'bg-gradient-to-br from-slate-600 to-slate-500'}`}>
                          {event.title.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-[200px]">{event.title}</p>
                          <p className="text-xs text-slate-400 truncate">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
                      {format(parseISO(event.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`badge text-xs ${event.mode === 'Online' ? 'badge-online' : 'badge-offline'}`}>{event.mode}</span>
                    </td>
                    <td className="px-3 py-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                        <Eye size={12} />{event.views || 0}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                        <Users size={12} />{event.registrations || 0}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={event.googleFormLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                          title="View Form"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => navigate(`/organizer/edit/${event.id}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(event.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background transition-colors">
      <Navbar />

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-surface-container rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">Delete Event?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">This action cannot be undone. The event will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Manage Events</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{events.length} total event{events.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/organizer/create" className="btn-primary inline-flex items-center gap-2 !py-2.5">
            <PlusCircle size={16} />
            Post New Event
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-16 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 card">
            <p className="text-slate-400 mb-4">You haven't posted any events yet.</p>
            <Link to="/organizer/create" className="btn-primary inline-flex items-center gap-2 !py-2.5">
              <PlusCircle size={16} />
              Post Your First Event
            </Link>
          </div>
        ) : (
          <>
            {renderTable(upcoming, '🟢 Upcoming Events')}
            {renderTable(past, '⬜ Past Events')}
            {filtered.length === 0 && (
              <p className="text-center text-slate-400 py-10">No events match your search.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
