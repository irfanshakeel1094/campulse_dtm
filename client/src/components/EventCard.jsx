import React from 'react';
import { ExternalLink, MapPin, Clock, Phone, Tag, Users, DollarSign, School } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function EventCard({ event, compact = false }) {
  const eventDate = parseISO(event.date);
  const isOver = isPast(eventDate);

  const categoryColors = {
    'Hackathon': 'badge-primary',
    'Workshop': 'badge-secondary',
    'Symposium': 'badge-tertiary',
    'Coding Contest': 'badge-secondary',
    'Summit': 'badge-tertiary',
    'Competition': 'badge-primary',
    'Seminar': 'badge-tertiary',
    'General': 'bg-surface-container-high text-on-surface-variant',
  };

  const catColor = categoryColors[event.category] || categoryColors['General'];

  return (
    <div className={`bg-surface-container border border-outline-variant/10 rounded-2xl group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 ${isOver ? 'opacity-70' : ''}`}>
      {/* Poster / Header Gradient */}
      {event.poster ? (
        <div className="h-40 overflow-hidden">
          <img src={`http://localhost:5000${event.poster}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`h-40 relative overflow-hidden ${event.isSRM
            ? 'bg-gradient-to-br from-primary via-primary-dim to-tertiary'
            : 'bg-gradient-to-br from-surface-container-high to-surface-container'
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
              <span className="badge bg-tertiary text-background text-[10px]">
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
          <span className={`badge text-[11px] ${event.mode === 'Online' ? 'badge-secondary' : event.mode === 'Offline' ? 'badge-tertiary' : 'badge-primary'}`}>
            {event.mode}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-on-surface text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {/* College */}
        <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-3">
          <School size={12} />
          <span className="truncate">{event.college}</span>
        </div>

        {!compact && (
          <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">
            {event.description}
          </p>
        )}

        {/* Info rows */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Clock size={12} className="flex-shrink-0 text-primary" />
            <span>{format(eventDate, 'EEE, MMM d yyyy')} {event.time && `• ${event.time}`}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <MapPin size={12} className="flex-shrink-0 text-primary" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <DollarSign size={12} className="flex-shrink-0 text-primary" />
              <span className="font-medium text-on-surface">{event.registrationFee}</span>
            </div>
            {event.contactNumber && (
              <div className="flex items-center gap-1 text-xs text-on-surface-variant">
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
              ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-primary-dim text-on-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <ExternalLink size={14} />
          {isOver ? 'Registration Closed' : 'Register Now'}
        </a>
      </div>
    </div>
  );
}
