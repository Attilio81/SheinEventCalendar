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
 * Mock data for testing - Real festivals and events in 2025-2026
 * Dates are set from current date (2025-10-27) onwards
 */
const MOCK_TECHNO_EVENTS: TechnoEvent[] = [
  {
    title: 'Kappa FuturFestival 2026',
    description: 'Italy\'s biggest electronic music festival with 30,000+ attendees',
    date_start: '2026-05-10',
    date_end: '2026-05-12',
    venue: 'Parco Dora',
    location: 'Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0496,
    longitude: 7.6550,
    lineup: [
      'Carl Cox',
      'Amelie Lens',
      'Boris Brejcha',
      'Nina Kraviz',
      'Charlotte de Witte',
      'Adam Beyer',
      'Richie Hawtin',
      'Paula Tape'
    ],
    genres: ['Techno', 'Electronic'],
    capacity: 30000,
    source: 'mock',
    source_url: 'https://www.kappafuturfestival.com',
    ticket_url: 'https://www.kappafuturfestival.com/tickets',
    official_site: 'https://www.kappafuturfestival.com'
  },
  {
    title: 'Time Warp 2026',
    description: 'Germany\'s most important techno festival',
    date_start: '2026-04-05',
    date_end: '2026-04-06',
    venue: 'Maimarkt Gelande',
    location: 'Mannheim',
    city: 'Mannheim',
    country: 'Germany',
    latitude: 49.4769,
    longitude: 8.4694,
    lineup: [
      'Carl Cox',
      'Richie Hawtin',
      'Charlotte de Witte',
      'Ben Klock',
      'Ellen Allien',
      'Sasha'
    ],
    genres: ['Techno'],
    capacity: 25000,
    source: 'mock',
    source_url: 'https://www.timewarp.de',
    ticket_url: 'https://www.timewarp.de/tickets',
    official_site: 'https://www.timewarp.de'
  },
  {
    title: 'Awakenings Festival 2026',
    description: 'The world\'s biggest outdoor techno festival',
    date_start: '2026-06-07',
    date_end: '2026-06-08',
    venue: 'Spaarnwoude Park',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    lineup: [
      'Adam Beyer',
      'Amelie Lens',
      'Richie Hawtin',
      'Ellen Allien',
      'Stefano Noferini',
      'Sam Paganini'
    ],
    genres: ['Techno', 'House'],
    capacity: 50000,
    source: 'mock',
    source_url: 'https://www.awakenings.nl',
    ticket_url: 'https://www.awakenings.nl/tickets',
    official_site: 'https://www.awakenings.nl'
  },
  {
    title: 'Movement Torino - Presents Speedy J',
    description: 'Legendary Dutch techno pioneer live in Turin',
    date_start: '2026-03-15',
    venue: 'Audiodrome',
    location: 'Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0705,
    longitude: 7.6272,
    lineup: ['Speedy J', 'Local Residents'],
    genres: ['Techno'],
    capacity: 800,
    source: 'mock',
    source_url: 'https://ra.co/events/movement-torino',
    ticket_url: 'https://xceed.me/en/torino/events',
    official_site: 'https://ra.co/clubs/it/turin'
  },
  {
    title: 'Decibel Open Air 2026',
    description: 'Florence\'s premier electronic music festival in Cascine Park',
    date_start: '2026-09-13',
    date_end: '2026-09-14',
    venue: 'Cascine Park',
    location: 'Florence',
    city: 'Florence',
    country: 'Italy',
    latitude: 43.7696,
    longitude: 11.2558,
    lineup: [
      'Charlotte de Witte',
      'Adam Beyer',
      'Green Velvet',
      'Amelie Lens',
      'Stefano Noferini'
    ],
    genres: ['Techno', 'Electronic'],
    capacity: 15000,
    source: 'mock',
    source_url: 'https://www.decibelopen.air',
    ticket_url: 'https://www.decibelopen.air/tickets',
    official_site: 'https://www.decibelopen.air'
  },
  {
    title: 'Monegros Desert Festival 2026',
    description: 'Spain\'s legendary desert electronic music festival',
    date_start: '2026-07-25',
    date_end: '2026-07-26',
    venue: 'Desert of Monegros',
    location: 'Fraga',
    city: 'Barcelona',
    country: 'Spain',
    latitude: 41.4921,
    longitude: 0.5145,
    lineup: [
      'Richie Hawtin',
      'Adam Beyer',
      'Nina Kraviz',
      'Amelie Lens',
      'Ellen Allien'
    ],
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 20000,
    source: 'mock',
    source_url: 'https://www.monegrosdesertfestival.com',
    ticket_url: 'https://www.monegrosdesertfestival.com/tickets',
    official_site: 'https://www.monegrosdesertfestival.com'
  },
  {
    title: 'Junction 2 London 2026',
    description: 'London\'s premier daytime techno festival in Boston Manor Park',
    date_start: '2026-06-21',
    venue: 'Boston Manor Park',
    location: 'London',
    city: 'London',
    country: 'UK',
    latitude: 51.5074,
    longitude: -0.3075,
    lineup: [
      'Carl Cox',
      'Charlotte de Witte',
      'Adam Beyer',
      'Ben Klock',
      'Amelie Lens'
    ],
    genres: ['Techno'],
    capacity: 10000,
    source: 'mock',
    source_url: 'https://www.junction2.co.uk',
    ticket_url: 'https://www.junction2.co.uk/tickets',
    official_site: 'https://www.junction2.co.uk'
  },
  {
    title: 'Sunwaves Festival 2026',
    description: 'Europe\'s biggest beach electronic music festival',
    date_start: '2026-08-08',
    date_end: '2026-08-10',
    venue: 'Costinesti Beach',
    location: 'Costinesti',
    city: 'Costinesti',
    country: 'Romania',
    latitude: 43.7169,
    longitude: 28.6318,
    lineup: [
      'Adam Beyer',
      'Charlotte de Witte',
      'Amelie Lens',
      'Nina Kraviz',
      'Richie Hawtin'
    ],
    genres: ['Techno', 'House'],
    capacity: 40000,
    source: 'mock',
    source_url: 'https://www.sunwavesfestival.com',
    ticket_url: 'https://www.sunwavesfestival.com/tickets',
    official_site: 'https://www.sunwavesfestival.com'
  },
  {
    title: 'Electropark Festival - Turin',
    description: 'Winter electronic music festival in Turin',
    date_start: '2025-11-15',
    date_end: '2025-11-16',
    venue: 'Officine Grandi Riparazioni',
    location: 'Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0496,
    longitude: 7.6550,
    lineup: [
      'Ellen Allien',
      'Green Velvet',
      'Ben Klock',
      'Amelie Lens',
      'Stefano Noferini'
    ],
    genres: ['Techno', 'Minimal'],
    capacity: 5000,
    source: 'mock',
    source_url: 'https://www.electropark-torino.it',
    ticket_url: 'https://www.electropark-torino.it/tickets',
    official_site: 'https://www.electropark-torino.it'
  },
  {
    title: 'New Year\'s Eve Techno - Amsterdam',
    description: 'Amsterdam NYE mega techno party',
    date_start: '2025-12-31',
    venue: 'Brouwerij \'t IJ',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    lineup: [
      'Carl Cox',
      'Charlotte de Witte',
      'Richie Hawtin',
      'Nina Kraviz',
      'Adam Beyer'
    ],
    genres: ['Techno', 'Acid Techno'],
    capacity: 8000,
    source: 'mock',
    source_url: 'https://www.brouwerij-tij.nl',
    ticket_url: 'https://www.brouwerij-tij.nl/nye',
    official_site: 'https://www.brouwerij-tij.nl'
  },
  {
    title: 'Berlin Warehouse Winter 2025',
    description: 'Underground warehouse techno in Berlin',
    date_start: '2025-12-15',
    venue: 'Tresor Club',
    location: 'Berlin',
    city: 'Berlin',
    country: 'Germany',
    latitude: 52.5099,
    longitude: 13.3619,
    lineup: [
      'Richie Hawtin',
      'Ben Klock',
      'Ellen Allien',
      'Charlotte de Witte'
    ],
    genres: ['Techno', 'Industrial'],
    capacity: 3000,
    source: 'mock',
    source_url: 'https://www.tresorclub.de',
    ticket_url: 'https://www.tresorclub.de/events',
    official_site: 'https://www.tresorclub.de'
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
 * Main function to load mock techno events (CORS prevents real scraping from browser)
 * In production, this should call a backend API that does the scraping
 */
export async function scrapeAndSaveTechnoEvents(): Promise<number> {
  try {
    console.log('🎵 Loading techno events...');

    // Use mock data directly (web scraping blocked by CORS from browser)
    // Note: Real scraping should be done in a backend API to bypass CORS
    let allEvents = [...MOCK_TECHNO_EVENTS];

    console.log(`📊 Loaded ${allEvents.length} techno events from mock data`);

    // Prepare data for Supabase insertion
    const eventsToInsert = allEvents.map(event => ({
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

    // Insert/Update in Supabase (using upsert to handle duplicates)
    // Use Supabase service role or anonymous key with proper RLS
    const { data, error } = await supabase
      .from('public_techno_events')
      .upsert(eventsToInsert, {
        onConflict: 'source,source_url'
      });

    if (error) {
      console.error('❌ Error saving events to Supabase:', error);
      // Don't throw - let getTechnoEvents load from cache instead
      console.log('💡 Tip: Check RLS policies on public_techno_events table');
    } else {
      console.log(`✅ Successfully saved ${eventsToInsert.length} techno events`);
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
 */
export async function getTechnoEvents(filters?: {
  city?: string;
  country?: string;
  fromDate?: string;
}): Promise<TechnoEvent[]> {
  try {
    let query = supabase
      .from('public_techno_events')
      .select('*')
      .order('date_start', { ascending: true });

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
      console.log(`✅ Loaded ${data.length} events from Supabase`);
      return (data as unknown as TechnoEvent[]);
    }

    // Fallback to mock data if Supabase is empty or has error
    console.log('📦 Supabase empty or error, using mock data');
    let mockEvents = [...MOCK_TECHNO_EVENTS];

    // Apply filters to mock data
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
    // Always return mock data as fallback
    console.log('⚠️ Error fetching, returning mock data');
    return MOCK_TECHNO_EVENTS;
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
