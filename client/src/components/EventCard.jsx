import React from 'react';
import { ExternalLink, MapPin, Clock, Phone, Tag, Users, DollarSign, School } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function EventCard({ event, compact = false }) {
  const eventDate = parseISO(event.date);
  const isOver = isPast(eventDate);

  const categoryColors = {
    'Hackathon': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
    'Workshop': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Symposium': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    'Coding Contest': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'Summit': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    'Competition': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    'Seminar': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    'General': 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  };

  const catColor = categoryColors[event.category] || categoryColors['General'];

  return (
    <div className={`card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 ${isOver ? 'opacity-70' : ''}`}>
      {/* Poster / Header Gradient */}
      {event.poster ? (
        <div className="h-40 overflow-hidden">
          <img src={`http://localhost:5000${event.poster}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`h-40 relative overflow-hidden ${event.isSRM
            ? 'bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500'
            : 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500'
          }`}>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/30 text-6xl font-black select-none">
              {event.title.charAt(0)}
            </span>
          </div>
          {/* SRM Badge */}
          {event.isSRM && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-white/20 backdrop-blur-sm text-white border border-white/30 text-[10px]">
                🏛️ SRM Event
              </span>
            </div>
          )}
          {/* Status */}
          {event.status === 'ongoing' && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-green-500/90 text-white text-[10px]">
                <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-1 animate-pulse" />
                Live
              </span>
            </div>
          )}
          {isOver && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">Event Ended</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Category + Mode */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`badge text-[11px] ${catColor}`}>
            <Tag size={10} className="mr-1" />
            {event.category}
          </span>
          <span className={`badge text-[11px] ${event.mode === 'Online' ? 'badge-online' : event.mode === 'Offline' ? 'badge-offline' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
            {event.mode}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {event.title}
        </h3>

        {/* College */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <School size={12} />
          <span className="truncate">{event.college}</span>
        </div>

        {!compact && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {event.description}
          </p>
        )}

        {/* Info rows */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={12} className="flex-shrink-0 text-primary-500" />
            <span>{format(eventDate, 'EEE, MMM d yyyy')} {event.time && `• ${event.time}`}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={12} className="flex-shrink-0 text-primary-500" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <DollarSign size={12} className="flex-shrink-0 text-primary-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{event.registrationFee}</span>
            </div>
            {event.contactNumber && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Phone size={10} />
                <span>{event.contactNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Register Button */}
        <a
          href={event.googleFormLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => isOver && e.preventDefault()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
            ${isOver
              ? 'bg-slate-100 dark:bg-surface-container-high text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <ExternalLink size={14} />
          {isOver ? 'Registration Closed' : 'Register Now'}
        </a>
      </div>
    </div>
  );
}
