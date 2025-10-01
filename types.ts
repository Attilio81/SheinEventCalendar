export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  location: string;
  description?: string;
  color: string;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: 'yes' | 'no' | 'maybe';
  created_at?: string;
  updated_at?: string;
  profile?: UserProfile;
}