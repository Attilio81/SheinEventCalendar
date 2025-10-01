import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../types';
import { CloseIcon, TrashIcon, LocationMarkerIcon } from './Icons';
import { geoapifyApiKey } from '../lib/geoapifyClient';

interface EventModalProps {
  event: CalendarEvent | null;
  selectedDate: string | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'color'> & { id?: string }) => Promise<void>;
  onDelete: (eventId: string) => Promise<{ success: boolean; error?: string }>;
}

const EventModal: React.FC<EventModalProps> = ({ event, selectedDate, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setLocation(event.location);
      setDescription(event.description || '');
    } else if (selectedDate) {
      setTitle('');
      setStartDate(selectedDate);
      setEndDate(selectedDate);
      setLocation('');
      setDescription('');
    }
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  }, [event, selectedDate]);

  useEffect(() => {
    if (location.trim() === '') {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
              location
            )}&apiKey=${geoapifyApiKey}&limit=5`
          );
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setSuggestions(data.features || []);
          setIsSuggestionsOpen(true);
        } catch (error) {
          console.error('Error fetching Geoapify suggestions:', error);
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [location]);

  // Handle clicks outside the suggestions box
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeleting || isSaving) return;
    if (new Date(startDate) > new Date(endDate)) {
        alert("La data di inizio non può essere successiva alla data di fine.");
        return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave({
        id: event?.id,
        title,
        startDate,
        endDate,
        location,
        description
      });
    } catch (error: any) {
      setSaveError(error.message || 'Si è verificato un errore durante il salvataggio.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (event && window.confirm('Sei sicuro di voler eliminare questo evento?')) {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const result = await onDelete(event.id);
            if (result.success) {
                onClose(); // The modal is responsible for closing itself on success
            } else {
                setDeleteError(result.error || 'Si è verificato un errore sconosciuto.');
            }
        } catch (error: any) {
            // This catches unexpected errors like network failures
            setDeleteError(error.message || 'Errore di connessione o imprevisto.');
        } finally {
            setIsDeleting(false);
        }
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setLocation(suggestion.properties.formatted);
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl shadow-red-900/20 w-full max-w-lg transform transition-all">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{event ? 'Modifica Evento' : 'Nuovo Evento'}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Titolo</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-400 mb-1">Inizio</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-400 mb-1">Fine</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
              </div>
            </div>
             <div ref={wrapperRef}>
              <label htmlFor="location" className="block text-sm font-medium text-slate-400 mb-1">Luogo / Indirizzo</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LocationMarkerIcon className="h-5 w-5 text-slate-500" />
                 </div>
                <input 
                  type="text" 
                  id="location"
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  autoComplete="off"
                  required 
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                 {isSuggestionsOpen && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.properties.place_id}
                          className="px-4 py-2 text-white cursor-pointer hover:bg-slate-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.properties.formatted}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Descrizione</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
            </div>
          </div>
          
          {saveError && (
            <div className="px-6 pb-4 text-red-500 text-sm font-semibold">
              <p>{saveError}</p>
            </div>
          )}

          {deleteError && (
            <div className="px-6 pb-4 text-red-500 text-sm font-semibold">
              <p>{deleteError}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-black/50 rounded-b-lg">
            <div>
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 text-slate-400 hover:bg-red-900/50 hover:text-red-500 rounded-full disabled:opacity-50 disabled:cursor-wait"
                  aria-label="Delete event"
                  disabled={isDeleting || isSaving}
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <TrashIcon className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
            <div className="flex space-x-3">
               <button type="button" onClick={onClose} disabled={isDeleting || isSaving} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-transparent border border-slate-600 rounded-md hover:bg-slate-800 hover:text-white disabled:opacity-50">
                Annulla
              </button>
              <button type="submit" disabled={isDeleting || isSaving} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-lg shadow-red-600/20 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait">
                {isSaving ? (
                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Salva'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;