-- Techno Events Setup for Shein Event Calendar
-- Run this script in Supabase SQL Editor to create the public techno events table

-- Step 1: Create public_techno_events table
CREATE TABLE IF NOT EXISTS public_techno_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event Information
    title TEXT NOT NULL,
    description TEXT,
    date_start DATE NOT NULL,
    date_end DATE,
    time_start TIME,
    time_end TIME,

    -- Location
    venue TEXT,
    location TEXT,
    city TEXT,
    country TEXT,
    latitude FLOAT,
    longitude FLOAT,

    -- Lineup (Array of DJ/Artist names)
    lineup TEXT[],

    -- Details & Media
    image_url TEXT,
    genres TEXT[],
    capacity INTEGER,

    -- Source Information
    source TEXT NOT NULL, -- 'resident_advisor' | 'xceed' | 'eventbrite' | 'eventdestination'
    source_url TEXT NOT NULL,
    ticket_url TEXT,
    official_site TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique events from same source
    UNIQUE(source, source_url)
);

-- Step 2: Enable RLS on public_techno_events
ALTER TABLE public_techno_events ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view public techno events" ON public_techno_events;
DROP POLICY IF EXISTS "Authenticated users can insert public techno events" ON public_techno_events;
DROP POLICY IF EXISTS "Authenticated users can update public techno events" ON public_techno_events;

-- Policy 1: All authenticated users can VIEW public techno events
CREATE POLICY "Anyone can view public techno events"
ON public_techno_events FOR SELECT
TO authenticated
USING (true);

-- Policy 2: All authenticated users can INSERT public techno events
CREATE POLICY "Authenticated users can insert public techno events"
ON public_techno_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: All authenticated users can UPDATE public techno events
CREATE POLICY "Authenticated users can update public techno events"
ON public_techno_events FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS public_techno_events_date_start_idx ON public_techno_events(date_start);
CREATE INDEX IF NOT EXISTS public_techno_events_city_idx ON public_techno_events(city);
CREATE INDEX IF NOT EXISTS public_techno_events_source_idx ON public_techno_events(source);
CREATE INDEX IF NOT EXISTS public_techno_events_source_url_idx ON public_techno_events(source_url);

-- Step 5: Verify the table was created
SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'public_techno_events';

-- Step 6: Verify RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'public_techno_events';
