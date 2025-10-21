import React, { useMemo } from 'react';
import { CalendarEvent } from '../types';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const colorMap: { [key: string]: string } = {
  blue: 'from-blue-600 to-blue-700',
  red: 'from-red-600 to-red-700',
  green: 'from-green-600 to-green-700',
  yellow: 'from-yellow-600 to-yellow-700',
  purple: 'from-purple-600 to-purple-700',
  indigo: 'from-indigo-600 to-indigo-700'
};

const colorDotMap: { [key: string]: string } = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500'
};

interface GroupedEvents {
  [key: string]: CalendarEvent[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ currentDate, events, onEventClick }) => {
  // Group events by start date and sort them
  const groupedEvents = useMemo(() => {
    const groups: GroupedEvents = {};

    // Filter events that start on or after current date
    const currentDateStr = formatDateToYYYYMMDD(currentDate);
    const futureEvents = events.filter(e => e.startDate >= currentDateStr);

    // Sort by start date
    const sortedEvents = [...futureEvents].sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );

    // Group by start date
    sortedEvents.forEach(event => {
      if (!groups[event.startDate]) {
        groups[event.startDate] = [];
      }
      groups[event.startDate].push(event);
    });

    return groups;
  }, [events, currentDate]);

  const groupedDates = useMemo(() => {
    return Object.keys(groupedEvents).sort();
  }, [groupedEvents]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === formatDateToYYYYMMDD(today)) {
      return 'Oggi';
    }
    if (dateString === formatDateToYYYYMMDD(tomorrow)) {
      return 'Domani';
    }

    const dayOfWeek = date.toLocaleDateString('it-IT', { weekday: 'long' });
    const dayMonth = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });

    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} ${dayMonth}`;
  };

  const getDaysDifference = (dateString: string): number => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysBadgeColor = (daysAway: number): string => {
    if (daysAway === 0) return 'bg-red-600 text-white';
    if (daysAway === 1) return 'bg-orange-600 text-white';
    if (daysAway <= 7) return 'bg-yellow-600 text-white';
    return 'bg-slate-700 text-slate-200';
  };

  return (
    <div className="flex flex-col gap-4">
      {groupedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Calendar className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-slate-400">Nessun evento futuro</p>
        </div>
      ) : (
        groupedDates.map(dateString => {
          const daysAway = getDaysDifference(dateString);
          const eventsForDate = groupedEvents[dateString];

          return (
            <div key={dateString} className="space-y-2">
              {/* Date Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold ${getDaysBadgeColor(daysAway)}`}>
                  <div className="text-xs opacity-80">
                    {daysAway === 0 ? 'ORA' : daysAway === 1 ? 'DOM' : `+${daysAway}`}
                  </div>
                  <div className="text-lg">{dateString.split('-')[2]}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {formatDate(dateString)}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {eventsForDate.length} {eventsForDate.length === 1 ? 'evento' : 'eventi'}
                  </p>
                </div>
              </div>

              {/* Events for this date */}
              <div className="space-y-2 ml-4">
                {eventsForDate.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="group cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 border border-slate-700 hover:border-slate-600 rounded-lg p-4 transition-all duration-200 flex items-center gap-3"
                  >
                    {/* Color indicator */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colorDotMap[event.color]}`} />

                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm md:text-base group-hover:text-red-400 transition-colors truncate">
                        {event.title}
                      </h4>

                      <div className="flex flex-col gap-1 mt-1">
                        {/* Date range if multi-day */}
                        {event.startDate !== event.endDate && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {event.startDate} → {event.endDate}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}

                        {/* Description */}
                        {event.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chevron indicator */}
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-red-400 flex-shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AgendaView;
