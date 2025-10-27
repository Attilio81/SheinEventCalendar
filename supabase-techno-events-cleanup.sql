-- CLEANUP: Remove all old/incorrect techno events and start fresh
-- Run this FIRST before running supabase-techno-events-populate.sql

-- Delete all events that contain "Charlotte de Witte" or "Audiodrome Sessions" or any mock data
DELETE FROM public_techno_events
WHERE title LIKE '%Charlotte%'
   OR title LIKE '%Audiodrome Sessions%'
   OR source IS NULL
   OR source_url IS NULL;

-- OR: Delete ALL events and start completely fresh
-- UNCOMMENT THE NEXT LINE if you want to delete EVERYTHING
-- DELETE FROM public_techno_events;

-- Verify what's left
SELECT COUNT(*) as remaining_events FROM public_techno_events;
