import React from 'react';
import { CalendarEvent } from '../types';
import { CloseIcon, PlusIcon, LocationMarkerIcon } from './Icons';

interface DayEventsModalProps {
  date: string;
  events: CalendarEvent[];
  onClose: () => void;
  onAddEvent: (date: string) => void;
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

const DayEventsModal: React.FC<DayEventsModalProps> = ({ date, events, onClose, onAddEvent, onEventClick }) => {
  
  const formattedDate = new Date(date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Important to avoid timezone shifts from string
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl shadow-red-900/20 w-full max-w-lg transform transition-all">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white capitalize">{formattedDate}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="p-3 rounded-lg text-white font-semibold cursor-pointer transition-colors bg-slate-800 hover:bg-slate-700 border-l-4 flex justify-between items-center"
                  style={{ borderLeftColor: colorMap[event.color] || '#64748b' }}
                >
                  <div className="flex-1 overflow-hidden">
                     <p className="truncate">{event.title}</p>
                     <div className="flex items-center mt-1 text-xs text-slate-400">
                        <LocationMarkerIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Nessun evento per questo giorno.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-black/50 rounded-b-lg text-right">
          <button 
            type="button" 
            onClick={() => onAddEvent(date)} 
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-lg shadow-red-600/20 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Aggiungi Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayEventsModal;
