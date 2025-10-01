-- Complete Supabase Setup for Shein Event Calendar
-- Run this script in Supabase SQL Editor

-- Step 1: Create events table (if not exists)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    description TEXT,
    color TEXT NOT NULL DEFAULT 'blue',
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Drop existing policies if any
DROP POLICY IF EXISTS "Users can view all events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Step 3: Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

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

-- Step 5: Enable Realtime for the events table
ALTER PUBLICATION supabase_realtime ADD TABLE events;

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events(start_date);
CREATE INDEX IF NOT EXISTS events_end_date_idx ON events(end_date);

-- Verify the policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'events';
