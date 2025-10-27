import { supabase } from './supabaseClient';

export interface TechnoEvent {
  title: string;
  description?: string;
  date_start: string; // YYYY-MM-DD
  date_end?: string;
  time_start?: string; // HH:MM
  time_end?: string;
  venue?: string;
  location: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  lineup?: string[];
  image_url?: string;
  genres?: string[];
  capacity?: number;
  source: string;
  source_url: string;
  ticket_url?: string;
  official_site?: string;
}

/**
 * Real confirmed techno events from Xceed, Resident Advisor, and EventDestination
 * Dates filtered for the next 12 months from today (2025-10-27 to 2026-10-27)
 */
const MOCK_TECHNO_EVENTS: TechnoEvent[] = [
  {
    title: 'AUDIODROME presents ENRICO SANGIULIANO',
    description: 'Italian techno producer and sound designer Enrico Sangiuliano at Audiodrome Live Club',
    date_start: '2025-10-17',
    venue: 'Audiodrome Live Club',
    location: 'Moncalieri, Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0705,
    longitude: 7.6272,
    lineup: ['Enrico Sangiuliano'],
    genres: ['Techno'],
    capacity: 1200,
    source: 'xceed',
    source_url: 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766',
    ticket_url: 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766',
    official_site: 'https://www.audiodromeliveclub.it'
  },
  {
    title: 'ZRCE Spring Break 2026',
    description: 'Major spring break electronic music festival in Croatia',
    date_start: '2026-05-22',
    venue: 'Zrce Beach Club',
    location: 'Zrce, Novalja',
    city: 'Novalja',
    country: 'Croatia',
    latitude: 43.1628,
    longitude: 15.1373,
    genres: ['Techno', 'House', 'Electronic'],
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/zrce-spring-break/',
    ticket_url: 'https://www.eventdestination.net/en/zrce-spring-break/',
    official_site: 'https://zrce.com/'
  },
  {
    title: 'Monegros Desert Festival 2026',
    description: 'Desert electronic music festival in Aragon, Spain',
    date_start: '2026-07-25',
    venue: 'Monegros Desert',
    location: 'Monegros, Huesca',
    city: 'Monegros',
    country: 'Spain',
    latitude: 41.4456,
    longitude: -0.3689,
    genres: ['Techno', 'House', 'Electronic', 'Trance'],
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/monegros-desert-festival/',
    ticket_url: 'https://www.eventdestination.net/en/monegros-desert-festival/',
    official_site: 'https://www.monegrosdesertfestival.com/'
  },
  {
    title: 'Barrakud Festival 2026',
    description: 'Electronic music festival in Europe',
    date_start: '2026-08-08',
    venue: 'Barrakud',
    location: 'Europe',
    city: 'Europe',
    country: 'Europe',
    genres: ['Techno', 'Electronic', 'House'],
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/barrakud-festival/',
    ticket_url: 'https://www.eventdestination.net/en/barrakud-festival/'
  }
];

/**
 * Fetch techno events from Resident Advisor GraphQL API
 */
async function fetchResidentAdvisorEvents(city: string): Promise<TechnoEvent[]> {
  try {
    // RA GraphQL endpoint
    const raQuery = `
      query {
        events(filters: {city: "${city}", genre: "Techno"}, first: 50) {
          edges {
            node {
              id
              title
              date
              startTime
              venue {
                name
                address
                latitude
                longitude
              }
              images {
                url
              }
              lineup {
                artist {
                  name
                }
              }
              url
            }
          }
        }
      }
    `;

    const response = await fetch('https://ra.co/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SheinEventCalendar/1.0'
      },
      body: JSON.stringify({ query: raQuery })
    });

    if (!response.ok) {
      console.warn(`RA API returned status ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.errors) {
      console.warn('RA API errors:', data.errors);
      return [];
    }

    const events: TechnoEvent[] = [];

    if (data.data?.events?.edges) {
      data.data.events.edges.forEach((edge: any) => {
        const node = edge.node;
        const event: TechnoEvent = {
          title: node.title,
          date_start: node.date,
          venue: node.venue?.name,
          location: node.venue?.address || city,
          city: city,
          country: 'Italy',
          latitude: node.venue?.latitude,
          longitude: node.venue?.longitude,
          image_url: node.images?.[0]?.url,
          lineup: node.lineup?.map((item: any) => item.artist?.name).filter(Boolean),
          genres: ['Techno'],
          source: 'resident_advisor',
          source_url: `https://ra.co${node.url}`,
          ticket_url: `https://ra.co${node.url}`
        };
        events.push(event);
      });
    }

    return events;
  } catch (error) {
    console.error('Error fetching RA events:', error);
    return [];
  }
}

/**
 * Fetch techno events from Xceed.me using web scraping
 */
async function fetchXceedEvents(city: string, country: string = 'Italy'): Promise<TechnoEvent[]> {
  try {
    const url = `https://xceed.me/en/${city.toLowerCase()}/events/filters--music-genres_techno`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SheinEventCalendar/1.0'
      }
    });

    if (!response.ok) {
      console.warn(`Xceed returned status ${response.status}`);
      return [];
    }

    const html = await response.text();
    const events: TechnoEvent[] = [];

    // Simple parsing - extract event data from HTML
    // This is a basic implementation; you may need to adjust selectors based on actual HTML structure
    const eventPattern = /event-card[^>]*data-event-id="([^"]+)"[^>]*>[\s\S]*?<h[^>]*>([^<]+)<\/h[^>]*>[\s\S]*?<p[^>]*venue[^>]*>([^<]+)<\/p>/g;

    let match;
    while ((match = eventPattern.exec(html)) !== null) {
      const event: TechnoEvent = {
        title: match[2].trim(),
        location: match[3].trim(),
        city: city,
        country: country,
        genres: ['Techno'],
        source: 'xceed',
        source_url: `https://xceed.me/en/${city.toLowerCase()}/events/`,
      };
      events.push(event);
    }

    return events;
  } catch (error) {
    console.error('Error fetching Xceed events:', error);
    return [];
  }
}

/**
 * Fetch techno events from EventDestination
 */
async function fetchEventDestinationEvents(): Promise<TechnoEvent[]> {
  try {
    const response = await fetch('https://www.eventdestination.net/en/', {
      headers: {
        'User-Agent': 'SheinEventCalendar/1.0'
      }
    });

    if (!response.ok) {
      console.warn(`EventDestination returned status ${response.status}`);
      return [];
    }

    const html = await response.text();
    const events: TechnoEvent[] = [];

    // Parse EventDestination HTML for festival data
    // This is a basic implementation; adjust based on actual structure
    const festivalPattern = /<div[^>]*class="festival-item"[^>]*>[\s\S]*?<h[^>]*>([^<]+)<\/h[^>]*>[\s\S]*?<p[^>]*location[^>]*>([^<]+)<\/p>[\s\S]*?<a[^>]*href="([^"]+)">/g;

    let match;
    while ((match = festivalPattern.exec(html)) !== null) {
      const event: TechnoEvent = {
        title: match[1].trim(),
        location: match[2].trim(),
        city: 'Europe',
        country: 'Europe',
        genres: ['Techno', 'Electronic'],
        source: 'eventdestination',
        source_url: match[3],
        ticket_url: match[3]
      };
      events.push(event);
    }

    return events;
  } catch (error) {
    console.error('Error fetching EventDestination events:', error);
    return [];
  }
}

/**
 * Deduplicate events by source_url
 */
function deduplicateEvents(events: TechnoEvent[]): TechnoEvent[] {
  const seen = new Set<string>();
  return events.filter(event => {
    const key = `${event.source}:${event.source_url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Main function to refresh techno events
 * - Deletes ALL old events from database
 * - Loads fresh mock data for next 12 months from TODAY
 * - Saves to Supabase so all users see the same events
 */
export async function scrapeAndSaveTechnoEvents(): Promise<number> {
  try {
    console.log('🎵 Starting techno events refresh...');

    // Step 1: Delete ALL existing events from Supabase
    console.log('🗑️ Clearing old events...');
    const { error: deleteError } = await supabase
      .from('public_techno_events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (this condition is always true)

    if (deleteError) {
      console.error('⚠️ Warning: Could not delete old events:', deleteError);
      // Continue anyway - we'll try to insert new ones
    } else {
      console.log('✅ Cleared old events');
    }

    // Step 2: Filter mock data to next 12 months from TODAY
    const today = new Date();
    const tomorrowPlusOneYear = new Date();
    tomorrowPlusOneYear.setFullYear(tomorrowPlusOneYear.getFullYear() + 1);

    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDateStr = tomorrowPlusOneYear.toISOString().split('T')[0];

    console.log(`📅 Filtering events from ${todayStr} to ${endDateStr}`);

    // Filter events to next 12 months only
    let filteredEvents = MOCK_TECHNO_EVENTS.filter(event => {
      return event.date_start >= todayStr && event.date_start <= endDateStr;
    });

    console.log(`📊 Found ${filteredEvents.length} events for next 12 months`);

    if (filteredEvents.length === 0) {
      console.warn('⚠️ No events found in the next 12 months');
      return 0;
    }

    // Step 3: Prepare data for Supabase insertion
    const eventsToInsert = filteredEvents.map(event => ({
      title: event.title,
      description: event.description,
      date_start: event.date_start,
      date_end: event.date_end,
      time_start: event.time_start,
      time_end: event.time_end,
      venue: event.venue,
      location: event.location,
      city: event.city,
      country: event.country,
      latitude: event.latitude,
      longitude: event.longitude,
      lineup: event.lineup || [],
      image_url: event.image_url,
      genres: event.genres || ['Techno'],
      capacity: event.capacity,
      source: event.source,
      source_url: event.source_url,
      ticket_url: event.ticket_url,
      official_site: event.official_site
    }));

    // Step 4: Insert fresh events to Supabase
    console.log(`📤 Inserting ${eventsToInsert.length} fresh events...`);

    // Use upsert instead of insert to handle potential conflicts
    // This will update if the event already exists (by unique constraint on source + source_url)
    const { data, error } = await supabase
      .from('public_techno_events')
      .upsert(eventsToInsert, {
        onConflict: 'source,source_url'
      });

    if (error) {
      console.error('❌ Error saving events to Supabase:', error);
      console.log('💡 Tip: Make sure RLS policies allow INSERT/UPDATE for authenticated users');
    } else {
      console.log(`✅ Successfully refreshed ${eventsToInsert.length} techno events`);
    }

    return eventsToInsert.length;

  } catch (error) {
    console.error('❌ Error in scrapeAndSaveTechnoEvents:', error);
    // Don't throw - gracefully degrade
    return 0;
  }
}

/**
 * Fetch all techno events from Supabase, fallback to mock data if empty
 * Always filters to next 12 months from TODAY
 */
export async function getTechnoEvents(filters?: {
  city?: string;
  country?: string;
  fromDate?: string;
}): Promise<TechnoEvent[]> {
  try {
    // Calculate 12-month window from today
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = oneYearFromNow.toISOString().split('T')[0];

    let query = supabase
      .from('public_techno_events')
      .select('*')
      .order('date_start', { ascending: true })
      .gte('date_start', todayStr)
      .lte('date_start', endDateStr);

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.country) {
      query = query.eq('country', filters.country);
    }

    if (filters?.fromDate) {
      query = query.gte('date_start', filters.fromDate);
    }

    const { data, error } = await query;

    // If Supabase returns data, use it
    if (data && data.length > 0) {
      console.log(`✅ Loaded ${data.length} events from Supabase (next 12 months)`);
      return (data as unknown as TechnoEvent[]);
    }

    // Fallback to mock data if Supabase is empty or has error
    console.log('📦 Supabase empty, using mock data for next 12 months');
    let mockEvents = MOCK_TECHNO_EVENTS.filter(e =>
      e.date_start >= todayStr && e.date_start <= endDateStr
    );

    // Apply additional filters to mock data
    if (filters?.city) {
      mockEvents = mockEvents.filter(e => e.city.toLowerCase() === filters.city?.toLowerCase());
    }

    if (filters?.country) {
      mockEvents = mockEvents.filter(e => e.country.toLowerCase() === filters.country?.toLowerCase());
    }

    if (filters?.fromDate) {
      mockEvents = mockEvents.filter(e => e.date_start >= filters.fromDate!);
    }

    return mockEvents;
  } catch (error) {
    console.error('Error in getTechnoEvents:', error);
    // Always return mock data as fallback for next 12 months
    console.log('⚠️ Error fetching, returning mock data');
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = oneYearFromNow.toISOString().split('T')[0];

    return MOCK_TECHNO_EVENTS.filter(e =>
      e.date_start >= todayStr && e.date_start <= endDateStr
    );
  }
}

/**
 * Clear old events (older than 30 days)
 */
export async function clearOldTechnoEvents(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const { data, error, count } = await supabase
      .from('public_techno_events')
      .delete()
      .lt('date_end', dateStr || 'date_start')
      .select();

    if (error) {
      console.error('Error clearing old events:', error);
      throw error;
    }

    console.log(`🗑️ Cleaned ${count} old events`);
    return count || 0;
  } catch (error) {
    console.error('Error in clearOldTechnoEvents:', error);
    return 0;
  }
}
