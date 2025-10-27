import React from 'react';
import { TechnoEvent } from '../lib/technoScraper';

interface TechnoEventDetailsProps {
  event: TechnoEvent;
  isOpen: boolean;
  onClose: () => void;
}

const TechnoEventDetails: React.FC<TechnoEventDetailsProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sourceLinks: { [key: string]: string } = {
    resident_advisor: 'Resident Advisor',
    xceed: 'Xceed',
    eventbrite: 'Eventbrite',
    eventdestination: 'Event Destination'
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-t-xl sm:rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white truncate">
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Image */}
          {event.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">📅 DATA E ORA</h3>
            <p className="text-lg text-white font-semibold">
              {formatDate(event.date_start)}
            </p>
            {event.date_end && event.date_end !== event.date_start && (
              <p className="text-slate-300 text-sm">
                → {formatDate(event.date_end)}
              </p>
            )}
            {event.time_start && (
              <p className="text-slate-300 text-sm mt-2">
                ⏰ {event.time_start}
                {event.time_end && ` - ${event.time_end}`}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">📍 LUOGO</h3>
            {event.venue && (
              <p className="text-white font-semibold text-lg mb-1">{event.venue}</p>
            )}
            <p className="text-slate-300">
              {event.location} • {event.city}, {event.country}
            </p>
            {event.latitude && event.longitude && (
              <p className="text-xs text-slate-400 mt-2">
                {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
              </p>
            )}
          </div>

          {/* Lineup */}
          {event.lineup && event.lineup.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">🎤 LINEUP</h3>
              <div className="space-y-2">
                {event.lineup.map((artist, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700 text-white px-3 py-2 rounded flex items-center"
                  >
                    <span className="text-red-500 font-bold mr-3">{idx + 1}.</span>
                    {artist}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Genres */}
          {event.genres && event.genres.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">🎵 GENERI</h3>
              <div className="flex flex-wrap gap-2">
                {event.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Capacity */}
          {event.capacity && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">👥 CAPACITÀ</h3>
              <p className="text-white text-lg font-semibold">
                {event.capacity.toLocaleString()} persone
              </p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">ℹ️ DESCRIZIONE</h3>
              <p className="text-slate-300 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Source Info */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">📌 FONTE</h3>
            <p className="text-slate-300 text-sm">
              Fonte: {sourceLinks[event.source] || event.source}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {event.ticket_url && (
              <a
                href={event.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-center transition-colors block"
              >
                🎫 Compra Biglietti
              </a>
            )}
            {event.official_site && (
              <a
                href={event.official_site}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg text-center transition-colors block"
              >
                🌐 Sito Ufficiale
              </a>
            )}
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-lg text-center transition-colors block text-sm"
              >
                Vedi su {sourceLinks[event.source] || 'Fonte'}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnoEventDetails;
