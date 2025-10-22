import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent, EventParticipant } from '../types';
import { CloseIcon, TrashIcon, LocationMarkerIcon } from './Icons';
import { geoapifyApiKey } from '../lib/geoapifyClient';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface EventModalProps {
  event: CalendarEvent | null;
  selectedDate: string | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'user_id'> & { id?: string }) => Promise<void>;
  onDelete: (eventId: string) => Promise<{ success: boolean; error?: string }>;
}

const EventModal: React.FC<EventModalProps> = ({ event, selectedDate, onClose, onSave, onDelete }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [ticketUrl, setTicketUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [myParticipation, setMyParticipation] = useState<EventParticipant | null>(null);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);


  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setLocation(event.location);
      setDescription(event.description || '');
      setColor(event.color || 'blue');
      setTicketUrl(event.ticketUrl || '');
      loadParticipants(event.id);

      // Set up real-time subscription for participants
      const subscription = supabase
        .channel(`event-participants-${event.id}`)
        .on<any>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'event_participants', filter: `event_id=eq.${event.id}` },
          (payload) => {
            loadParticipants(event.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } else if (selectedDate) {
      setTitle('');
      setStartDate(selectedDate);
      setEndDate(selectedDate);
      setLocation('');
      setDescription('');
      setTicketUrl('');
      setParticipants([]);
      setMyParticipation(null);
    }
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    setIsUserTyping(false); // Reset typing state when modal opens
  }, [event, selectedDate]);

  const loadParticipants = async (eventId: string) => {
    setIsLoadingParticipants(true);
    try {
      // First, get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;

      if (participantsData && participantsData.length > 0) {
        // Then, get profiles for all participants
        const userIds = participantsData.map(p => p.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Map profiles to participants
        const mappedParticipants: EventParticipant[] = participantsData.map((p: any) => ({
          id: p.id,
          event_id: p.event_id,
          user_id: p.user_id,
          status: p.status,
          created_at: p.created_at,
          updated_at: p.updated_at,
          profile: profilesData?.find(profile => profile.id === p.user_id),
        }));
        setParticipants(mappedParticipants);

        // Find current user's participation
        const myPart = mappedParticipants.find(p => p.user_id === user?.id);
        setMyParticipation(myPart || null);
      } else {
        setParticipants([]);
        setMyParticipation(null);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleParticipationChange = async (status: 'yes' | 'no' | 'maybe') => {
    if (!event || !user) return;

    try {
      if (myParticipation) {
        // Update existing participation
        const { error } = await supabase
          .from('event_participants')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', myParticipation.id);

        if (error) throw error;
      } else {
        // Insert new participation
        const { error } = await supabase
          .from('event_participants')
          .insert({
            event_id: event.id,
            user_id: user.id,
            status,
          });

        if (error) throw error;
      }

      // Reload participants
      await loadParticipants(event.id);
    } catch (error) {
      console.error('Error updating participation:', error);
    }
  };

  useEffect(() => {
    // Only fetch suggestions if user is actively typing
    if (!isUserTyping) {
      return;
    }

    // Don't fetch if location is empty or too short
    if (location.trim() === '' || location.trim().length < 3) {
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
          setIsSuggestionsOpen(false);
        }
      };

      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [location, isUserTyping]);

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
        description,
        color,
        ticketUrl
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
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl shadow-red-900/20 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{event ? 'Modifica Evento' : 'Nuovo Evento'}</h2>
            {event && ticketUrl && (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Acquista biglietti"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2m10 2v2m3.356 2.746l1.414-1.414M2.646 2.646l1.414 1.414M2 12a10 10 0 1020 0 10 10 0 00-20 0zm7-4h6v6h-6V8z"/>
                </svg>
                Biglietti
              </a>
            )}
          </div>
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
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 [-webkit-appearance:none]"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-400 mb-1">Fine</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 [-webkit-appearance:none]"
                />
              </div>
            </div>
             <div ref={wrapperRef}>
              <label htmlFor="location" className="block text-sm font-medium text-slate-400 mb-1">Luogo / Indirizzo</label>
               <div className="relative flex gap-2">
                 <div className="relative flex-1">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LocationMarkerIcon className="h-5 w-5 text-slate-500" />
                   </div>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={e => {
                      setLocation(e.target.value);
                      setIsUserTyping(true);
                    }}
                    onFocus={() => setIsUserTyping(true)}
                    autoComplete="off"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                 </div>
                 {event && location && (
                   <a
                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
                     title="Apri in Google Maps"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                     </svg>
                   </a>
                 )}
               {isSuggestionsOpen && suggestions.length > 0 && (
                  <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
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

            <div>
              <label htmlFor="ticketUrl" className="block text-sm font-medium text-slate-400 mb-1">Link Acquisto Biglietti</label>
              <input
                type="url"
                id="ticketUrl"
                value={ticketUrl}
                onChange={e => setTicketUrl(e.target.value)}
                placeholder="https://example.com/tickets"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Colore Evento</label>
              <div className="flex gap-2 flex-wrap">
                {['blue', 'red', 'green', 'yellow', 'purple', 'indigo'].map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`w-10 h-10 rounded-lg transition-all border-2 ${
                      color === colorOption
                        ? 'border-white shadow-lg scale-110'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    style={{
                      backgroundColor: {
                        blue: '#3b82f6',
                        red: '#ef4444',
                        green: '#22c55e',
                        yellow: '#eab308',
                        purple: '#a855f7',
                        indigo: '#6366f1'
                      }[colorOption]
                    }}
                    title={colorOption.charAt(0).toUpperCase() + colorOption.slice(1)}
                  />
                ))}
              </div>
            </div>

            {event && (
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Partecipanti</h3>

                {/* My participation buttons */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">La tua partecipazione:</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleParticipationChange('yes')}
                      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        myParticipation?.status === 'yes'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      ✓ Partecipo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleParticipationChange('maybe')}
                      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        myParticipation?.status === 'maybe'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      ? Forse
                    </button>
                    <button
                      type="button"
                      onClick={() => handleParticipationChange('no')}
                      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        myParticipation?.status === 'no'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      ✗ Non partecipo
                    </button>
                  </div>
                </div>

                {/* Participants list */}
                {isLoadingParticipants ? (
                  <p className="text-sm text-slate-500">Caricamento partecipanti...</p>
                ) : participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-md"
                      >
                        <span className="text-sm text-white">
                          {participant.profile?.nickname || 'Utente senza nickname'}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            participant.status === 'yes'
                              ? 'bg-green-900/50 text-green-300'
                              : participant.status === 'maybe'
                              ? 'bg-yellow-900/50 text-yellow-300'
                              : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {participant.status === 'yes' ? 'Partecipa' : participant.status === 'maybe' ? 'Forse' : 'Non partecipa'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Nessun partecipante ancora</p>
                )}
              </div>
            )}
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