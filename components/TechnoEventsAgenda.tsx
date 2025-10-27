import React, { useState, useEffect } from 'react';
import { getTechnoEvents, TechnoEvent as TechnoEventType } from '../lib/technoScraper';
import TechnoEventDetails from './TechnoEventDetails';
import { LocationMarkerIcon } from './Icons';

interface TechnoEventsAgendaProps {
  onEventClick?: (event: TechnoEventType) => void;
}

const TechnoEventsAgenda: React.FC<TechnoEventsAgendaProps> = ({ onEventClick }) => {
  const [events, setEvents] = useState<TechnoEventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TechnoEventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TechnoEventType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const cities = ['all', 'Turin', 'Bologna', 'Amsterdam', 'Berlin', 'Europe'];

  // Load events from Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  // Filter events when city changes
  useEffect(() => {
    if (selectedCity === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(e => e.city.toLowerCase() === selectedCity.toLowerCase())
      );
    }
  }, [events, selectedCity]);

  const loadEvents = async () => {
    try {
      setError(null);
      const data = await getTechnoEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Errore nel caricamento degli eventi');
    }
  };

  const handleEventClick = (event: TechnoEventType) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
    onEventClick?.(event);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-transparent flex flex-col h-full">
      {/* Header con Filtri */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">🎵 Techno Events</h2>
          <p className="text-slate-400 text-sm">Festival e serate techno in giro</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* City Filters */}
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                selectedCity === city
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {city === 'all' ? 'Tutti' : city}
            </button>
          ))}
        </div>

        <p className="text-slate-400 text-xs mt-3">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 'i' : ''}
        </p>
      </div>

      {/* Events List */}
      <div className="overflow-y-auto flex-1 space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={`${event.source}:${event.source_url}`}
              onClick={() => handleEventClick(event)}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 cursor-pointer transition-colors border-l-4 border-red-600"
            >
              {/* Date Badge */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                  {formatDate(event.date_start)}
                </div>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  {event.source.toUpperCase()}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {event.title}
              </h3>

              {/* Venue & Location */}
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <LocationMarkerIcon className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {event.venue || event.location} • {event.city}
                </span>
              </div>

              {/* Lineup Preview */}
              {event.lineup && event.lineup.length > 0 && (
                <div className="text-slate-300 text-sm mb-3">
                  <p className="font-semibold text-slate-200 mb-1">🎤 Lineup:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.lineup.slice(0, 3).map((artist, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs"
                      >
                        {artist}
                      </span>
                    ))}
                    {event.lineup.length > 3 && (
                      <span className="text-slate-400 text-xs">
                        +{event.lineup.length - 3} altro{event.lineup.length - 4 > 0 ? 'i' : ''}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Genres */}
              {event.genres && event.genres.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {event.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center py-12">
            <div>
              <p className="text-slate-400 text-lg mb-2">Nessun evento trovato</p>
              <p className="text-slate-500 text-sm">
                Clicca "Refresh Events" per caricare gli ultimi eventi techno
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedEvent && (
        <TechnoEventDetails
          event={selectedEvent}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TechnoEventsAgenda;
