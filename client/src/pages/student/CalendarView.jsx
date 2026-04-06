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
    <div className="min-h-screen bg-slate-50 dark:bg-background transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Event Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View past, present, and upcoming events</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { color: 'bg-slate-300 dark:bg-slate-600', label: 'Past Events' },
            { color: 'bg-primary-500', label: 'Today' },
            { color: 'bg-emerald-500', label: 'Upcoming' },
            { color: 'bg-accent-500', label: 'SRM Events' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 card p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-surface-container-high text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-surface-container-high text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-2">
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
                      ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : ''}
                      ${!isSelected && isToday(day) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 ring-2 ring-primary-500/50' : ''}
                      ${!isSelected && !isToday(day) && inMonth ? 'hover:bg-slate-50 dark:hover:bg-surface-container' : ''}
                    `}
                  >
                    <span className={`text-sm font-semibold
                      ${isSelected ? 'text-white' : ''}
                      ${!isSelected && isToday(day) ? 'text-primary-600 dark:text-primary-400' : ''}
                      ${!isSelected && !isToday(day) && type === 'past' ? 'text-slate-400 dark:text-slate-500' : ''}
                      ${!isSelected && !isToday(day) && type === 'future' ? 'text-slate-700 dark:text-slate-300' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>

                    {/* Event dots */}
                    {dayEvts.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {hasSRM && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-accent-500'}`} />
                        )}
                        {hasOther && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-emerald-500'}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Panel */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {format(selectedDay, 'EEEE')}
                </p>
                <p className="text-xs text-slate-400">
                  {format(selectedDay, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {dayEvents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No events on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map(evt => (
                  <div key={evt.id} className={`rounded-xl p-3 border-l-4 ${evt.isSRM ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/10' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'}`}>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2">{evt.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{evt.college}</p>
                    {evt.time && <p className="text-xs text-slate-400 mt-0.5">🕐 {evt.time}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`badge text-[10px] ${evt.isSRM ? 'badge-srm' : 'badge-other'}`}>
                        {evt.isSRM ? 'SRM' : evt.college.split(' ')[0]}
                      </span>
                      <span className={`badge text-[10px] ${evt.mode === 'Online' ? 'badge-online' : 'badge-offline'}`}>
                        {evt.mode}
                      </span>
                    </div>
                    <a
                      href={evt.googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs text-primary-500 hover:text-primary-600 font-medium block"
                    >
                      Register →
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Month summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                {format(currentMonth, 'MMMM')} Summary
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-slate-50 dark:bg-surface-container rounded-lg">
                  <p className="text-lg font-black text-primary-500">
                    {events.filter(e => isSameMonth(parseISO(e.date), currentMonth) && e.isSRM).length}
                  </p>
                  <p className="text-[10px] text-slate-400">SRM Events</p>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-surface-container rounded-lg">
                  <p className="text-lg font-black text-emerald-500">
                    {events.filter(e => isSameMonth(parseISO(e.date), currentMonth) && !e.isSRM).length}
                  </p>
                  <p className="text-[10px] text-slate-400">Other Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
