# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Shein Event Calendar is a collaborative calendar application built with React, TypeScript, and Vite. Users can create, view, edit, and delete multi-day events with location details. The app uses Supabase for authentication, database, and real-time synchronization.

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

**Complete database setup:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the complete setup script `supabase-setup-complete.sql`
   - This creates the events table with proper schema
   - Configures Row-Level Security (RLS) policies for shared calendar
   - Enables Realtime for live updates
   - Creates indexes for performance

**What this does:**
- **Shared viewing**: All authenticated users can see ALL events from all users
- **Ownership control**: Users can only edit/delete their own events
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

**Events table (Supabase):**
- `id` - UUID primary key
- `title` - Event name
- `start_date` - Event start date (YYYY-MM-DD)
- `end_date` - Event end date (YYYY-MM-DD)
- `location` - Event location string
- `description` - Optional event description
- `color` - Visual color indicator (randomly assigned on creation)
- `user_id` - Foreign key to auth.users

**Row-Level Security (RLS):**
- RLS policies on Supabase control event access
- **Shared calendar mode**: All authenticated users can view all events
- Events are user-owned (user_id field) - only the creator can edit/delete
- Updates/deletes enforce ownership checks in both client and database
- To configure RLS policies, run `supabase-rls-policies.sql` in Supabase SQL Editor

### Component Structure

**Views:**
- `Calendar` - Month view with grid layout
- `WeekView` - Week view showing 7 days
- `DayView` - Single day view with time-based event list

**Modals:**
- `EventModal` - Create/edit/delete events, includes Geoapify location autocomplete
- `DayEventsModal` - Shows all events for a selected day

**Core Components:**
- `Header` - App header with branding
- `BottomNavBar` - Navigation controls (prev/next/today/add event)
- `UpcomingEvents` - List of upcoming events
- `Auth` - Authentication UI (login/signup)

### Data Flow

1. **Event Loading:**
   - On mount (when authenticated), `getEvents()` fetches all events from Supabase
   - RLS policies determine which events the user can see
   - Events are mapped from database schema to `CalendarEvent` interface

2. **Real-time Updates:**
   - Supabase channel subscription listens for changes to the events table
   - INSERT events are added to local state (with duplicate check)
   - UPDATE events replace matching events in local state
   - DELETE events are removed from local state

3. **Event Mutations:**
   - `handleSaveEvent()` - Creates or updates events in Supabase
   - `handleDeleteEvent()` - Deletes events with explicit ownership verification
   - UI updates automatically via real-time subscription (no manual refetch needed)

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
- `CalendarEvent` - Core event interface used throughout the app

## Styling

- Uses Tailwind CSS (classes are inline in components)
- Dark theme with slate/red color scheme
- Responsive design with mobile-first approach
