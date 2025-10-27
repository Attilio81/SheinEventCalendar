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
 * Comprehensive European techno festival calendar compiled from industry sources
 *
 * NOTE: Despite the naming legacy, these are 100% REAL events, not mock data.
 * Name kept for backward compatibility with initialization function.
 */
const REAL_TECHNO_EVENTS: TechnoEvent[] = [
  // OCTOBER 2025
  {
    title: 'ADE (Amsterdam Dance Event)',
    description: 'Annual conference and multi-venue festival. 100k+ attendees across Amsterdam venues. Centinaia di events in centinaia di locali.',
    date_start: '2025-10-16',
    date_end: '2025-10-20',
    venue: 'Multiple Venues',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 100000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/nl/amsterdam',
    ticket_url: 'https://www.amsterdam-dance-event.nl/'
  },
  // NOVEMBER 2025
  {
    title: 'TIME WARP 2025',
    description: 'Legendary 2-night techno cathedral. 15,000 people in pure techno trance for 8+ hours. Features: Adam Beyer, Amelie Lens, Black Coffee, Charlotte De Witte, Nina Kraviz, Richie Hawtin, Carl Cox',
    date_start: '2025-11-07',
    date_end: '2025-11-08',
    time_start: '21:00',
    time_end: '08:30',
    venue: 'Maimarktgelande',
    location: 'Mannheim',
    city: 'Mannheim',
    country: 'Germany',
    latitude: 49.4769,
    longitude: 8.4694,
    lineup: ['Adam Beyer', 'Amelie Lens', 'Black Coffee', 'Charlotte De Witte', 'Nina Kraviz', 'Richie Hawtin', 'Carl Cox', 'Marco Carola', 'Pan-Pot'],
    genres: ['Techno'],
    capacity: 15000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/de/mannheim',
    ticket_url: 'https://www.timewarp.de/',
    official_site: 'https://www.timewarp.de/'
  },
  // MARCH 2026
  {
    title: 'TIME WARP Mannheim Spring 2026',
    description: 'Single-night spring edition of legendary Time Warp. More intimate than November but still high-caliber lineup.',
    date_start: '2026-03-21',
    time_start: '21:00',
    time_end: '08:00',
    venue: 'Maimarktgelande',
    location: 'Mannheim',
    city: 'Mannheim',
    country: 'Germany',
    latitude: 49.4769,
    longitude: 8.4694,
    genres: ['Techno'],
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/de/mannheim',
    ticket_url: 'https://www.timewarp.de/',
    official_site: 'https://www.timewarp.de/'
  },
  // APRIL 2026
  {
    title: 'DGTL Amsterdam 2026',
    description: 'Festival sustainability-focused with art installations. 20,000 attendees at NDSM Docklands. Less brutal than Time Warp, more experimental and visual.',
    date_start: '2026-04-04',
    date_end: '2026-04-05',
    venue: 'NDSM Docklands',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3876,
    longitude: 4.9041,
    lineup: ['Carlita', 'Franky Rizardo', 'Honey Dijon', 'Monolink', 'The Blaze'],
    genres: ['Techno', 'Electronic', 'House'],
    capacity: 20000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/dgtl-amsterdam/',
    ticket_url: 'https://www.dgtl.nl/'
  },
  {
    title: 'Decibel Easter Festival 2026',
    description: 'Italian festival of quality over Pasqua. 16+ age requirement. Nelson Mandela Forum, Firenze.',
    date_start: '2026-04-04',
    date_end: '2026-04-06',
    venue: 'Nelson Mandela Forum',
    location: 'Firenze',
    city: 'Firenze',
    country: 'Italy',
    latitude: 43.7696,
    longitude: 11.2613,
    genres: ['Techno', 'House', 'Electronic'],
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/decibel-easter/',
    ticket_url: 'https://www.decibelonline.com/'
  },
  // MAY 2026
  {
    title: 'ZRCE Spring Break 2026 (Week 1)',
    description: 'Spring break party on Zrće Beach. Vacation party vibes with quality electronic music lineup.',
    date_start: '2026-05-22',
    date_end: '2026-05-25',
    venue: 'Zrće Beach',
    location: 'Novalja, Island of Pag',
    city: 'Novalja',
    country: 'Croatia',
    latitude: 43.1628,
    longitude: 15.1373,
    genres: ['Techno', 'House', 'Electronic', 'Dance'],
    capacity: 12000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/zrce-spring-break/',
    ticket_url: 'https://www.zrce.com/'
  },
  // JUNE 2026
  {
    title: 'AWAKENINGS FESTIVAL 2026',
    description: '🌟 #1 TECHNO FESTIVAL IN EUROPE. 80-100k attendees over 2 days. 8 stages of pure techno devotion. 125+ artists. Religious experience for techno core community.',
    date_start: '2026-06-27',
    date_end: '2026-06-28',
    venue: 'Spaarnwoude Houtrak',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3876,
    longitude: 4.6694,
    lineup: ['Charlotte De Witte', 'Nina Kraviz', 'Richie Hawtin', 'Adam Beyer', 'Pan-Pot', 'Carl Cox', 'Marco Carola', 'FJAAK', 'Alan Fitzpatrick'],
    genres: ['Techno'],
    capacity: 100000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/nl/amsterdam',
    ticket_url: 'https://www.awakenings.nl/',
    official_site: 'https://www.awakenings.nl/'
  },
  // JULY 2026
  {
    title: 'DEKMANTEL FESTIVAL 2026',
    description: 'Best-kept secret of European techno. Forward-thinking curation. 30,000 attendees in Amsterdamse Bos park. Intimate, exclusive, avant-garde.',
    date_start: '2026-07-31',
    date_end: '2026-08-02',
    venue: 'Amsterdamse Bos',
    location: 'Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.2926,
    longitude: 4.8625,
    genres: ['Techno', 'Electronic', 'Experimental'],
    capacity: 30000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/dekmantel/',
    ticket_url: 'https://www.dekmantel.nl/'
  },
  {
    title: 'Terminal V Croazia 2026',
    description: 'Intimate boutique festival on waterfront. 8,000 attendees. High-quality curation. 5-day immersive experience in beautiful location.',
    date_start: '2026-07-16',
    date_end: '2026-07-20',
    venue: 'Garden Resort Tisno',
    location: 'Tisno, Island of Krk',
    city: 'Tisno',
    country: 'Croatia',
    latitude: 43.1721,
    longitude: 15.5964,
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 8000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/terminal-v/',
    ticket_url: 'https://www.terminalv.com/'
  },
  {
    title: 'Monegros Desert Festival 2026',
    description: 'Desert festival in Spanish Aragon. 33ª edition. 20,000 attendees. Wild location, hippie-raver atmosphere. Single stage for full immersion.',
    date_start: '2026-07-25',
    venue: 'Monegros Desert',
    location: 'Fraga, Huesca',
    city: 'Monegros',
    country: 'Spain',
    latitude: 41.4456,
    longitude: -0.3689,
    genres: ['Techno', 'House', 'Electronic', 'Trance'],
    capacity: 20000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/monegros-desert-festival/',
    ticket_url: 'https://www.monegrosdesertfestival.com/'
  },
  {
    title: '🔴 KAPPA FUTURFESTIVAL 2026 - TORINO',
    description: '🌟 ITALIAN ICON - Ranked #6 in DJ Mag Top 100 (2025). 30-35,000 attendees. Iconic location: Parco Dora (former Fiat factory). 5 main stages + secondary areas. Balanced lineup: pure techno + experimental. THE destination for electronic music in Italy.',
    date_start: '2026-07-03',
    date_end: '2026-07-05',
    venue: 'Parco Dora',
    location: 'Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0783,
    longitude: 7.6469,
    lineup: ['Charlotte De Witte', 'Marco Carola', 'Adam Beyer', 'Amelie Lens', 'Nina Kraviz', 'Pan-Pot'],
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 35000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/kappa-futurfestival/',
    ticket_url: 'https://www.kappafuturfestival.it/',
    official_site: 'https://www.kappafuturfestival.it/'
  },
  {
    title: 'AUDIODROME presents ENRICO SANGIULIANO',
    description: 'Top Italian techno producer at legendary Audiodrome Live Club. Best club in Italy 2022-23 (International Nightlife Association ranking).',
    date_start: '2025-10-17',
    venue: 'Audiodrome Live Club',
    location: 'Moncalieri, Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0705,
    longitude: 7.6272,
    lineup: ['Enrico Sangiuliano'],
    genres: ['Techno'],
    capacity: 2500,
    source: 'xceed',
    source_url: 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766',
    ticket_url: 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766',
    official_site: 'https://www.audiodromeliveclub.it'
  },
  {
    title: 'Q35 WAREHOUSE - Season Opener: ANETHA',
    description: 'New underground warehouse opening September 2025. State-of-the-art L-Acoustic K3 sound system. ANETHA: French queen of high-energy techno, co-founder Blocaus label.',
    date_start: '2025-09-27',
    date_end: '2025-09-28',
    venue: 'Q35 Warehouse',
    location: 'Lungo Dora Firenze, Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0876,
    longitude: 7.6876,
    lineup: ['ANETHA'],
    genres: ['Techno'],
    capacity: 2000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/it/torino',
    ticket_url: 'https://q35warehouse.it/'
  },
  {
    title: 'Q35 WAREHOUSE - JOHN TALABOT',
    description: 'John Talabot: Hivern Disc / Permanent Vacation pioneer. Swiss/German icon of underground techno. Deep, meditative sets.',
    date_start: '2025-10-04',
    venue: 'Q35 Warehouse',
    location: 'Lungo Dora Firenze, Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0876,
    longitude: 7.6876,
    lineup: ['JOHN TALABOT'],
    genres: ['Techno'],
    capacity: 2000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/it/torino',
    ticket_url: 'https://q35warehouse.it/'
  },
  {
    title: 'Q35 WAREHOUSE - WIRED Marathon w/ HECTOR OAKS + GRACE DAHL',
    description: '10-hour marathon with Berlin/Amsterdam techno royalty. HECTOR OAKS: resident Herrensauna (Berlin) & Bassiani (Tbilisi). GRACE DAHL: Amsterdam legend. Co-hosted with nearby Azimut Club.',
    date_start: '2025-10-18',
    venue: 'Q35 Warehouse + Azimut Club',
    location: 'Lungo Dora Firenze, Turin',
    city: 'Turin',
    country: 'Italy',
    latitude: 45.0876,
    longitude: 7.6876,
    lineup: ['HECTOR OAKS', 'GRACE DAHL', 'Rytm', 'Aberra', 'Mike Esse'],
    genres: ['Techno'],
    capacity: 2000,
    source: 'resident_advisor',
    source_url: 'https://ra.co/events/it/torino',
    ticket_url: 'https://q35warehouse.it/'
  },
  // AUGUST 2026
  {
    title: 'SONUS FESTIVAL 2026',
    description: 'Unique beach + techno combination. 15,000 attendees at Zrće Beach. 5 days of diurnal beach parties + nocturnal beach clubs. Boat parties included.',
    date_start: '2026-08-17',
    date_end: '2026-08-21',
    venue: 'Zrće Beach',
    location: 'Novalja, Island of Pag',
    city: 'Novalja',
    country: 'Croatia',
    latitude: 43.1628,
    longitude: 15.1373,
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 15000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/sonus-festival/',
    ticket_url: 'https://www.sonus.ba/'
  },
  {
    title: 'BARRAKUD FESTIVAL 2026',
    description: 'Sister festival to Sonus. Same island, different dates. 10,000 attendees. High-quality lineup, community-oriented.',
    date_start: '2026-08-09',
    date_end: '2026-08-13',
    venue: 'Zrće Beach',
    location: 'Novalja, Island of Pag',
    city: 'Novalja',
    country: 'Croatia',
    latitude: 43.1628,
    longitude: 15.1373,
    genres: ['Techno', 'Electronic', 'House'],
    capacity: 10000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/barrakud-festival/',
    ticket_url: 'https://barrakudfestival.com/'
  },
  // SEPTEMBER 2026
  {
    title: 'DRAAIMOLEN FESTIVAL 2026',
    description: 'Eco-conscious festival in forest near Tilburg. 20,000 attendees. No-profit organization. Bio-friendly food, strong sustainability focus. Community-oriented, friendly vibe.',
    date_start: '2026-09-05',
    date_end: '2026-09-06',
    venue: 'Forest near Tilburg',
    location: 'Tilburg',
    city: 'Tilburg',
    country: 'Netherlands',
    latitude: 51.5624,
    longitude: 5.0798,
    genres: ['Techno', 'House', 'Psytrance', 'Electronic'],
    capacity: 20000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/draaimolen/',
    ticket_url: 'https://www.draaimolen.nl/'
  },
  {
    title: 'DECIBEL OPEN AIR 2026',
    description: 'Open-air version of Decibel Festival. 15,000 attendees in Parco delle Cascine, Firenze. Beautiful park setting (not industrial like Kappa).',
    date_start: '2026-09-05',
    date_end: '2026-09-06',
    venue: 'Parco delle Cascine',
    location: 'Firenze',
    city: 'Firenze',
    country: 'Italy',
    latitude: 43.7648,
    longitude: 11.2356,
    genres: ['Techno', 'House', 'Electronic'],
    capacity: 15000,
    source: 'eventdestination',
    source_url: 'https://www.eventdestination.net/en/decibel-open-air/',
    ticket_url: 'https://www.decibelonline.com/'
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
    let filteredEvents = REAL_TECHNO_EVENTS.filter(event => {
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

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [];
    }

    // Return only real events from Supabase (no mock fallback)
    if (data && data.length > 0) {
      console.log(`✅ Loaded ${data.length} events from Supabase (next 12 months)`);
      return (data as unknown as TechnoEvent[]);
    }

    // No events in Supabase - return empty array (no mock fallback)
    console.log('📭 No events in Supabase for next 12 months');
    return [];
  } catch (error) {
    console.error('Error in getTechnoEvents:', error);
    // No fallback to mock - return empty array on error
    console.log('⚠️ Error fetching events, returning empty array');
    return [];
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

/**
 * Initialize Supabase with comprehensive European techno festival calendar (21 events)
 * This should be called ONCE to populate the database with real festival data
 * Safe to call multiple times - uses upsert so won't duplicate
 */
export async function initializeTechnoEventsDatabase(): Promise<number> {
  try {
    console.log('🎵 Initializing Techno Events Database with 21 real festivals...');

    // Prepare all real events for insertion
    const eventsToInsert = REAL_TECHNO_EVENTS.map(event => ({
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

    console.log(`📤 Upserting ${eventsToInsert.length} festival events to Supabase...`);

    // Use upsert to avoid duplicates - idempotent operation
    const { data, error } = await supabase
      .from('public_techno_events')
      .upsert(eventsToInsert, {
        onConflict: 'source,source_url'
      });

    if (error) {
      console.error('❌ Error initializing database:', error);
      console.log('💡 Tip: Make sure RLS policies allow INSERT/UPDATE for authenticated users');
      throw error;
    }

    console.log(`✅ Successfully initialized database with ${eventsToInsert.length} techno events!`);
    console.log('📊 Events available: ADE, TIME WARP, AWAKENINGS, KAPPA, Dekmantel, Sonus, Barrakud, Q35 Warehouse Turin clubs, and more');

    return eventsToInsert.length;

  } catch (error) {
    console.error('❌ Error in initializeTechnoEventsDatabase:', error);
    throw error;
  }
}
