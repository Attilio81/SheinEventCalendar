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