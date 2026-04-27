import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday, isPast, isFuture, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data)).catch(() => {});
  }, []);

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Get events for a specific day
  const getEventsForDay = (day) =>
    events.filter(e => isSameDay(parseISO(e.date), day));

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDayEvents(getEventsForDay(day));
  };

  const getDayType = (day) => {
    if (isToday(day)) return 'today';
    if (isPast(day)) return 'past';
    return 'future';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-x-hidden bg-grid">
      <Navbar />
      <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-[320px] h-[320px] bg-secondary/10 blur-[110px] rounded-full" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-on-surface mb-1">Event Calendar</h1>
          <p className="text-on-surface-variant text-sm">View past, present, and upcoming events</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { color: 'bg-outline-variant', label: 'Past Events' },
            { color: 'bg-primary', label: 'Today' },
            { color: 'bg-tertiary', label: 'Upcoming' },
            { color: 'bg-secondary', label: 'SRM Events' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-sm text-on-surface-variant">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-surface-container border border-outline-variant/10 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-on-surface">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-on-surface-variant py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const dayEvts = getEventsForDay(day);
                const isSelected = isSameDay(day, selectedDay);
                const inMonth = isSameMonth(day, currentMonth);
                const type = getDayType(day);
                const hasSRM = dayEvts.some(e => e.isSRM);
                const hasOther = dayEvts.some(e => !e.isSRM);

                return (
                  <button
                    key={i}
                    onClick={() => handleDayClick(day)}
                    className={`relative p-2 rounded-xl min-h-[52px] flex flex-col items-center gap-0.5 transition-all duration-150
                      ${!inMonth ? 'opacity-30' : ''}
                      ${isSelected ? 'bg-primary text-background shadow-lg shadow-primary/30' : ''}
                      ${!isSelected && isToday(day) ? 'bg-primary/10 text-primary ring-2 ring-primary/40' : ''}
                      ${!isSelected && !isToday(day) && inMonth ? 'hover:bg-surface-container' : ''}
                    `}
                  >
                    <span className={`text-sm font-semibold
                      ${isSelected ? 'text-background' : ''}
                      ${!isSelected && isToday(day) ? 'text-primary' : ''}
                      ${!isSelected && !isToday(day) && type === 'past' ? 'text-on-surface-variant' : ''}
                      ${!isSelected && !isToday(day) && type === 'future' ? 'text-on-surface' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>

                    {/* Event dots */}
                    {dayEvts.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {hasSRM && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-background' : 'bg-secondary'}`} />
                        )}
                        {hasOther && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-background/80' : 'bg-tertiary'}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Panel */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Calendar size={16} />
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">
                  {format(selectedDay, 'EEEE')}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {format(selectedDay, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {dayEvents.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No events on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map(evt => (
                  <div key={evt.id} className={`rounded-xl p-3 border-l-4 ${evt.isSRM ? 'border-secondary bg-secondary/10' : 'border-tertiary bg-tertiary/10'}`}>
                    <p className="font-semibold text-on-surface text-sm line-clamp-2">{evt.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{evt.college}</p>
                    {evt.time && <p className="text-xs text-on-surface-variant mt-0.5">🕐 {evt.time}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`badge text-[10px] ${evt.isSRM ? 'badge-tertiary' : 'badge-secondary'}`}>
                        {evt.isSRM ? 'SRM' : evt.college.split(' ')[0]}
                      </span>
                      <span className={`badge text-[10px] ${evt.mode === 'Online' ? 'badge-secondary' : 'badge-tertiary'}`}>
                        {evt.mode}
                      </span>
                    </div>
                    <a
                      href={evt.googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs text-primary hover:text-primary-dim font-medium block"
                    >
                      Register →
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Month summary */}
            <div className="mt-6 pt-4 border-t border-outline-variant/10">
              <p className="text-xs font-semibold text-on-surface-variant mb-2">
                {format(currentMonth, 'MMMM')} Summary
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-surface-container rounded-lg">
                  <p className="text-lg font-black text-secondary">
                    {events.filter(e => isSameMonth(parseISO(e.date), currentMonth) && e.isSRM).length}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">SRM Events</p>
                </div>
                <div className="text-center p-2 bg-surface-container rounded-lg">
                  <p className="text-lg font-black text-tertiary">
                    {events.filter(e => isSameMonth(parseISO(e.date), currentMonth) && !e.isSRM).length}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">Other Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
