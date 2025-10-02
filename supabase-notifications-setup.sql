-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_by UUID[] DEFAULT '{}', -- Array of user IDs who have read this notification
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all notifications
CREATE POLICY "Authenticated users can view all notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only the system/creator can insert notifications (this will be done via trigger)
CREATE POLICY "Users can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update notifications to mark them as read
CREATE POLICY "Users can update notifications to mark as read"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_event_id ON notifications(event_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create trigger function to auto-create notification when event is inserted
CREATE OR REPLACE FUNCTION create_event_notification()
RETURNS TRIGGER AS $$
DECLARE
  event_creator_name TEXT;
BEGIN
  -- Get the user's nickname from profiles, fallback to email or default
  SELECT COALESCE(p.nickname, u.email, 'Un utente') INTO event_creator_name
  FROM auth.users u
  LEFT JOIN profiles p ON p.id = u.id
  WHERE u.id = NEW.user_id;

  -- Create notification
  INSERT INTO notifications (event_id, message, created_by)
  VALUES (
    NEW.id,
    event_creator_name || ' ha creato un nuovo evento: ' || NEW.title,
    NEW.user_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after event insert
DROP TRIGGER IF EXISTS on_event_created ON events;
CREATE TRIGGER on_event_created
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_notification();
