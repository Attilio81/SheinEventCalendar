import React, { useState, useCallback, useEffect } from 'react';
import { CalendarEvent } from './types';
import Header from './components/Header';
import Calendar from './components/Calendar';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import DayEventsModal from './components/DayEventsModal';
import UpcomingEvents from './components/UpcomingEvents';
import BottomNavBar from './components/BottomNavBar';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';

type View = 'month' | 'week' | 'day';

const App: React.FC = () => {
  const { session, user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<View>('month');

  const getEvents = useCallback(async () => {
    // Fetches all events. RLS policies on Supabase will determine what is returned.
    // With the recommended change, this will be all events for authenticated users.
    const { data, error } = await supabase
      .from('events')
      .select('*');
      
    if (error) {
      console.error('Error fetching events:', error);
      return;
    }
    if (data) {
      const mappedEvents: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        startDate: event.start_date,
        endDate: event.end_date,
        location: event.location,
        description: event.description,
        color: event.color,
        user_id: event.user_id
      }));
      setEvents(mappedEvents);
    }
  }, []);

  useEffect(() => {
    if (session && user) {
      getEvents();

      const subscription = supabase
        .channel('public-events')
        .on<any>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            console.log('📡 Realtime event received:', payload.eventType, payload);

            if (payload.eventType === 'INSERT') {
              const newRecord = payload.new;
              const newEvent: CalendarEvent = {
                id: newRecord.id,
                title: newRecord.title,
                startDate: newRecord.start_date,
                endDate: newRecord.end_date,
                location: newRecord.location,
                description: newRecord.description,
                color: newRecord.color,
                user_id: newRecord.user_id,
              };
              console.log('✅ Adding new event:', newEvent.title);
              setEvents(currentEvents =>
                currentEvents.some(e => e.id === newEvent.id)
                  ? currentEvents
                  : [...currentEvents, newEvent]
              );
            } else if (payload.eventType === 'UPDATE') {
              const updatedRecord = payload.new;
              const updatedEvent: CalendarEvent = {
                id: updatedRecord.id,
                title: updatedRecord.title,
                startDate: updatedRecord.start_date,
                endDate: updatedRecord.end_date,
                location: updatedRecord.location,
                description: updatedRecord.description,
                color: updatedRecord.color,
                user_id: updatedRecord.user_id,
              };
              console.log('✏️ Updating event:', updatedEvent.title);
              setEvents(currentEvents =>
                currentEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedRecordId = payload.old.id;
              console.log('🗑️ Deleting event:', deletedRecordId);
              setEvents(currentEvents =>
                currentEvents.filter(e => e.id !== deletedRecordId)
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Subscription status:', status);
        });

      return () => {
        console.log('🔌 Unsubscribing from realtime');
        supabase.removeChannel(subscription);
      };
    }
  }, [session, user, getEvents]);

  const handlePrev = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1, 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else { // day
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1, 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else { // day
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const openModalForNewEvent = (date: string) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setIsEventModalOpen(true);
  };

  const openModalForExistingEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsEventModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsEventModalOpen(false);
    setIsDayModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  }, []);

  const openDayModal = (date: string) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const getEventsForDay = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => {
      const startDate = new Date(e.startDate);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(e.endDate);
      endDate.setUTCHours(0, 0, 0, 0);
      const currentDate = new Date(dateStr);
      currentDate.setUTCHours(0, 0, 0, 0);
      return currentDate >= startDate && currentDate <= endDate;
    }).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);
  
  const handleSaveEvent = useCallback(async (eventToSave: Omit<CalendarEvent, 'id' | 'color' | 'user_id'> & { id?: string }) => {
    if (!user) {
        console.error("User not authenticated to save event.");
        throw new Error("User not authenticated to save event.");
    }
    try {
      if (eventToSave.id) {
        // Update existing event - RLS policy will enforce ownership
        const { error } = await supabase
          .from('events')
          .update({
            title: eventToSave.title,
            start_date: eventToSave.startDate,
            end_date: eventToSave.endDate,
            location: eventToSave.location,
            description: eventToSave.description,
          })
          .eq('id', eventToSave.id);

        if (error) throw error;
      } else {
        // Add new event
        const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'indigo'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const { error } = await supabase
          .from('events')
          .insert({
            title: eventToSave.title,
            start_date: eventToSave.startDate,
            end_date: eventToSave.endDate,
            location: eventToSave.location,
            description: eventToSave.description,
            color: randomColor,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Refresh events list after successful save
      await getEvents();
      closeModal();
    } catch(error) {
      console.error("Error saving event:", error);
      throw error; // Re-throw to be caught by the modal
    }
  }, [user, closeModal, getEvents]);

  const handleDeleteEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Utente non autenticato." };
    }

    const { data, error } = await supabase
      .from('events')
      .delete()
      .match({ id: eventId, user_id: user.id }) // Explicit ownership check
      .select();

    if (error || !data || data.length === 0) {
      console.error('❌ Delete failed:', error);
      const errorMessage = error?.message || "Eliminazione fallita. L'evento non è stato trovato o non hai i permessi necessari.";
      return { success: false, error: errorMessage };
    }

    // Refresh events list after successful delete
    await getEvents();
    return { success: true };
  };


  if (!session) {
    return <Auth />;
  }

  const renderView = () => {
    switch (view) {
      case 'month':
        return <Calendar 
          currentDate={currentDate} 
          events={events}
          onDateClick={openDayModal}
          onEventClick={openModalForExistingEvent}
        />;
      case 'week':
        return <WeekView
          currentDate={currentDate}
          events={events}
          onDateClick={openDayModal}
          onEventClick={openModalForExistingEvent}
        />;
      case 'day':
          return <DayView
            currentDate={currentDate}
            events={getEventsForDay(currentDate)}
            onEventClick={openModalForExistingEvent}
          />;
      default:
        return null;
    }
  };

  const ViewSwitcher: React.FC = () => (
    <div className="flex justify-center md:justify-end mb-4">
      <div className="flex items-center bg-slate-800 rounded-lg p-1 space-x-1">
        {(['month', 'week', 'day'] as const).map(viewName => (
          <button
            key={viewName}
            onClick={() => setView(viewName)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              view === viewName
                ? 'bg-red-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {viewName === 'month' ? 'Mese' : viewName === 'week' ? 'Settimana' : 'Giorno'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans text-slate-200 bg-[#141414]">
      <Header />
      <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
        <UpcomingEvents events={events} onEventClick={openModalForExistingEvent} />
        <ViewSwitcher />
        <div className="flex-1 flex flex-col min-h-[600px]">
          {renderView()}
        </div>
      </main>
      {isEventModalOpen && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onClose={closeModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
      {isDayModalOpen && selectedDate && (
        <DayEventsModal
          date={selectedDate}
          events={getEventsForDay(new Date(selectedDate))}
          onClose={closeModal}
          onAddEvent={(date) => {
            closeModal();
            openModalForNewEvent(date);
          }}
          onEventClick={(event) => {
            closeModal();
            openModalForExistingEvent(event);
          }}
        />
      )}
      <BottomNavBar
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddEvent={() => openModalForNewEvent(new Date().toISOString().split('T')[0])}
      />
    </div>
  );
};

export default App;