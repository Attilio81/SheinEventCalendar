import { CalendarEvent } from '../types';

/**
 * Generates an iCalendar (.ics) file content from events
 * iCalendar format is a standard used by Google Calendar, Apple Calendar, Outlook, etc.
 *
 * NOTE: Each event has a unique UID based on its ID. When importing the same .ics file
 * multiple times into Google Calendar or Apple Calendar, the calendar app will recognize
 * duplicate UIDs and will not create duplicate events (this is handled by the calendar app).
 *
 * However, if you modify an event in Shein Calendar and export again, the calendar app
 * may create a new event instead of updating the old one, since the content will be different.
 */
export const generateICS = (events: CalendarEvent[], calendarName: string = 'Shein Event Calendar'): string => {
  // iCalendar header
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Shein Event Calendar//EN',
    `CALSCALE:GREGORIAN`,
    `METHOD:PUBLISH`,
    `X-WR-CALNAME:${escapeICSText(calendarName)}`,
    `X-WR-TIMEZONE:UTC`,
    `BEGIN:VTIMEZONE`,
    `TZID:UTC`,
    `BEGIN:STANDARD`,
    `DTSTART:19700101T000000Z`,
    `TZOFFSETFROM:+0000`,
    `TZOFFSETTO:+0000`,
    `END:STANDARD`,
    `END:VTIMEZONE`,
  ];

  // Convert events to VEVENT format
  const vevents = events.map(event => {
    // For all-day events in iCalendar, we need to use DATE format
    // and add 1 day to the end date (iCalendar spec: end date is exclusive)
    const startDate = event.startDate.replace(/-/g, '');
    const endDate = addDays(event.endDate, 1).replace(/-/g, '');

    return [
      'BEGIN:VEVENT',
      `UID:${event.id}@shein-event-calendar.local`,
      `DTSTAMP:${getCurrentTimestamp()}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeICSText(event.title)}`,
      event.location ? `LOCATION:${escapeICSText(event.location)}` : null,
      event.description ? `DESCRIPTION:${escapeICSText(event.description)}` : null,
      `CATEGORIES:${event.color}`,
      `STATUS:CONFIRMED`,
      `SEQUENCE:0`,
      'END:VEVENT',
    ].filter((line) => line !== null).join('\r\n');
  });

  // iCalendar footer
  const footer = ['END:VCALENDAR'];

  return [
    header.join('\r\n'),
    vevents.join('\r\n'),
    footer.join('\r\n'),
  ].join('\r\n');
};

/**
 * Escapes special characters for iCalendar format
 */
const escapeICSText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
};

/**
 * Adds days to a date string (YYYY-MM-DD format)
 */
const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * Gets current timestamp in iCalendar format (YYYYMMDDTHHMMSSZ)
 */
const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z');
};

/**
 * Downloads the ICS file to the user's computer
 */
export const downloadICS = (icsContent: string, filename: string = 'calendar.ics'): void => {
  // Create a Blob from the ICS content
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Copies ICS content to clipboard
 */
export const copyICSToClipboard = async (icsContent: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(icsContent);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
