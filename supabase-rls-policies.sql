-- Supabase RLS Policies for Shared Group Calendar
-- Run these commands in Supabase SQL Editor to allow all authenticated users to see all events

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Users can view all events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy 1: All authenticated users can view ALL events (shared calendar)
CREATE POLICY "Users can view all events"
ON events FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Authenticated users can insert events (will be tagged with their user_id)
CREATE POLICY "Users can insert their own events"
ON events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can only update their own events
CREATE POLICY "Users can update their own events"
ON events FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can only delete their own events
CREATE POLICY "Users can delete their own events"
ON events FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable Realtime for the events table
ALTER PUBLICATION supabase_realtime ADD TABLE events;
