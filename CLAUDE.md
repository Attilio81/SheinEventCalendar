# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Shein Event Calendar is a collaborative calendar application built with React, TypeScript, and Vite. Users can create, view, edit, and delete multi-day events with location details. The app features event participation tracking, real-time notifications, calendar export, and search functionality. Built on Supabase for authentication, database, and real-time synchronization.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm preview
```

## Environment Variables

Required environment variables (set in `.env.local` for local development):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GEOAPIFY_API_KEY` - Geoapify API key for location autocomplete

All Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

**Local setup:**
1. Copy `.env.example` to `.env.local`
2. Fill in your API keys and credentials

**Vercel deployment:**
1. Go to your Vercel project settings → Environment Variables
2. Add all required variables (they will be injected at build time)
3. Ensure `VITE_` prefix is included for client-side variables
4. Redeploy after adding/updating environment variables

## Supabase Setup

**Complete database setup (run scripts in order):**
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-setup-complete.sql` (events table)
   - Creates the events table with proper schema
   - Configures Row-Level Security (RLS) policies for shared calendar
   - Enables Realtime for live updates
   - Creates indexes for performance
3. Run `supabase-participants-setup.sql` (user profiles and event participation)
   - Creates profiles table for user nicknames
   - Creates event_participants table for attendance tracking
   - Sets up RLS policies for both tables
4. Run `supabase-notifications-setup.sql` (notifications system)
   - Creates notifications table with read tracking
   - Sets up database trigger to auto-create notification when event is created
   - Enables Realtime for notifications
5. Run `supabase-add-ticket-url.sql` (optional: adds ticket URL field to events)

**Database architecture:**
- **Shared viewing**: All authenticated users can see ALL events from all users
- **Ownership control**: Users can only edit/delete their own events
- **Event participation**: Users can mark attendance status (yes/no/maybe)
- **Automatic notifications**: Creating an event triggers a notification to all users
- **Realtime sync**: Changes are broadcast to all connected clients instantly

**Troubleshooting:**
- If you don't see events from other users, verify RLS policies are applied:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'events';
  ```
- Check if Realtime is enabled:
  ```sql
  SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
  ```

## Architecture

### State Management

**Authentication State:**
- Managed by `AuthContext` (contexts/AuthContext.tsx)
- Uses Supabase auth with session management
- `useAuth()` hook provides `session`, `user`, and `signOut` function
- Authentication state change listener ensures synchronization

**Application State:**
- Primary state is in `App.tsx`
- Events are fetched from Supabase and stored in local React state
- Real-time synchronization via Supabase subscriptions (INSERT, UPDATE, DELETE events)
- Current view ('month' | 'week' | 'day') controls which calendar view is rendered

### Database Schema

**Events table:**
- `id` - UUID primary key
- `title` - Event name
- `start_date` - Event start date (YYYY-MM-DD)
- `end_date` - Event end date (YYYY-MM-DD)
- `location` - Event location string
- `description` - Optional event description
- `color` - Visual color indicator (randomly assigned on creation)
- `ticket_url` - Optional URL for ticket purchases
- `user_id` - Foreign key to auth.users (event creator)
- `created_at`, `updated_at` - Timestamps

**Profiles table:**
- `id` - UUID primary key, references auth.users
- `nickname` - User's display name (unique)
- `created_at`, `updated_at` - Timestamps

**Event_participants table:**
- `id` - UUID primary key
- `event_id` - References events table
- `user_id` - References auth.users
- `status` - Enum: 'yes', 'no', 'maybe'
- `created_at`, `updated_at` - Timestamps
- UNIQUE constraint on (event_id, user_id) - one response per user per event

**Notifications table:**
- `id` - UUID primary key
- `event_id` - References events table
- `message` - Notification text
- `read_by` - Array of user IDs who have read the notification
- `created_by` - User who created the event (and triggered the notification)
- `created_at` - Timestamp

**Row-Level Security (RLS):**
- All tables have RLS enabled with authenticated user policies
- **Shared calendar mode**: All authenticated users can view all events, profiles, participants, and notifications
- **Ownership control**: Users can only edit/delete their own events, profiles, and participation status
- Updates/deletes enforce ownership checks in both client and database
- Database trigger automatically creates notification when event is inserted

### Component Structure

**Views:**
- `Calendar` - Month view with grid layout
- `WeekView` - Week view showing 7 days
- `DayView` - Single day view with time-based event list
- `AgendaView` - List view of all events sorted chronologically

**Modals:**
- `EventModal` - Create/edit/delete events with location autocomplete, ticket URL, and participation controls
- `DayEventsModal` - Shows all events for a selected day
- `ProfileModal` - User profile management (nickname)
- `NotificationsModal` - Real-time notifications inbox with unread indicators

**Core Components:**
- `Header` - App header with user profile, notifications bell, export button, and search bar
- `BottomNavBar` - Navigation controls (prev/next/today/add event)
- `UpcomingEvents` - List of upcoming events with quick event creation
- `Auth` - Authentication UI (login/signup)

**Utilities:**
- `dateUtils.ts` - Date formatting and manipulation helpers
- `icsGenerator.ts` - ICS calendar file generation and download
- `pushNotifications.ts` - Browser push notifications API integration
- `searchUtils.ts` - Event search functionality (title, location, description)
- `geoapifyClient.ts` - Location autocomplete integration
- `supabaseClient.ts` - Supabase client initialization

### Data Flow

1. **Initial Data Loading (on authentication):**
   - `getEvents()` - Fetches all events from Supabase (RLS determines visibility)
   - `getUserProfile()` - Fetches current user's profile (nickname)
   - `getMyParticipations()` - Fetches events user has marked as attending
   - `getNotifications()` - Fetches notifications (excluding past events)
   - `requestNotificationPermission()` - Requests browser push notification permission

2. **Real-time Synchronization (Supabase subscriptions):**
   - **Events channel**: Listens for INSERT/UPDATE/DELETE on events table
     - INSERT: Adds new event to local state (with duplicate check)
     - UPDATE: Replaces matching event in local state
     - DELETE: Removes event from local state
   - **Participants channel**: Listens for changes to event_participants (filtered by user_id)
     - Triggers `getMyParticipations()` to refresh participation list
   - **Notifications channel**: Listens for INSERT/UPDATE/DELETE on notifications table
     - INSERT: Adds notification and sends push notification (if not created by current user)
     - UPDATE/DELETE: Updates/removes from local state
     - Filters out notifications for events that have already started

3. **Event Mutations:**
   - `handleSaveEvent()` - Creates or updates events in Supabase
     - New events: Inserts with user_id, triggers notification creation via database trigger
     - Updates: RLS enforces ownership check
   - `handleDeleteEvent()` - Deletes events with explicit ownership verification
   - All mutations update via real-time subscription (no manual refetch needed)

4. **Filtering and Search:**
   - `showMyEventsOnly` toggle filters events to show only user's participating events
   - `searchTerm` filters events by title, location, or description
   - Both filters applied via `useMemo` for performance

### Third-Party Integrations

**Geoapify:**
- Used for location autocomplete in EventModal
- API key loaded from `VITE_GEOAPIFY_API_KEY`
- Provides address suggestions as user types

**Supabase:**
- Authentication (email/password)
- PostgreSQL database with RLS
- Real-time subscriptions for collaborative features

## Type Definitions

Main types are in `types.ts`:
- `CalendarEvent` - Core event interface (id, title, dates, location, description, color, user_id, ticketUrl)
- `UserProfile` - User profile data (id, nickname)
- `EventParticipant` - Participation record (id, event_id, user_id, status)
- `Notification` - Notification data (id, event_id, message, read_by, created_by, created_at)

## Key Features

**Event Management:**
- Create, edit, delete multi-day events
- Location autocomplete (Geoapify)
- Ticket URL field for event tickets
- Color-coded events for visual organization
- Event ownership controls (only creator can edit/delete)

**Participation System:**
- Users can mark attendance (yes/no/maybe) on any event
- View all participants and their responses
- Filter calendar to show only events you're attending
- Real-time updates when participation changes

**Notifications:**
- Automatic notification when event is created (database trigger)
- Real-time notification delivery to all users
- Browser push notifications support
- Unread notification counter in header
- Click notification to open event details
- Mark individual or all notifications as read

**Calendar Views:**
- Month view: Traditional calendar grid
- Week view: 7-day view with event details
- Day view: Single day with all events
- Agenda view: Chronological list of all events

**Search and Filter:**
- Real-time search across event titles, locations, and descriptions
- Toggle to show "All Events" vs "My Events" (events you're attending)
- Search bar in header with instant results

**Export:**
- Export calendar to ICS format (Apple Calendar, Google Calendar, Outlook compatible)
- Downloads all events with proper formatting

## Styling

- Uses Tailwind CSS (classes are inline in components)
- Dark theme with slate/red color scheme
- Responsive design with mobile-first approach
- Italian language UI (dates, buttons, labels)
