import { CalendarEvent } from '../types';

/**
 * Searches events by title, location, and description
 * Returns events that match the search term (case-insensitive)
 */
export const searchEvents = (events: CalendarEvent[], searchTerm: string): CalendarEvent[] => {
  if (!searchTerm.trim()) {
    return events;
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  return events.filter(event => {
    const title = event.title.toLowerCase();
    const location = event.location?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';

    return (
      title.includes(lowerSearchTerm) ||
      location.includes(lowerSearchTerm) ||
      description.includes(lowerSearchTerm)
    );
  });
};

/**
 * Filters events by color
 */
export const filterEventsByColor = (events: CalendarEvent[], color: string): CalendarEvent[] => {
  if (!color) {
    return events;
  }
  return events.filter(event => event.color === color);
};

/**
 * Filters events by date range
 */
export const filterEventsByDateRange = (
  events: CalendarEvent[],
  startDate: string,
  endDate: string
): CalendarEvent[] => {
  return events.filter(event => {
    // Check if event overlaps with date range
    return event.startDate <= endDate && event.endDate >= startDate;
  });
};

/**
 * Filters events by user (creator)
 */
export const filterEventsByUser = (events: CalendarEvent[], userId: string): CalendarEvent[] => {
  return events.filter(event => event.user_id === userId);
};

/**
 * Combines multiple filters
 */
export const applyFilters = (
  events: CalendarEvent[],
  filters: {
    searchTerm?: string;
    color?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }
): CalendarEvent[] => {
  let filtered = events;

  if (filters.searchTerm) {
    filtered = searchEvents(filtered, filters.searchTerm);
  }

  if (filters.color) {
    filtered = filterEventsByColor(filtered, filters.color);
  }

  if (filters.startDate && filters.endDate) {
    filtered = filterEventsByDateRange(filtered, filters.startDate, filters.endDate);
  }

  if (filters.userId) {
    filtered = filterEventsByUser(filtered, filters.userId);
  }

  return filtered;
};
