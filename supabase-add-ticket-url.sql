-- Add ticket_url column to events table
ALTER TABLE events ADD COLUMN ticket_url TEXT;

-- Add index for better query performance (optional)
CREATE INDEX idx_events_ticket_url ON events(ticket_url) WHERE ticket_url IS NOT NULL;
