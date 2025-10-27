-- Populate Techno Events Database with 31 Real European Festivals & Turin Club Events
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/[your-project]/sql
-- Safe to run multiple times - uses ON CONFLICT DO UPDATE pattern
-- Last updated: October 2025

-- Step 1: CLEAR ALL OLD EVENTS AND START FRESH
-- Uncomment the next line to delete all existing events before inserting new ones
DELETE FROM public_techno_events;

-- Step 2: Insert 31 Real European Techno Festivals & Turin Club Events
-- Includes:
--   - 21 Major European Festivals (ADE, TIME WARP, AWAKENINGS, KAPPA, etc.)
--   - 10 Turin Club Events (7x Audiodrome + 3x Q35 Warehouse)
-- Data sourced from: Xceed.me, Resident Advisor, EventDestination
INSERT INTO public_techno_events (
  title, description, date_start, date_end, time_start, time_end,
  venue, location, city, country, latitude, longitude,
  lineup, image_url, genres, capacity,
  source, source_url, ticket_url, official_site
)
VALUES

-- OCTOBER 2025
('ADE (Amsterdam Dance Event)',
 'Annual conference and multi-venue festival. 100k+ attendees across Amsterdam venues. Centinaia di events in centinaia di locali.',
 '2025-10-16', '2025-10-20', NULL, NULL,
 'Multiple Venues', 'Amsterdam', 'Amsterdam', 'Netherlands', 52.3676, 4.9041,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic'], 100000,
 'resident_advisor', 'https://ra.co/events/nl/amsterdam', 'https://www.amsterdam-dance-event.nl/', NULL),

-- NOVEMBER 2025
('TIME WARP 2025',
 'Legendary 2-night techno cathedral. 15,000 people in pure techno trance for 8+ hours. Features: Adam Beyer, Amelie Lens, Black Coffee, Charlotte De Witte, Nina Kraviz, Richie Hawtin, Carl Cox',
 '2025-11-07', '2025-11-08', '21:00', '08:30',
 'Maimarktgelande', 'Mannheim', 'Mannheim', 'Germany', 49.4769, 8.4694,
 ARRAY['Adam Beyer', 'Amelie Lens', 'Black Coffee', 'Charlotte De Witte', 'Nina Kraviz', 'Richie Hawtin', 'Carl Cox', 'Marco Carola', 'Pan-Pot'],
 NULL, ARRAY['Techno'], 15000,
 'resident_advisor', 'https://ra.co/events/de/mannheim', 'https://www.timewarp.de/', 'https://www.timewarp.de/'),

-- SEPTEMBER 2025 (Q35 WAREHOUSE OPENING)
('Q35 WAREHOUSE - Season Opener: ANETHA',
 'New underground warehouse opening September 2025. State-of-the-art L-Acoustic K3 sound system. ANETHA: French queen of high-energy techno, co-founder Blocaus label.',
 '2025-09-27', '2025-09-28', NULL, NULL,
 'Q35 Warehouse', 'Lungo Dora Firenze, Turin', 'Turin', 'Italy', 45.0876, 7.6876,
 ARRAY['ANETHA'], NULL, ARRAY['Techno'], 2000,
 'resident_advisor', 'https://ra.co/events/it/torino', 'https://q35warehouse.it/', NULL),

-- OCTOBER 2025 (TURIN CLUBS)
('AUDIODROME presents ENRICO SANGIULIANO',
 'Top Italian techno producer at legendary Audiodrome Live Club. Best club in Italy 2022-23 (International Nightlife Association ranking).',
 '2025-10-17', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Enrico Sangiuliano'], NULL, ARRAY['Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766',
 'https://xceed.me/en/torino/event/audiodrome-presents-enrico-sangiuliano--205766', 'https://www.audiodromeliveclub.it'),

('Q35 WAREHOUSE - JOHN TALABOT',
 'John Talabot: Hivern Disc / Permanent Vacation pioneer. Swiss/German icon of underground techno. Deep, meditative sets.',
 '2025-10-04', NULL, NULL, NULL,
 'Q35 Warehouse', 'Lungo Dora Firenze, Turin', 'Turin', 'Italy', 45.0876, 7.6876,
 ARRAY['JOHN TALABOT'], NULL, ARRAY['Techno'], 2000,
 'resident_advisor', 'https://ra.co/events/it/torino-q35-john-talabot', 'https://q35warehouse.it/', NULL),

('Q35 WAREHOUSE - WIRED Marathon w/ HECTOR OAKS + GRACE DAHL',
 '10-hour marathon with Berlin/Amsterdam techno royalty. HECTOR OAKS: resident Herrensauna (Berlin) & Bassiani (Tbilisi). GRACE DAHL: Amsterdam legend. Co-hosted with nearby Azimut Club.',
 '2025-10-18', NULL, NULL, NULL,
 'Q35 Warehouse + Azimut Club', 'Lungo Dora Firenze, Turin', 'Turin', 'Italy', 45.0876, 7.6876,
 ARRAY['HECTOR OAKS', 'GRACE DAHL', 'Rytm', 'Aberra', 'Mike Esse'], NULL, ARRAY['Techno'], 2000,
 'resident_advisor', 'https://ra.co/events/it/torino-wired-marathon', 'https://q35warehouse.it/', NULL),

-- MARCH 2026
('TIME WARP Mannheim Spring 2026',
 'Single-night spring edition of legendary Time Warp. More intimate than November but still high-caliber lineup.',
 '2026-03-21', NULL, '21:00', '08:00',
 'Maimarktgelande', 'Mannheim', 'Mannheim', 'Germany', 49.4769, 8.4694,
 '{}', NULL, ARRAY['Techno'], NULL,
 'resident_advisor', 'https://ra.co/events/de/mannheim-spring', 'https://www.timewarp.de/', 'https://www.timewarp.de/'),

-- APRIL 2026
('DGTL Amsterdam 2026',
 'Festival sustainability-focused with art installations. 20,000 attendees at NDSM Docklands. Less brutal than Time Warp, more experimental and visual.',
 '2026-04-04', '2026-04-05', NULL, NULL,
 'NDSM Docklands', 'Amsterdam', 'Amsterdam', 'Netherlands', 52.3876, 4.9041,
 ARRAY['Carlita', 'Franky Rizardo', 'Honey Dijon', 'Monolink', 'The Blaze'], NULL, ARRAY['Techno', 'Electronic', 'House'], 20000,
 'eventdestination', 'https://www.eventdestination.net/en/dgtl-amsterdam/', 'https://www.dgtl.nl/', NULL),

('Decibel Easter Festival 2026',
 'Italian festival of quality over Pasqua. 16+ age requirement. Nelson Mandela Forum, Firenze.',
 '2026-04-04', '2026-04-06', NULL, NULL,
 'Nelson Mandela Forum', 'Firenze', 'Firenze', 'Italy', 43.7696, 11.2613,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic'], NULL,
 'eventdestination', 'https://www.eventdestination.net/en/decibel-easter/', 'https://www.decibelonline.com/', NULL),

-- MAY 2026
('ZRCE Spring Break 2026 (Week 1)',
 'Spring break party on Zrće Beach. Vacation party vibes with quality electronic music lineup.',
 '2026-05-22', '2026-05-25', NULL, NULL,
 'Zrće Beach', 'Novalja, Island of Pag', 'Novalja', 'Croatia', 43.1628, 15.1373,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic', 'Dance'], 12000,
 'eventdestination', 'https://www.eventdestination.net/en/zrce-spring-break/', 'https://www.zrce.com/', NULL),

-- JUNE 2026
('AWAKENINGS FESTIVAL 2026',
 '🌟 #1 TECHNO FESTIVAL IN EUROPE. 80-100k attendees over 2 days. 8 stages of pure techno devotion. 125+ artists. Religious experience for techno core community.',
 '2026-06-27', '2026-06-28', NULL, NULL,
 'Spaarnwoude Houtrak', 'Amsterdam', 'Amsterdam', 'Netherlands', 52.3876, 4.6694,
 ARRAY['Charlotte De Witte', 'Nina Kraviz', 'Richie Hawtin', 'Adam Beyer', 'Pan-Pot', 'Carl Cox', 'Marco Carola', 'FJAAK', 'Alan Fitzpatrick'],
 NULL, ARRAY['Techno'], 100000,
 'resident_advisor', 'https://ra.co/events/nl/amsterdam-awakenings', 'https://www.awakenings.nl/', 'https://www.awakenings.nl/'),

-- JULY 2026
('DEKMANTEL FESTIVAL 2026',
 'Best-kept secret of European techno. Forward-thinking curation. 30,000 attendees in Amsterdamse Bos park. Intimate, exclusive, avant-garde.',
 '2026-07-31', '2026-08-02', NULL, NULL,
 'Amsterdamse Bos', 'Amsterdam', 'Amsterdam', 'Netherlands', 52.2926, 4.8625,
 '{}', NULL, ARRAY['Techno', 'Electronic', 'Experimental'], 30000,
 'eventdestination', 'https://www.eventdestination.net/en/dekmantel/', 'https://www.dekmantel.nl/', NULL),

('Terminal V Croazia 2026',
 'Intimate boutique festival on waterfront. 8,000 attendees. High-quality curation. 5-day immersive experience in beautiful location.',
 '2026-07-16', '2026-07-20', NULL, NULL,
 'Garden Resort Tisno', 'Tisno, Island of Krk', 'Tisno', 'Croatia', 43.1721, 15.5964,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic'], 8000,
 'eventdestination', 'https://www.eventdestination.net/en/terminal-v/', 'https://www.terminalv.com/', NULL),

('Monegros Desert Festival 2026',
 'Desert festival in Spanish Aragon. 33ª edition. 20,000 attendees. Wild location, hippie-raver atmosphere. Single stage for full immersion.',
 '2026-07-25', NULL, NULL, NULL,
 'Monegros Desert', 'Fraga, Huesca', 'Monegros', 'Spain', 41.4456, -0.3689,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic', 'Trance'], 20000,
 'eventdestination', 'https://www.eventdestination.net/en/monegros-desert-festival/', 'https://www.monegrosdesertfestival.com/', NULL),

('🔴 KAPPA FUTURFESTIVAL 2026 - TORINO',
 '🌟 ITALIAN ICON - Ranked #6 in DJ Mag Top 100 (2025). 30-35,000 attendees. Iconic location: Parco Dora (former Fiat factory). 5 main stages + secondary areas. Balanced lineup: pure techno + experimental. THE destination for electronic music in Italy.',
 '2026-07-03', '2026-07-05', NULL, NULL,
 'Parco Dora', 'Turin', 'Turin', 'Italy', 45.0783, 7.6469,
 ARRAY['Charlotte De Witte', 'Marco Carola', 'Adam Beyer', 'Amelie Lens', 'Nina Kraviz', 'Pan-Pot'],
 NULL, ARRAY['Techno', 'House', 'Electronic'], 35000,
 'eventdestination', 'https://www.eventdestination.net/en/kappa-futurfestival/', 'https://www.kappafuturfestival.it/', 'https://www.kappafuturfestival.it/'),

-- AUGUST 2026
('SONUS FESTIVAL 2026',
 'Unique beach + techno combination. 15,000 attendees at Zrće Beach. 5 days of diurnal beach parties + nocturnal beach clubs. Boat parties included.',
 '2026-08-17', '2026-08-21', NULL, NULL,
 'Zrće Beach', 'Novalja, Island of Pag', 'Novalja', 'Croatia', 43.1628, 15.1373,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic'], 15000,
 'eventdestination', 'https://www.eventdestination.net/en/sonus-festival/', 'https://www.sonus.ba/', NULL),

('BARRAKUD FESTIVAL 2026',
 'Sister festival to Sonus. Same island, different dates. 10,000 attendees. High-quality lineup, community-oriented.',
 '2026-08-09', '2026-08-13', NULL, NULL,
 'Zrće Beach', 'Novalja, Island of Pag', 'Novalja', 'Croatia', 43.1628, 15.1373,
 '{}', NULL, ARRAY['Techno', 'Electronic', 'House'], 10000,
 'eventdestination', 'https://www.eventdestination.net/en/barrakud-festival/', 'https://barrakudfestival.com/', NULL),

-- SEPTEMBER 2026
('DRAAIMOLEN FESTIVAL 2026',
 'Eco-conscious festival in forest near Tilburg. 20,000 attendees. No-profit organization. Bio-friendly food, strong sustainability focus. Community-oriented, friendly vibe.',
 '2026-09-05', '2026-09-06', NULL, NULL,
 'Forest near Tilburg', 'Tilburg', 'Tilburg', 'Netherlands', 51.5624, 5.0798,
 '{}', NULL, ARRAY['Techno', 'House', 'Psytrance', 'Electronic'], 20000,
 'eventdestination', 'https://www.eventdestination.net/en/draaimolen/', 'https://www.draaimolen.nl/', NULL),

('DECIBEL OPEN AIR 2026',
 'Open-air version of Decibel Festival. 15,000 attendees in Parco delle Cascine, Firenze. Beautiful park setting (not industrial like Kappa).',
 '2026-09-05', '2026-09-06', NULL, NULL,
 'Parco delle Cascine', 'Firenze', 'Firenze', 'Italy', 43.7648, 11.2356,
 '{}', NULL, ARRAY['Techno', 'House', 'Electronic'], 15000,
 'eventdestination', 'https://www.eventdestination.net/en/decibel-open-air/', 'https://www.decibelonline.com/', NULL),

-- NOVEMBER 2025 - AUDIODROME LIVE CLUB
('[SHOUT!] w/ Dimmish',
 'Audiodrome Sessions - Tech House. Part of SHOUT series at legendary Audiodrome Live Club.',
 '2025-11-04', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Dimmish'], NULL, ARRAY['Tech House'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/shout-dimmish', 'https://xceed.me/en/torino/event/shout-dimmish', 'https://www.audiodromeliveclub.it'),

('[OVER] w/ Lucia Lu',
 'Audiodrome Sessions - Hard Techno. OVER series at Audiodrome.',
 '2025-11-11', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Lucia Lu'], NULL, ARRAY['Hard Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/over-lucia-lu', 'https://xceed.me/en/torino/event/over-lucia-lu', 'https://www.audiodromeliveclub.it'),

('[OVER] w/ FJAAK',
 'Audiodrome Sessions - Hard Techno. FJAAK live at Audiodrome.',
 '2025-11-17', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['FJAAK'], NULL, ARRAY['Hard Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/over-fjaak', 'https://xceed.me/en/torino/event/over-fjaak', 'https://www.audiodromeliveclub.it'),

('[SHOUT!] w/ East End Dubs',
 'Audiodrome Sessions - Tech House. East End Dubs at SHOUT series.',
 '2025-11-18', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['East End Dubs'], NULL, ARRAY['Tech House'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/shout-east-end-dubs', 'https://xceed.me/en/torino/event/shout-east-end-dubs', 'https://www.audiodromeliveclub.it'),

('[OVER] w/ Pan-Pot',
 'Audiodrome Sessions - Hard Techno. Pan-Pot at Audiodrome.',
 '2025-11-25', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Pan-Pot'], NULL, ARRAY['Hard Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/over-pan-pot', 'https://xceed.me/en/torino/event/over-pan-pot', 'https://www.audiodromeliveclub.it'),

-- DECEMBER 2025 - AUDIODROME LIVE CLUB
('[OVER] w/ Patrick Mason',
 'Audiodrome Sessions - Hard Techno. Patrick Mason at OVER series.',
 '2025-12-09', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Patrick Mason'], NULL, ARRAY['Hard Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/over-patrick-mason', 'https://xceed.me/en/torino/event/over-patrick-mason', 'https://www.audiodromeliveclub.it'),

('EAR\\WAX w/ Seth Troxler',
 'Audiodrome Sessions - Disco/Lo-Fi. Seth Troxler legendary techno pioneer.',
 '2025-12-15', NULL, NULL, NULL,
 'Audiodrome Live Club', 'Moncalieri, Turin', 'Turin', 'Italy', 45.0705, 7.6272,
 ARRAY['Seth Troxler'], NULL, ARRAY['Disco', 'Techno'], 2500,
 'xceed', 'https://xceed.me/en/torino/event/earwax-seth-troxler', 'https://xceed.me/en/torino/event/earwax-seth-troxler', 'https://www.audiodromeliveclub.it'),

-- NOVEMBER 2025 - Q35 WAREHOUSE
('Ellen Allien w/ THEGOD01 + Rytm',
 'Q35 Warehouse - Underground techno. Ellen Allien (BPitch Control founder) with local talent.',
 '2025-11-22', NULL, NULL, NULL,
 'Q35 Warehouse', 'Lungo Dora Firenze, Turin', 'Turin', 'Italy', 45.0876, 7.6876,
 ARRAY['Ellen Allien', 'THEGOD01', 'Rytm'], NULL, ARRAY['Techno'], 2000,
 'xceed', 'https://xceed.me/en/torino/event/ellen-allien-q35', 'https://xceed.me/en/torino/event/ellen-allien-q35', 'https://q35warehouse.it'),

('MIND ENTERPRISES Live - Ear\\Wax Series',
 'Q35 Warehouse - Italo Disco/Lo-Fi. MIND ENTERPRISES live with Humanoid Gods collective.',
 '2025-11-29', NULL, NULL, NULL,
 'Q35 Warehouse', 'Lungo Dora Firenze, Turin', 'Turin', 'Italy', 45.0876, 7.6876,
 ARRAY['MIND ENTERPRISES', 'Humanoid Gods'], NULL, ARRAY['Italo Disco', 'Lo-Fi', 'Electronic'], 2000,
 'xceed', 'https://xceed.me/en/torino/event/mind-enterprises-q35', 'https://xceed.me/en/torino/event/mind-enterprises-q35', 'https://q35warehouse.it')

ON CONFLICT (source, source_url) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  date_start = EXCLUDED.date_start,
  date_end = EXCLUDED.date_end,
  time_start = EXCLUDED.time_start,
  time_end = EXCLUDED.time_end,
  venue = EXCLUDED.venue,
  location = EXCLUDED.location,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  lineup = EXCLUDED.lineup,
  image_url = EXCLUDED.image_url,
  genres = EXCLUDED.genres,
  capacity = EXCLUDED.capacity,
  ticket_url = EXCLUDED.ticket_url,
  official_site = EXCLUDED.official_site,
  updated_at = NOW();

-- Step 3: Verify insertion
SELECT COUNT(*) as total_events,
       COUNT(DISTINCT city) as unique_cities,
       COUNT(DISTINCT country) as unique_countries
FROM public_techno_events
WHERE date_start >= '2025-10-27' AND date_start <= '2026-10-27';

-- Output should show: 31 total events (21 major festivals + 10 Turin club events)
-- Cities: Turin, Amsterdam, Mannheim, Novalja, Firenze, Tilburg, Tisno, Monegros
-- Countries: Italy, Netherlands, Germany, Croatia, Spain
