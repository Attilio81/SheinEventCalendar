import React, { useState, useCallback, useEffect } from 'react';
import { CalendarEvent, UserProfile, Notification } from './types';
import Header from './components/Header';
import Calendar from './components/Calendar';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import DayEventsModal from './components/DayEventsModal';
import UpcomingEvents from './components/UpcomingEvents';
import BottomNavBar from './components/BottomNavBar';
import ProfileModal from './components/ProfileModal';
import NotificationsModal from './components/NotificationsModal';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import { formatDateToYYYYMMDD } from './utils/dateUtils';
import { requestNotificationPermission, sendPushNotification } from './utils/pushNotifications';

type View = 'month' | 'week' | 'day';

const App: React.FC = () => {
  const { session, user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<View>('month');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showMyEventsOnly, setShowMyEventsOnly] = useState(false);
  const [myParticipatingEventIds, setMyParticipatingEventIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

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

  const getUserProfile = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setUserProfile(data);
    }
  }, [user]);

  const getMyParticipations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', user.id)
      .eq('status', 'yes');

    if (error) {
      console.error('Error fetching participations:', error);
      return;
    }

    if (data) {
      setMyParticipatingEventIds(new Set(data.map(p => p.event_id)));
    }
  }, [user]);

  const getNotifications = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*, events!inner(start_date)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    if (data) {
      // Filter out notifications for events that have already started
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = formatDateToYYYYMMDD(today);

      const activeNotifications = data.filter((notif: any) => {
        // Keep notification if event hasn't started yet
        return notif.events?.start_date >= todayStr;
      });

      setNotifications(activeNotifications);
    }
  }, [user]);

  useEffect(() => {
    if (session && user) {
      getEvents();
      getUserProfile();
      getMyParticipations();
      getNotifications();

      // Request notification permission on first load
      requestNotificationPermission();

      const eventsSubscription = supabase
        .channel('public-events')
        .on<any>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
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
              setEvents(currentEvents =>
                currentEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedRecordId = payload.old.id;
              setEvents(currentEvents =>
                currentEvents.filter(e => e.id !== deletedRecordId)
              );
            }
          }
        )
        .subscribe();

      // Subscribe to event_participants changes
      const participantsSubscription = supabase
        .channel('my-participations')
        .on<any>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'event_participants', filter: `user_id=eq.${user.id}` },
          () => {
            getMyParticipations();
          }
        )
        .subscribe();

      // Subscribe to notifications changes
      const notificationsSubscription = supabase
        .channel('public-notifications')
        .on<any>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              // Fetch the related event to check if it's still in the future
              const { data: eventData } = await supabase
                .from('events')
                .select('start_date, title')
                .eq('id', payload.new.event_id)
                .single();

              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayStr = formatDateToYYYYMMDD(today);

              if (eventData && eventData.start_date >= todayStr) {
                const newNotification: Notification = payload.new;
                setNotifications(current =>
                  current.some(n => n.id === newNotification.id)
                    ? current
                    : [newNotification, ...current]
                );

                // Send push notification if not created by current user
                if (newNotification.created_by !== user.id) {
                  sendPushNotification({
                    title: 'Shein Event Calendar',
                    body: newNotification.message,
                    tag: newNotification.event_id,
                    data: {
                      event_id: newNotification.event_id,
                      notification_id: newNotification.id,
                    },
                  });
                }
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedNotification: Notification = payload.new;
              setNotifications(current =>
                current.map(n => (n.id === updatedNotification.id ? updatedNotification : n))
              );
            } else if (payload.eventType === 'DELETE') {
              setNotifications(current =>
                current.filter(n => n.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(eventsSubscription);
        supabase.removeChannel(participantsSubscription);
        supabase.removeChannel(notificationsSubscription);
      };
    }
  }, [session, user, getEvents, getUserProfile, getMyParticipations, getNotifications]);

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
    const dateStr = formatDateToYYYYMMDD(date);
    return events.filter(e => {
      return dateStr >= e.startDate && dateStr <= e.endDate;
    }).sort((a,b) => a.startDate.localeCompare(b.startDate));
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

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    if (!user) return;

    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Add current user to read_by array if not already there
    if (!notification.read_by.includes(user.id)) {
      const { error } = await supabase
        .from('notifications')
        .update({ read_by: [...notification.read_by, user.id] })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    // Get all unread notifications
    const unreadNotifications = notifications.filter(n => !n.read_by.includes(user.id));

    // Mark each one as read
    for (const notification of unreadNotifications) {
      const { error } = await supabase
        .from('notifications')
        .update({ read_by: [...notification.read_by, user.id] })
        .eq('id', notification.id);

      if (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Find the event related to this notification
    const event = events.find(e => e.id === notification.event_id);

    if (event) {
      // Close notifications modal
      setIsNotificationsModalOpen(false);

      // Open the event modal
      openModalForExistingEvent(event);
    }
  };


  if (!session) {
    return <Auth />;
  }

  // Filter events based on participation
  const filteredEvents = showMyEventsOnly
    ? events.filter(e => myParticipatingEventIds.has(e.id))
    : events;

  // Calculate unread notifications count
  const unreadNotificationsCount = user
    ? notifications.filter(n => !n.read_by.includes(user.id)).length
    : 0;

  const renderView = () => {
    switch (view) {
      case 'month':
        return <Calendar
          currentDate={currentDate}
          events={filteredEvents}
          onDateClick={openDayModal}
          onEventClick={openModalForExistingEvent}
        />;
      case 'week':
        return <WeekView
          currentDate={currentDate}
          events={filteredEvents}
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
    <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-2">
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
      <button
        onClick={() => setShowMyEventsOnly(!showMyEventsOnly)}
        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
          showMyEventsOnly
            ? 'bg-green-600 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
        title={showMyEventsOnly ? 'Mostra tutti gli eventi' : 'Mostra solo i miei eventi'}
      >
        {showMyEventsOnly ? '✓ I miei eventi' : 'Tutti gli eventi'}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans text-slate-200 bg-[#141414]">
      <Header
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userProfile={userProfile}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />
      <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
        <UpcomingEvents events={filteredEvents} onEventClick={openModalForExistingEvent} />
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
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentProfile={userProfile}
          onProfileUpdate={(profile) => {
            setUserProfile(profile);
            setIsProfileModalOpen(false);
          }}
        />
      )}
      {isNotificationsModalOpen && user && (
        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          notifications={notifications}
          currentUserId={user.id}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
      <BottomNavBar
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddEvent={() => openModalForNewEvent(formatDateToYYYYMMDD(new Date()))}
      />
    </div>
  );
};

export default App;