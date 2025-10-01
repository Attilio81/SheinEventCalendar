import React from 'react';
import { CalendarEvent } from '../types';
import { LocationMarkerIcon } from './Icons';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const colorMap: { [key: string]: string } = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  indigo: '#6366f1'
};

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onEventClick }) => {
  const formattedDate = currentDate.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-transparent h-full flex flex-col p-4">
      <h2 className="text-2xl font-bold text-white mb-6 capitalize">{formattedDate}</h2>
      <div className="overflow-y-auto flex-1">
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="p-4 rounded-lg text-white font-semibold cursor-pointer transition-colors bg-slate-800 hover:bg-slate-700 border-l-4 flex justify-between items-center"
                style={{ borderLeftColor: colorMap[event.color] || '#64748b' }}
              >
                <div className="flex-1 overflow-hidden">
                   <p className="truncate text-lg">{event.title}</p>
                   <div className="flex items-center mt-2 text-sm text-slate-400">
                      <LocationMarkerIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center py-8">
            <p className="text-slate-400 text-lg">Nessun evento per questo giorno.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
