/**
 * Destination Catalog: Real, Highly Specific Landmarks, Monuments, and Experiences
 * Grounded in geographic reality for all popular Indian and global travel hubs.
 */

export interface SpecificActivity {
  day_number: number;
  name: string;
  category: string;
  cost: number;
  time_slot: string;
  desc: string;
  image_url?: string;
}

export interface KeyAttraction {
  name: string;
  whyVisit: string;
  bestTime: string;
  timeNeeded: string;
  area: string;
  cost: number;
  category: string;
}

export interface SeasonalTimingInfo {
  best_overall_period: string;
  peak_season: string;
  shoulder_season: string;
  off_season: string;
  weather: string;
  crowds: string;
  price_differences: string;
  special_events: string;
}

export interface GroundedTravelAdvice {
  entryVisa: string;
  currency: string;
  customs: string;
  weather: string;
  safety: string;
  transportation: string;
  practicalTips: string[];
}

export interface TypicalBudgetInfo {
  currency: string;
  budgetDaily: number;
  midDaily: number;
  luxuryDaily: number;
  notes: string;
}

export interface CatalogMetadata {
  sourceType: 'curated_catalog';
  lastVerified: string;
  confidence: 'high' | 'medium';
  disclaimer: string;
}

export const DEFAULT_CATALOG_METADATA: CatalogMetadata = {
  sourceType: 'curated_catalog',
  lastVerified: '2024-Q4',
  confidence: 'high',
  disclaimer: 'Geographic and cultural facts are verified benchmarks. Official visa policies, seasonal schedules, and local monument entry fees are subject to governmental updates.'
};

export interface DestinationProfile {
  cityName: string;
  country: string;
  currency: 'INR' | 'USD' | 'EUR' | 'JPY' | 'CHF' | 'IDR';
  coverPhoto: string;
  overview: string;
  whyVisit: string[];
  bestTimeToVisit: SeasonalTimingInfo;
  travelAdvice: GroundedTravelAdvice;
  keyPlaces: KeyAttraction[];
  typicalBudget: TypicalBudgetInfo;
  metadata?: CatalogMetadata;
  catalogMetadata?: CatalogMetadata;
  activities: SpecificActivity[];
}

export const DESTINATION_PROFILES: Record<string, DestinationProfile> = {
  // 1. PARIS (France)
  paris: {
    cityName: 'Paris',
    country: 'France',
    currency: 'EUR',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    overview: 'Paris, the French capital on the River Seine, is a global epicenter of art, haute cuisine, architectural landmarks, and fashion. Divided into 20 historical arrondissements, it combines centuries of royal history with vibrant café society.',
    whyVisit: [
      'World-renowned museums including the Musée du Louvre, Musée d’Orsay, and Centre Pompidou',
      'Iconic architectural monuments: Eiffel Tower, Arc de Triomphe, Notre-Dame, and Sainte-Chapelle',
      'Legendary culinary heritage from neighborhood boulangeries and bistros to Michelin gastronomy',
      'Walkable bohemian neighborhoods like Montmartre, Le Marais, and the Latin Quarter'
    ],
    bestTimeToVisit: {
      best_overall_period: 'April to May and September to October',
      peak_season: 'June to August (Warm weather, high tourist crowds, premium hotel rates)',
      shoulder_season: 'April–May & September–October (Mild temperatures 15°C–22°C, manageable lines, blooming gardens)',
      off_season: 'November to February (Chilly 3°C–8°C, occasional drizzle, shortest lines, lowest hotel pricing)',
      weather: 'Temperate oceanic climate with pleasant springs, warm summers, and crisp, overcast winters.',
      crowds: 'Very high during midsummer (especially July-August); low to moderate in spring and late autumn.',
      price_differences: 'Hotels are 35-50% cheaper in January/February compared to peak June/July.',
      special_events: 'Bastille Day celebrations (July 14), Nuit Blanche (October), Paris Autumn Festival'
    },
    travelAdvice: {
      entryVisa: 'Schengen Visa required for non-EU travelers (e.g. Indian passport holders). US/UK/Canadian citizens can enter visa-free for up to 90 days with upcoming ETIAS requirement.',
      currency: 'Euro (€, EUR). Contactless cards and Apple/Google Pay are accepted virtually everywhere. Tipping is not mandatory as service is included (service compris), but rounding up 5-10% for good service is customary.',
      customs: 'Always greet shopkeepers with a polite "Bonjour Madame/Monsieur" upon entering, and "Au revoir" when leaving. Speak quietly on public transit.',
      weather: 'Spring and autumn require layered clothing and an umbrella; summers can see heatwaves reaching 35°C.',
      safety: 'Paris is generally very safe, but beware of pickpockets in crowded tourist hubs (Eiffel Tower, Louvre, Gare du Nord) and common scams like petition clipboards or friendship bracelets.',
      transportation: 'The RATP Paris Metro and RER train system is dense, fast, and economical. Buy Navigo Easy cards or carnet ticket packs; avoid driving in central Paris.',
      practicalTips: [
        'Book Louvre and Eiffel Tower summit time slots at least 3-4 weeks in advance online.',
        'Many museums are closed on Mondays or Tuesdays (Louvre is closed Tuesdays, Musée d’Orsay Mondays).',
        'Carry a reusable water bottle; the city operates over 1,200 drinking fountains including sparkling water Wallace fountains.'
      ]
    },
    keyPlaces: [
      {
        name: 'Musée du Louvre',
        whyVisit: 'The world’s largest art museum holding the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo in a historic royal palace.',
        bestTime: 'Wednesday or Friday evenings for fewer crowds',
        timeNeeded: '3 to 4 hours',
        area: '1st Arrondissement (Palais-Royal)',
        cost: 22,
        category: 'Culture'
      },
      {
        name: 'Eiffel Tower & Champ de Mars',
        whyVisit: 'Gustave Eiffel’s 1889 iron lattice monument offering 360-degree views across Paris up to 70 km away.',
        bestTime: 'One hour before sunset to see day, golden hour, and the hourly night sparkle',
        timeNeeded: '2 to 3 hours',
        area: '7th Arrondissement',
        cost: 38,
        category: 'Sightseeing'
      },
      {
        name: 'Musée d’Orsay',
        whyVisit: 'Converted Beaux-Arts railway station showcasing the world’s premier Impressionist and Post-Impressionist collection (Monet, Van Gogh, Renoir, Degas).',
        bestTime: 'Thursday late afternoon/evening',
        timeNeeded: '2.5 hours',
        area: '7th Arrondissement (Left Bank)',
        cost: 16,
        category: 'Culture'
      },
      {
        name: 'Sainte-Chapelle & Conciergerie',
        whyVisit: '13th-century royal Gothic chapel with 15 soaring stained glass windows depicting over 1,100 biblical scenes.',
        bestTime: 'Midday on a sunny day for optimal light through stained glass',
        timeNeeded: '1 to 1.5 hours',
        area: 'Île de la Cité',
        cost: 13,
        category: 'Culture'
      },
      {
        name: 'Montmartre & Basilique du Sacré-Cœur',
        whyVisit: 'Historic hilltop artists village with cobblestone staircases, Place du Tertre portrait painters, and Romano-Byzantine white basilica.',
        bestTime: 'Early morning or dusk',
        timeNeeded: '3 hours',
        area: '18th Arrondissement',
        cost: 0,
        category: 'Sightseeing'
      }
    ],
    typicalBudget: {
      currency: 'EUR',
      budgetDaily: 80,
      midDaily: 190,
      luxuryDaily: 480,
      notes: 'Estimates per person/day. Mid-tier covers 3-star boutique hotel, bistro dining, metro pass, and 2 museum entrances.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Eiffel Tower Summit Access & Champ de Mars Gardens',
        category: 'Sightseeing',
        cost: 38,
        time_slot: '09:30',
        desc: 'Take the glass elevator to the 276-meter top summit of Gustave Eiffel’s iron masterpiece for panoramic views across Paris.'
      },
      {
        day_number: 1,
        name: 'Seine River Cruise on Bateaux Parisiens',
        category: 'Sightseeing',
        cost: 18,
        time_slot: '14:30',
        desc: 'Glide past Pont Neuf, Musée d’Orsay, and the Grand Palais with audio commentary on Parisian riverside architecture.'
      },
      {
        day_number: 1,
        name: 'Arc de Triomphe Rooftop & Champs-Élysées Evening Walk',
        category: 'Culture',
        cost: 16,
        time_slot: '18:00',
        desc: 'Climb 284 stairs to Napoleon’s triumphal monument overlooking 12 radiating grand boulevards lit up at dusk.'
      },
      {
        day_number: 2,
        name: 'Louvre Museum Masterpieces (Mona Lisa & Venus de Milo)',
        category: 'Culture',
        cost: 22,
        time_slot: '09:30',
        desc: 'Tour the world’s largest art museum inside the former French royal palace, viewing ancient Greek, Egyptian, and Renaissance treasures.'
      },
      {
        day_number: 2,
        name: 'Tuileries Gardens & Angelina Hot Chocolate Stroll',
        category: 'Food',
        cost: 14,
        time_slot: '13:30',
        desc: 'Stroll through Catherine de Medici’s royal gardens and taste Angelina’s famous thick African hot chocolate and Mont-Blanc pastry.'
      },
      {
        day_number: 2,
        name: 'Montmartre, Sacré-Cœur Basilica & Place du Tertre Artists',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '16:00',
        desc: 'Explore the cobblestone hill of Montmartre where Picasso and Monet painted, and enjoy street artists at Place du Tertre.'
      },
      {
        day_number: 3,
        name: 'Sainte-Chapelle Stained Glass & Latin Quarter Bookshops',
        category: 'Culture',
        cost: 13,
        time_slot: '09:30',
        desc: 'Stand beneath 1,100 stained glass biblical panels at Sainte-Chapelle, then browse vintage paperbacks at Shakespeare and Company.'
      },
      {
        day_number: 3,
        name: 'Musée d’Orsay Impressionist Masterpieces',
        category: 'Culture',
        cost: 16,
        time_slot: '14:00',
        desc: 'Admire Monet’s Water Lilies, Van Gogh’s Starry Night Over the Rhône, and Degas dancers in the converted Beaux-Arts station.'
      },
      {
        day_number: 3,
        name: 'Le Marais Evening Falafel & Boutique Exploration',
        category: 'Food',
        cost: 25,
        time_slot: '18:30',
        desc: 'Taste legendary pita falafels on Rue des Rosiers and explore historic 17th-century mansions and courtyard gardens around Place des Vosges.'
      },
      {
        day_number: 4,
        name: 'Palace of Versailles Hall of Mirrors Half-Day Excursion',
        category: 'Culture',
        cost: 32,
        time_slot: '09:00',
        desc: 'Take RER C to King Louis XIV’s gilded royal palace, touring the 73-meter Hall of Mirrors and grand fountain canal gardens.'
      },
      {
        day_number: 4,
        name: 'Saint-Germain-des-Prés Historic Literary Café Dinner',
        category: 'Food',
        cost: 45,
        time_slot: '19:00',
        desc: 'Dine on classic French duck confit and steak frites in the intellectual neighborhood of Sartre, Hemingway, and Simone de Beauvoir.'
      }
    ]
  },

  // 2. BALI (Indonesia)
  bali: {
    cityName: 'Bali',
    country: 'Indonesia',
    currency: 'IDR',
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic terraced rice paddies, spiritual Hindu water temples, coral reefs, and vibrant surf and wellness culture. Key regions include Ubud (cultural heart), Seminyak/Canggu (coastal dining and beach clubs), and Uluwatu (dramatic sea cliffs).',
    whyVisit: [
      'Sacred Balinese Hindu temple architecture: Uluwatu, Tanah Lot, Tirta Empul, and Besakih Mother Temple',
      'Verdant landscape of UNESCO Tegallalang and Jatiluwih emerald rice terraces',
      'World-class surfing, diving at Nusa Penida manta points, and Mount Batur sunrise treks',
      'Holistic yoga retreats, Balinese massage wellness, and vibrant vegan/organic culinary hubs'
    ],
    bestTimeToVisit: {
      best_overall_period: 'April to October (Dry Season)',
      peak_season: 'July, August, and Christmas/New Year (Sunny days, lower humidity, packed beaches, highest villa rates)',
      shoulder_season: 'April, May, September, October (Optimal balance: dry days, pleasant sea breeze, fewer crowds, better villa deals)',
      off_season: 'November to March (Wet Season — daily tropical afternoon downpours, high humidity ~85%, rougher seas, lowest rates)',
      weather: 'Tropical climate averaging 27°C–31°C year-round. Dry season (Apr–Oct) brings lower humidity and cooling trade winds.',
      crowds: 'Heavy in southern beach towns (Seminyak, Canggu, Kuta) during peak summer; tranquil in Sidemen, Munduk, and Amed year-round.',
      price_differences: 'Luxury pool villas can drop 40% in cost during wet season months like January/February.',
      special_events: 'Nyepi (Day of Silence — entire island shuts down including airport for 24h, usually March), Galungan and Kuningan festivals'
    },
    travelAdvice: {
      entryVisa: 'Visa on Arrival (e-VoA or on arrival at DPS Denpasar Airport) is available for 90+ nationalities (including India, US, UK, Australia) for 30 days (~IDR 500,000 / ~$35 USD), extendable once. An Indonesian tourist levy (~IDR 150,000) is also payable.',
      currency: 'Indonesian Rupiah (IDR). Large bills (50,000 & 100,000 IDR) are common. While beach clubs and restaurants accept cards, local warungs, temple entries, and markets require cash. Use ATMs located inside banks to prevent card skimming.',
      customs: 'Dress respectfully at temples: shoulders must be covered, and both men and women must wear a sarong and sash (available for rent at temple gates). Never step on "Canang Sari" (woven palm-leaf daily floral offerings on sidewalks).',
      weather: 'Tropical UV index is high—pack reef-safe sunscreen, insect repellent with DEET, and light breathable linen.',
      safety: 'Avoid "Bali Belly" by drinking strictly bottled or filtered water (never tap water), avoid drinks with questionable ice in small stalls. Take extreme caution with motorbikes/scooters—wear a certified helmet, have an International Driving Permit with motorcycle endorsement.',
      transportation: 'Bali does not have a comprehensive train or bus network. Use Grab or Gojek apps for rides and food in South Bali/Ubud, or hire a private car with driver for full-day excursions (~$40–$55 USD / ₹3,500–₹4,500 per 10-hour day).',
      practicalTips: [
        'Respect Nyepi Day if traveling in March: no lights, no leaving hotels/villas, no flights.',
        'Traffic between Denpasar, Seminyak, Canggu, and Ubud can be severe; allow 1.5–2 hours for travel during rush hours.',
        'Watch out for cheeky macaques at Uluwatu Temple and Ubud Monkey Forest—secure glasses, hats, and phones in bags.'
      ]
    },
    keyPlaces: [
      {
        name: 'Uluwatu Temple (Pura Luhur Uluwatu)',
        whyVisit: 'Ancient 11th-century cliffside temple perched 70 meters above crashing Indian Ocean waves, famous for sunset Kecak fire dance.',
        bestTime: '16:30 for temple grounds, 18:00 for sunset Kecak performance',
        timeNeeded: '2.5 to 3 hours',
        area: 'Bukit Peninsula (South Bali)',
        cost: 150000,
        category: 'Culture'
      },
      {
        name: 'Tanah Lot Temple',
        whyVisit: 'Iconic offshore rock formation temple surrounded by crashing ocean tides at high water, dedicated to sea gods.',
        bestTime: '17:00 for golden sunset silhouette',
        timeNeeded: '2 hours',
        area: 'Tabanan Regency',
        cost: 75000,
        category: 'Culture'
      },
      {
        name: 'Tegallalang Rice Terraces & Alas Harum',
        whyVisit: 'Cascading emerald green rice paddies carved into river valleys using the 9th-century communal Balinese Subak irrigation system.',
        bestTime: '07:30 to 09:00 before midday heat and tour buses arrive',
        timeNeeded: '2 to 3 hours',
        area: 'Ubud (Gianyar)',
        cost: 50000,
        category: 'Sightseeing'
      },
      {
        name: 'Tirta Empul Holy Water Temple',
        whyVisit: 'Sacred water purification temple founded in 962 CE where pilgrims and travelers bathe in 30 spouts fed by natural freshwater springs.',
        bestTime: '08:30 morning before crowds',
        timeNeeded: '2 hours',
        area: 'Tampaksiring (near Ubud)',
        cost: 50000,
        category: 'Culture'
      },
      {
        name: 'Mount Batur Sunrise Trek',
        whyVisit: 'Pre-dawn active volcano hike (1,717m) to witness sun rising above the clouds and Lake Batur with breakfast cooked on volcanic steam vents.',
        bestTime: '02:00 pickup for 06:00 summit sunrise',
        timeNeeded: '6 hours (hiking + transit)',
        area: 'Kintamani',
        cost: 450000,
        category: 'Adventure'
      }
    ],
    typicalBudget: {
      currency: 'USD',
      budgetDaily: 35,
      midDaily: 95,
      luxuryDaily: 280,
      notes: 'Per person/day. Mid-tier covers private pool villa room, private day driver share, café brunches, and temple tickets.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Ubud Sacred Monkey Forest Sanctuary & Royal Palace',
        category: 'Sightseeing',
        cost: 80000,
        time_slot: '09:30',
        desc: 'Stroll through moss-covered ancient temples and banyan trees inhabited by over 1,000 long-tailed Balinese macaques in central Ubud.'
      },
      {
        day_number: 1,
        name: 'Tegallalang Terraced Rice Paddies & Jungle Swing',
        category: 'Adventure',
        cost: 150000,
        time_slot: '14:00',
        desc: 'Hike through UNESCO Subak irrigation rice valleys and soar over jungle canopies on the iconic Bali giant swing.'
      },
      {
        day_number: 1,
        name: 'Bebek Bengil (Dirty Duck Diner) Crispy Duck Feast',
        category: 'Food',
        cost: 180000,
        time_slot: '18:30',
        desc: 'Savor traditional Balinese crispy duck with sambal matah, fragrant rice, and green beans overlooking illuminated lotus ponds.'
      },
      {
        day_number: 2,
        name: 'Tirta Empul Holy Spring Purification Ritual',
        category: 'Culture',
        cost: 50000,
        time_slot: '09:00',
        desc: 'Partake in the traditional Melukat spiritual water cleanse under eleven sacred natural stone spring spouts.'
      },
      {
        day_number: 2,
        name: 'Tibumana Waterfall & Jungle Canyon Swim',
        category: 'Sightseeing',
        cost: 30000,
        time_slot: '13:30',
        desc: 'Walk through bamboo bridges and fern-lined gorges to swim in the tranquil natural pool beneath a cascading 20-meter curtain falls.'
      },
      {
        day_number: 2,
        name: 'Tanah Lot Ocean Rock Temple Sunset Vista',
        category: 'Sightseeing',
        cost: 75000,
        time_slot: '17:00',
        desc: 'Watch the sunset glow behind the ancient wave-swept offshore temple shrine while ocean tide wraps the rocky causeway.'
      },
      {
        day_number: 3,
        name: 'Mount Batur Sunrise Summit Hike & Volcanic Steam Breakfast',
        category: 'Adventure',
        cost: 450000,
        time_slot: '03:30',
        desc: 'Hike to the summit of active Mount Batur caldera to watch the sunrise above the cloud bank and Lake Batur.'
      },
      {
        day_number: 3,
        name: 'Toya Devasya Natural Volcanic Hot Springs Soak',
        category: 'Relaxation',
        cost: 150000,
        time_slot: '10:30',
        desc: 'Soothe muscles in geothermal lakeside mineral pools looking directly at the volcanic rim of Kintamani.'
      },
      {
        day_number: 3,
        name: 'Jimbaran Bay Candlelit Seafood BBQ on the Sand',
        category: 'Food',
        cost: 350000,
        time_slot: '18:30',
        desc: 'Feast on fresh charcoal-grilled snapper, jumbo prawns, and calamari with your toes in the sand as waves lap the beach.'
      },
      {
        day_number: 4,
        name: 'Padang Padang Surf Beach & Karang Boma Cliff Walk',
        category: 'Relaxation',
        cost: 25000,
        time_slot: '10:00',
        desc: 'Descend through limestone sea cave stairs to the secluded golden cove of Padang Padang, then walk along 90-meter sea cliffs.'
      },
      {
        day_number: 4,
        name: 'Uluwatu Clifftop Temple & Sunset Kecak Fire Dance',
        category: 'Culture',
        cost: 150000,
        time_slot: '16:30',
        desc: 'Marvel at 70-meter limestone cliffs over the Indian Ocean followed by the dramatic 50-man choral Kecak Fire Dance reciting the Ramayana.'
      }
    ]
  },

  // 3. KYOTO (Japan)
  kyoto: {
    cityName: 'Kyoto',
    country: 'Japan',
    currency: 'JPY',
    coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    overview: 'Kyoto, the former imperial capital of Japan for over 1,000 years, is celebrated for its 2,000+ classical Buddhist temples, serene Shinto shrines, Zen rock gardens, traditional wooden machiya townhouses, and centuries-old geisha heritage in Gion.',
    whyVisit: [
      '17 designated UNESCO World Heritage sites including Kinkaku-ji, Kiyomizu-dera, and Ryoan-ji',
      'The magical tunnel of 10,000 vermilion torii gates at Fushimi Inari Taisha',
      'Towering green bamboo stalks and Tenryu-ji Zen pond in Arashiyama',
      'Preserved lantern-lit geisha districts of Gion and Pontocho Alley'
    ],
    bestTimeToVisit: {
      best_overall_period: 'Late March to mid-April (Cherry Blossoms) & November (Autumn Foliage)',
      peak_season: 'Spring Sakura (late March–April) & Autumn Koyo (November). Astonishing colors, crisp air, very high hotel demand.',
      shoulder_season: 'May to June & September to October (Pleasant weather, blooming irises/greenery, fewer crowds than peak cherry blossoms)',
      off_season: 'January to February (Chilly 2°C–9°C, occasional snow dustings on golden temples, quietest temple visits, great deals)',
      weather: 'Kyoto sits in a mountain basin, meaning summers (July-August) are notoriously hot and humid (34°C+), while winters are crisp and cold.',
      crowds: 'Very high during peak sakura and peak foliage; visit famous sites like Fushimi Inari and Arashiyama at sunrise (06:30) to experience serene tranquility.',
      price_differences: 'Ryokan and boutique hotels double in price during peak cherry blossom weeks in early April.',
      special_events: 'Gion Matsuri (July grand float festival), Aoi Matsuri (May), Hanatoro lantern illuminations'
    },
    travelAdvice: {
      entryVisa: 'Japan offers 90-day visa-free entry to 68+ countries (US, UK, Canada, Australia, Singapore, EU). Indian travelers can obtain an eVisa or single/multiple entry tourist visa with straightforward documentation.',
      currency: 'Japanese Yen (¥, JPY). Japan is still partly cash-oriented for coin lockers, temple entry kiosks, street food, and neighborhood ramen shops. Pick up an IC card (Suica, Pasmo, or ICOCA) for effortless train/bus taps.',
      customs: 'Remove shoes when entering temples, ryokans, and tatami dining areas. Never walk and eat on the street. Never photograph Geishas/Maiko without permission in Gion (private alleys have strict no-photography fines). Tipping is strictly NOT practiced and considered rude.',
      weather: 'Pack slip-on walking shoes because you will remove shoes dozens of times daily at temple halls.',
      safety: 'Kyoto is one of the safest cities in the world with virtually non-existent violent crime.',
      transportation: 'Kyoto has two subway lines and a comprehensive city bus network. From Tokyo, the Tokaido Shinkansen bullet train reaches Kyoto Station in just 2 hours and 15 minutes. Kansai International Airport (KIX) is 75 minutes away via JR Haruka Express.',
      practicalTips: [
        'Start your days early: Fushimi Inari and Arashiyama Bamboo Grove are open 24/7—visit at 07:00 AM to enjoy empty paths.',
        'Rent an electric-assist bicycle to easily explore eastern Kyoto (Higashiyama) and northern temple trails.',
        'Reserve kaiseki multi-course dinners and temple tea ceremony experiences 2-4 weeks in advance.'
      ]
    },
    keyPlaces: [
      {
        name: 'Fushimi Inari Taisha (10,000 Torii Gates)',
        whyVisit: 'Sacred mountain shrine dedicated to Inari (god of rice & commerce), with trails lined by over 10,000 vibrant vermilion torii gates winding up Mount Inari.',
        bestTime: '06:30 AM early morning or dusk when stone lanterns are illuminated',
        timeNeeded: '2.5 to 3.5 hours for full mountain loop',
        area: 'Fushimi (Southern Kyoto)',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Kinkaku-ji (The Golden Pavilion)',
        whyVisit: 'Zen Buddhist temple whose top two floors are completely covered in pure gold leaf, reflecting gracefully across Kyoko-chi (Mirror Pond).',
        bestTime: '09:00 AM right at opening or 16:00 when golden light catches the facade',
        timeNeeded: '1 to 1.5 hours',
        area: 'Kita Ward (Northern Kyoto)',
        cost: 500,
        category: 'Sightseeing'
      },
      {
        name: 'Kiyomizu-dera & Higashiyama Streets',
        whyVisit: 'UNESCO temple founded in 778 CE famous for its massive wooden stage built entirely without nails hanging over hillside cherry/maple trees.',
        bestTime: '08:00 AM or sunset',
        timeNeeded: '2.5 hours including Ninenzaka & Sannenzaka preserved stone streets',
        area: 'Higashiyama',
        cost: 400,
        category: 'Culture'
      },
      {
        name: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Garden',
        whyVisit: 'Towering canopy of green bamboo stalks swaying with the wind, adjacent to the 14th-century world heritage Zen garden of Tenryu-ji.',
        bestTime: '07:00 AM before crowds',
        timeNeeded: '2.5 hours',
        area: 'Arashiyama (Western Kyoto)',
        cost: 500,
        category: 'Sightseeing'
      },
      {
        name: 'Gion District & Shirakawa Canal',
        whyVisit: 'Preserved Edo-period wooden machiya merchant houses, willow-lined canals, and lantern-lit teahouses where apprentice geiko (maiko) train.',
        bestTime: '17:30 to 19:30 dusk promenade',
        timeNeeded: '2 hours',
        area: 'Gion',
        cost: 0,
        category: 'Sightseeing'
      }
    ],
    typicalBudget: {
      currency: 'USD',
      budgetDaily: 55,
      midDaily: 140,
      luxuryDaily: 380,
      notes: 'Per person/day. Mid-tier covers 3-star central hotel or boutique machiya, JR/bus transit, lunch ramen & dinner kaiseki, and 3 temple tickets.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Fushimi Inari Taisha 10,000 Vermilion Torii Gate Mountain Trek',
        category: 'Culture',
        cost: 0,
        time_slot: '07:00',
        desc: 'Hike through the vibrant vermilion gate tunnels up sacred Mount Inari with panoramic views of southern Kyoto.'
      },
      {
        day_number: 1,
        name: 'Kiyomizu-dera Wooden Stage & Otowa Spring',
        category: 'Sightseeing',
        cost: 400,
        time_slot: '11:00',
        desc: 'Stand on the nail-less wooden cantilever stage overlooking lush forest and drink from sacred mineral streams.'
      },
      {
        day_number: 1,
        name: 'Ninenzaka & Sannenzaka Historic Stone Steppes Walk',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '14:30',
        desc: 'Wander preserved Edo-era pedestrian lanes lined with matcha teahouses, handmade fans, and incense shops.'
      },
      {
        day_number: 1,
        name: 'Gion Hanamikoji & Shirakawa Lantern Evening Stroll',
        category: 'Culture',
        cost: 0,
        time_slot: '18:00',
        desc: 'Walk past 18th-century timber teahouses along the willow-lined canal, hoping for a respectful glimpse of Geiko.'
      },
      {
        day_number: 2,
        name: 'Arashiyama Soaring Green Bamboo Forest Path',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '07:30',
        desc: 'Listen to the rustling bamboo stalks in the early morning stillness of western Kyoto.'
      },
      {
        day_number: 2,
        name: 'Tenryu-ji UNESCO Zen Landscape Pond Garden',
        category: 'Culture',
        cost: 500,
        time_slot: '09:30',
        desc: 'Contemplate the 14th-century pond garden designed by Muso Soseki reflecting Arashiyama’s mountain peaks.'
      },
      {
        day_number: 2,
        name: 'Kinkaku-ji (Golden Pavilion) & Mirror Pond Walk',
        category: 'Culture',
        cost: 500,
        time_slot: '14:00',
        desc: 'Gaze upon the glittering gold-leaf Zen relic pavilion reflecting in the serene forested waters.'
      },
      {
        day_number: 2,
        name: 'Nishiki Market "Kyoto’s Kitchen" Culinary Tasting Trail',
        category: 'Food',
        cost: 2500,
        time_slot: '17:30',
        desc: 'Sample grilled tako tamago (baby octopus), freshly fried fish cakes, pickled Kyoto vegetables, and matcha ice cream.'
      }
    ]
  },

  // 4. SWITZERLAND
  switzerland: {
    cityName: 'Switzerland',
    country: 'Switzerland',
    currency: 'CHF',
    coverPhoto: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    overview: 'Switzerland is a mountainous Central European nation famed for the snowcapped Alps, crystal-clear alpine lakes, world-class cogwheel mountain railways, medieval old towns, fondue cuisine, and outdoor adventures spanning hiking, mountaineering, and skiing.',
    whyVisit: [
      'Iconic alpine peaks: The Matterhorn in Zermatt, Jungfraujoch (Top of Europe), and Mount Pilatus',
      'Scenic panoramic train journeys: Glacier Express, Bernina Express, and GoldenPass Line',
      'Picture-postcard lake towns: Lucerne, Interlaken, Montreux, and Lake Geneva',
      'Alpine gastronomy: authentic Swiss Gruyère fondue, raclette, Rösti, and artisanal Swiss chocolates'
    ],
    bestTimeToVisit: {
      best_overall_period: 'June to September (Alpine Hiking & Lakes) & December to March (Skiing & Winter Wonderland)',
      peak_season: 'Summer (July–August: warm 20°C–27°C, all mountain passes open, peak hiking) & Winter (Dec–Feb: peak ski resorts, snow wonderlands)',
      shoulder_season: 'May–June (Wildflowers bloom, melting snow runs crystal waterfalls, fewer tourists) & September–October (Golden autumn larches, wine harvests)',
      off_season: 'November & April (Transition months: many high-altitude cable cars close for maintenance, unpredictable weather)',
      weather: 'Temperate alpine climate. Summers are pleasant (18°C–25°C in valleys), while winter in high resorts brings consistent sub-zero snow cover.',
      crowds: 'High in Zermatt, Lucerne, and Interlaken during July-August; tranquil in lesser-known valleys like Engadin and Appenzell.',
      price_differences: 'Switzerland is a premium destination year-round; booking hotels 3-5 months in advance offers significant savings.',
      special_events: 'Montreux Jazz Festival (July), Fête de l’Escalade Geneva (December), Cow parades (Désalpe in September)'
    },
    travelAdvice: {
      entryVisa: 'Switzerland is a member of the Schengen Area. Non-EU visitors require a valid Schengen tourist visa or visa-free entry (e.g. US, UK, Australia, Canada up to 90 days).',
      currency: 'Swiss Franc (CHF). Credit/debit cards are accepted everywhere down to mountain huts. While Euros are accepted at some border towns and train stations, change is given in CHF at unfavorable exchange rates.',
      customs: 'Punctuality is deeply valued—Swiss trains and buses depart strictly on the exact second scheduled. Respect quiet hours (Nachtruhe) between 22:00 and 07:00.',
      weather: 'Mountain weather changes rapidly: always carry a windbreaker/waterproof jacket even on warm sunny valley days.',
      safety: 'Exceptionally safe country with pristine tap water in every fountain and very low crime.',
      transportation: 'Buy a Swiss Travel Pass (STP). It grants unlimited travel on trains, boats, postal buses, and city transit across the entire nation, plus free entry to 500+ museums and 50% off high alpine cable cars.',
      practicalTips: [
        'Do not buy bottled water: natural alpine water runs from thousands of public fountains across every city and village.',
        'Use the SBB Mobile app for live train platforms, connections, and mountain transport schedules.',
        'Dining out is expensive—supermarkets (Coop, Migros) offer delicious grab-and-go Swiss sandwiches, salads, and chocolates.'
      ]
    },
    keyPlaces: [
      {
        name: 'Jungfraujoch (Top of Europe 3,454m)',
        whyVisit: 'Highest railway station in Europe nestled between Mönch and Jungfrau peaks, featuring the Ice Palace inside Aletsch Glacier.',
        bestTime: 'Early morning cogwheel train on a cloudless day',
        timeNeeded: '5 to 6 hours round trip from Interlaken',
        area: 'Bernese Oberland (Interlaken/Lauterbrunnen)',
        cost: 160,
        category: 'Adventure'
      },
      {
        name: 'The Matterhorn & Gornergrat Railway (Zermatt)',
        whyVisit: 'Iconic pyramidal peak of the Matterhorn viewed from 3,089m Gornergrat observation ridge looking over Gorner Glacier.',
        bestTime: '08:30 morning for calm lake reflections at Riffelsee',
        timeNeeded: '4 to 5 hours',
        area: 'Valais (Zermatt)',
        cost: 95,
        category: 'Sightseeing'
      },
      {
        name: 'Lucerne Chapel Bridge & Lake Lucerne Boat Cruise',
        whyVisit: '14th-century covered wooden footbridge with interior historical triangular paintings, backed by Mount Pilatus and Lake Lucerne.',
        bestTime: 'Late afternoon followed by lake steamer cruise',
        timeNeeded: '3 hours',
        area: 'Lucerne (Central Switzerland)',
        cost: 35,
        category: 'Sightseeing'
      },
      {
        name: 'Lauterbrunnen Valley of 72 Waterfalls',
        whyVisit: 'Glacial valley flanked by 300m vertical limestone cliffs with roaring Staubbach Falls and Trümmelbach glacial water chutes.',
        bestTime: 'Morning hike through valley meadows',
        timeNeeded: '3 hours',
        area: 'Lauterbrunnen',
        cost: 15,
        category: 'Adventure'
      }
    ],
    typicalBudget: {
      currency: 'CHF',
      budgetDaily: 110,
      midDaily: 260,
      luxuryDaily: 650,
      notes: 'Per person/day. Switzerland is among the most expensive nations; Swiss Travel Pass provides immense savings on transportation.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Lucerne Historic Chapel Bridge & Water Tower Walk',
        category: 'Culture',
        cost: 0,
        time_slot: '09:30',
        desc: 'Cross Europe’s oldest covered wooden footbridge admiring 17th-century paintings depicting Swiss history.'
      },
      {
        day_number: 1,
        name: 'Mount Pilatus "Golden Round Trip" Cogwheel & Cableway',
        category: 'Adventure',
        cost: 72,
        time_slot: '13:00',
        desc: 'Ride the world’s steepest 48-degree cogwheel railway from Alpnachstad up to Pilatus Kulm summit for lake panoramas.'
      },
      {
        day_number: 1,
        name: 'Traditional Swiss Cheese Fondue & Rösti Dinner in Old Town',
        category: 'Food',
        cost: 45,
        time_slot: '19:00',
        desc: 'Dip crusty artisan bread into bubbling Gruyère and Vacherin Fribourgeois fondue accompanied by local white wine.'
      },
      {
        day_number: 2,
        name: 'Lauterbrunnen Valley Staubbach Falls & Alpine Meadow Walk',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '09:00',
        desc: 'Hike along the glacial valley floor past cascading 297-meter Staubbach Falls and grazing Swiss Simmental cows.'
      },
      {
        day_number: 2,
        name: 'Jungfraujoch Sphinx Observatory & Aletsch Glacier Ice Palace',
        category: 'Adventure',
        cost: 160,
        time_slot: '11:30',
        desc: 'Ascend to 3,454m through the Eiger north wall tunnel to walk inside subterranean ice sculptures carved into the glacier.'
      },
      {
        day_number: 3,
        name: 'Gornergrat Cogwheel Train to Zermatt Matterhorn Panoramas',
        category: 'Sightseeing',
        cost: 95,
        time_slot: '09:30',
        desc: 'Ride Switzerland’s first electric cogwheel railway up to 3,089m with direct view of the jagged Matterhorn.'
      },
      {
        day_number: 3,
        name: 'Riffelsee Alpine Lake Mirror Reflection Hike',
        category: 'Adventure',
        cost: 0,
        time_slot: '13:30',
        desc: 'Walk to the crystal alpine tarn where the Matterhorn casts a mirror reflection across still waters.'
      }
    ]
  },

  // 5. TOKYO (Japan)
  tokyo: {
    cityName: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    overview: 'Tokyo is Japan’s hyper-modern capital blending neon skyscrapers with historic temples, world-class culinary excellence (holding the most Michelin stars globally), anime subculture, pristine public transport, and distinctly themed neighborhoods from Shibuya to Asakusa.',
    whyVisit: [
      'Futuristic technology, teamLab digital art museums, and bustling Shibuya Scramble Crossing',
      'Historic heritage: Senso-ji Temple in Asakusa and tranquil Meiji Shrine forest in Harajuku',
      'Culinary paradise: fresh Tsukiji seafood, ramen alleys, yakitori beneath train tracks in Shinjuku',
      'Electric subcultures in Akihabara (electronics/anime) and fashion boutiques in Ginza and Omotesando'
    ],
    bestTimeToVisit: {
      best_overall_period: 'March to May (Spring) & September to November (Autumn)',
      peak_season: 'Late March to mid-April (Cherry blossom blooms across Ueno Park, Meguro River, Shinjuku Gyoen)',
      shoulder_season: 'October to November (Clear crisp skies, mild 17°C–21°C weather, vibrant yellow ginkgo trees)',
      off_season: 'July to August (Summer heatwaves 33°C+, high humidity, rainy season in June) & January (Cold 4°C–11°C, clear Mt. Fuji views)',
      weather: 'Four distinct seasons. Spring and autumn are comfortable; summers are tropical and humid; winters are dry and sunny.',
      crowds: 'High in major tourist hubs; however, Tokyo handles density with unmatched organizational efficiency.',
      price_differences: 'Hotel prices surge during Golden Week (early May) and Cherry Blossom season (late March/early April).',
      special_events: 'Sanja Matsuri in Asakusa (May), Kanda Matsuri (May), Sumida River Fireworks (July)'
    },
    travelAdvice: {
      entryVisa: '90-day visa-free entry for US, EU, UK, Canada, Australia. Indian citizens can apply easily via Japan e-Visa system.',
      currency: 'Japanese Yen (¥, JPY). Major department stores and convenience stores accept cards, but cash is essential for ticket machines, shrines, and ramen vending tickets. Use 7-Eleven ATMs for foreign cards.',
      customs: 'Keep your voice down on trains and set phones to silent (manner mode). Do not eat or drink while walking. Stand on the left of escalators in Tokyo (right in Osaka). Tipping is not accepted.',
      weather: 'Carry an umbrella in June; light breathable clothes in July/August; warm coat and layers December–February.',
      safety: 'Tokyo is universally recognized as one of the safest metropolitan cities globally. Lost property is routinely returned.',
      transportation: 'Tokyo Metro and JR Yamanote Line connect every major borough. Buy an IC card (Suica/Pasmo) on your phone or at the airport for tap-and-go transit.',
      practicalTips: [
        'Public trash cans are rare in Tokyo—carry a small plastic bag in your daypack for your own waste.',
        'Convenience stores (7-Eleven, Lawson, FamilyMart) offer gourmet-level onigiri, bento, and egg salad sandwiches at low prices.',
        'Book teamLab Planets and Shibuya Sky tickets 2-4 weeks ahead to secure golden-hour sunset slots.'
      ]
    },
    keyPlaces: [
      {
        name: 'Senso-ji Temple & Nakamise Shopping Street',
        whyVisit: 'Tokyo’s oldest temple (founded 628 CE) featuring the giant red Kaminarimon paper lantern and traditional souvenir stalls.',
        bestTime: '08:00 AM or illuminated at night (20:00)',
        timeNeeded: '2 hours',
        area: 'Asakusa',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Shibuya Crossing & Shibuya Sky',
        whyVisit: 'The world’s busiest pedestrian intersection with up to 3,000 people crossing simultaneously, viewed from a 229m open-air rooftop observatory.',
        bestTime: 'Sunset into dusk for neon illuminations',
        timeNeeded: '2.5 hours',
        area: 'Shibuya',
        cost: 2200,
        category: 'Sightseeing'
      },
      {
        name: 'Meiji Jingu Shrine & Yoyogi Park',
        whyVisit: 'Grand imperial Shinto shrine nestled inside a tranquil 170-acre sacred forest of 120,000 evergreen trees donated from across Japan.',
        bestTime: '09:00 AM morning stroll',
        timeNeeded: '2 hours',
        area: 'Harajuku / Shibuya',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'teamLab Planets TOKYO',
        whyVisit: 'Body-immersive digital art museum where visitors walk barefoot through reactive water rooms of digital koi and floating orchid gardens.',
        bestTime: 'Midday or late evening slot',
        timeNeeded: '2 hours',
        area: 'Toyosu',
        cost: 3800,
        category: 'Culture'
      }
    ],
    typicalBudget: {
      currency: 'USD',
      budgetDaily: 60,
      midDaily: 155,
      luxuryDaily: 420,
      notes: 'Per person/day. Mid-tier covers modern 3-star business hotel (e.g. Richmond/Candeo), metro pass, tonkatsu/sushi dinners, and attraction admissions.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Senso-ji Temple & Nakamise-dori Market in Asakusa',
        category: 'Culture',
        cost: 15,
        time_slot: '09:00',
        desc: 'Pass beneath Kaminarimon giant red lantern to Tokyo’s oldest 7th-century Buddhist temple and sample fresh ningyo-yaki sweets.'
      },
      {
        day_number: 1,
        name: 'Tokyo Skytree 350m & 450m Observation Decks',
        category: 'Sightseeing',
        cost: 28,
        time_slot: '13:30',
        desc: 'Look out over the sprawling Tokyo metropolitan skyline and distant Mount Fuji from the world’s third-tallest structure.'
      },
      {
        day_number: 1,
        name: 'Akihabara Electric Town & Retro Gaming Arcade Exploration',
        category: 'Sightseeing',
        cost: 20,
        time_slot: '17:00',
        desc: 'Immerse in Tokyo’s tech and anime epicenter, multi-floor vintage Nintendo arcades, and gadget alleys.'
      },
      {
        day_number: 2,
        name: 'Meiji Jingu Shinto Shrine & Yoyogi Forest Trail',
        category: 'Culture',
        cost: 5,
        time_slot: '09:30',
        desc: 'Walk through towering 12-meter cedar torii gates through a tranquil 170-acre evergreen forest to the imperial Shinto shrine.'
      },
      {
        day_number: 2,
        name: 'Takeshita Street Harajuku & Omotesando Tree-Lined Avenue',
        category: 'Sightseeing',
        cost: 18,
        time_slot: '13:00',
        desc: 'Experience youth fashion trends, artisan Japanese crepes, and world-class architectural flagships along Omotesando.'
      },
      {
        day_number: 2,
        name: 'Shibuya Crossing, Hachiko Memorial & Shibuya Sky Rooftop',
        category: 'Sightseeing',
        cost: 22,
        time_slot: '17:30',
        desc: 'Step into the world’s busiest pedestrian intersection, greet the loyal dog Hachiko statue, and view the city from 229m above.'
      },
      {
        day_number: 3,
        name: 'Tsukiji Outer Fish Market Fresh Nigiri & Wagyu Tasting',
        category: 'Food',
        cost: 35,
        time_slot: '09:00',
        desc: 'Sample fresh Pacific tuna nigiri, flame-torched A5 wagyu skewers, and sweet tamagoyaki omelettes from century-old stalls.'
      },
      {
        day_number: 3,
        name: 'teamLab Planets Immersive Digital Art Museum in Toyosu',
        category: 'Culture',
        cost: 32,
        time_slot: '14:00',
        desc: 'Wade barefoot through knee-deep water rooms of floating digital koi, infinite crystal universes, and reactive mirror gardens.'
      },
      {
        day_number: 3,
        name: 'Shinjuku Omoide Yokocho (Memory Lane) & Golden Gai Izakayas',
        category: 'Food',
        cost: 40,
        time_slot: '19:00',
        desc: 'Sit at historic lantern-lit wooden counters for charcoal yakitori skewers, Sapporo draft beer, and micro-bar hopping.'
      }
    ]
  },

  // 6. GOA (India)
  goa: {
    cityName: 'Goa',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    overview: 'Goa is India’s coastal paradise on the Arabian Sea, renowned for its 100+ km of sandy beaches, Portuguese colonial architecture, UNESCO heritage basilicas, bohemian flea markets, and vibrant seaside shacks serving Goan fish curry.',
    whyVisit: [
      'Pristine golden beaches: Palolem and Agonda in South Goa; lively Baga, Anjuna, and Vagator in North Goa',
      'UNESCO World Heritage 16th-century Portuguese cathedrals in Old Goa and Latin Quarter of Fontainhas',
      'Adventurous water sports, Dudhsagar 4x4 jungle waterfall treks, and spice plantation banquets',
      'Celebrated Konkan and Portuguese fusion cuisine featuring prawn balchão, pork vindaloo, and bebinca'
    ],
    bestTimeToVisit: {
      best_overall_period: 'November to February (Pleasant winter beach weather)',
      peak_season: 'December to January (Christmas, Sunburn Festival, New Year celebrations, packed beaches, highest prices)',
      shoulder_season: 'October & March–April (Warm sunshine, gentle sea breeze, great hotel rates, water sports operational)',
      off_season: 'June to September (Monsoon season — dramatic tropical rains, lush green landscapes, rough sea swimming suspended, peaceful vibe)',
      weather: 'Tropical coastal climate: warm and dry in winter (20°C–32°C); hot and humid in May (35°C); heavy monsoons Jun–Sep.',
      crowds: 'Heavy in North Goa coastal stretches (Baga, Calangute) in midwinter; South Goa retains tranquil charm year-round.',
      price_differences: 'Resort rates in late December can be 3x to 4x higher than monsoon or shoulder seasons.',
      special_events: 'Goa Carnival (February), Sunburn Festival (December), Feast of St. Francis Xavier (December 3)'
    },
    travelAdvice: {
      entryVisa: 'Indian domestic travelers need no visa; international travelers require an Indian e-Tourist Visa.',
      currency: 'Indian Rupee (₹, INR). UPI (Google Pay, PhonePe, Paytm) and cards are accepted at hotels and shacks; carry cash for local beach vendors and scooters.',
      customs: 'Swimwear is suitable on beaches, but dress modestly (cover shoulders/knees) when visiting Old Goa churches and historic temples.',
      weather: 'Carry high SPF sunscreen, sunglasses, and mosquito repellent for evening shack dining.',
      safety: 'Pay heed to beach flags (red flags mean do not enter the sea due to strong rip currents). Only hire licensed white-plated self-drive cars or yellow-on-black rental scooters.',
      transportation: 'Goa has two operational international airports: Dabolim (GOI) in central Goa and Manohar Intl Mopa (GOX) in North Goa. Direct trains arrive at Madgaon (MAO) and Thivim (THVM). Renting a scooter (₹350–₹600/day) or self-drive car is the most flexible way to explore.',
      practicalTips: [
        'North Goa is famous for nightlife, beach clubs, and water sports; South Goa is preferred for pristine quiet beaches and heritage resorts.',
        'Pre-book airport prepaid cabs via Goa Taxi App or airport counters to avoid inflated cab tariffs.'
      ]
    },
    keyPlaces: [
      {
        name: 'Basilica of Bom Jesus & Se Cathedral (Old Goa)',
        whyVisit: '16th-century UNESCO World Heritage church housing the mortal relics of St. Francis Xavier and the largest golden church bell in Asia.',
        bestTime: '09:00 AM before tour bus crowds',
        timeNeeded: '2 hours',
        area: 'Old Goa',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Fontainhas Latin Quarter (Panaji)',
        whyVisit: 'Asia’s only surviving Portuguese Latin quarter, featuring pastel-colored 18th-century heritage villas with wooden balconies and tiled roofs.',
        bestTime: 'Late afternoon walking tour',
        timeNeeded: '2 hours',
        area: 'Panaji',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Aguada Fort & Portuguese Lighthouse',
        whyVisit: '1612 coastal fortress built by the Portuguese atop Sinquerim cliff overlooking the vast Arabian Sea.',
        bestTime: '09:30 AM or 17:00 for sunset',
        timeNeeded: '1.5 hours',
        area: 'Sinquerim (North Goa)',
        cost: 50,
        category: 'Sightseeing'
      },
      {
        name: 'Dudhsagar Waterfalls',
        whyVisit: 'Four-tiered 310m milky-white waterfall cascading through the Western Ghats jungle inside Bhagwan Mahavir Wildlife Sanctuary.',
        bestTime: '08:00 AM jeep safari pickup',
        timeNeeded: '5 hours',
        area: 'Sanguem / Western Ghats',
        cost: 1800,
        category: 'Adventure'
      },
      {
        name: 'Palolem Beach & Butterfly Island',
        whyVisit: 'Gentle crescent-shaped South Goa beach lined with coconut palms, calm turquoise waters ideal for swimming, and dolphin spotting cruises.',
        bestTime: 'Late afternoon and sunset',
        timeNeeded: 'Half day',
        area: 'Canacona (South Goa)',
        cost: 0,
        category: 'Relaxation'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1800,
      midDaily: 4800,
      luxuryDaily: 14500,
      notes: 'Per person/day. Mid-tier covers 3/4-star beach resort, rental scooter, beach shack meals with fresh seafood, and activities.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Fontainhas Latin Quarter Heritage Walk in Panaji',
        category: 'Culture',
        cost: 250,
        time_slot: '09:30',
        desc: 'Wander through vibrant Portuguese colonial alleys, 18th-century tiled cottages with overhanging balconies, and visit Gitanjali Art Gallery.'
      },
      {
        day_number: 1,
        name: 'Our Lady of the Immaculate Conception Church & Miramar Beach',
        category: 'Sightseeing',
        cost: 100,
        time_slot: '14:30',
        desc: 'Visit the landmark 1609 Baroque zig-zag church in central Panaji, then catch the coastal breeze at Miramar promenade.'
      },
      {
        day_number: 1,
        name: 'Mandovi River Sunset Cruise with Goan Folk Dance',
        category: 'Sightseeing',
        cost: 650,
        time_slot: '18:00',
        desc: 'Board a double-decker river cruise from Santa Monica Jetty for sunset views along the Mandovi river with live Dekhni folk dancing.'
      },
      {
        day_number: 2,
        name: 'Basilica of Bom Jesus & Se Cathedral in Old Goa',
        category: 'Culture',
        cost: 150,
        time_slot: '09:30',
        desc: 'Explore UNESCO World Heritage 16th-century churches preserving the sacred relics of St. Francis Xavier and the golden bell tower.'
      },
      {
        day_number: 2,
        name: 'Sahakari Spice Plantation Guided Tour & Buffet Lunch',
        category: 'Food',
        cost: 600,
        time_slot: '13:00',
        desc: 'Walk through vanilla, cinnamon, and betel-nut groves with an herbalist guide, followed by an authentic Goan buffet on banana leaves.'
      },
      {
        day_number: 2,
        name: 'Anjuna Beach Sunset & Curlies Beach Shack Dining',
        category: 'Nightlife',
        cost: 950,
        time_slot: '17:30',
        desc: 'Relax on volcanic rocky bluffs watching the sun sink into the Arabian Sea while dining on Goan fish curry and prawn balchão.'
      },
      {
        day_number: 3,
        name: 'Aguada Fort & Portuguese Lighthouse on Sinquerim Cliff',
        category: 'Sightseeing',
        cost: 200,
        time_slot: '09:30',
        desc: 'Explore the 1612 fortress overlooking the sea and the four-storey Portuguese lighthouse that protected Goa from Dutch invaders.'
      },
      {
        day_number: 3,
        name: 'Calangute & Baga Beach Water Sports (Parasailing & Jet Ski)',
        category: 'Adventure',
        cost: 1500,
        time_slot: '13:30',
        desc: 'Experience tandem parasailing high over the Arabian Sea, jet-ski speed circuits, and bumper boat rides along the golden sands.'
      },
      {
        day_number: 3,
        name: 'Tito’s Lane & Arpora Saturday Night Market',
        category: 'Nightlife',
        cost: 800,
        time_slot: '19:30',
        desc: 'Browse bohemian leather goods, handcrafted jewelry, listen to live international DJs, and sample artisanal wood-fired pizzas.'
      },
      {
        day_number: 4,
        name: 'Dudhsagar Waterfalls 4x4 Jeep Safari Trek',
        category: 'Adventure',
        cost: 1800,
        time_slot: '08:30',
        desc: 'Ride through Bhagwan Mahavir Wildlife Sanctuary across gushing riverbeds to swim at the base of the mighty four-tiered 310m white waterfall.'
      },
      {
        day_number: 4,
        name: 'Palolem Beach & Butterfly Island Boat Tour in South Goa',
        category: 'Relaxation',
        cost: 700,
        time_slot: '16:00',
        desc: 'Cruise along peaceful crescent-shaped South Goan bays, spot playful wild dolphins, and watch golden sunset hues from Palolem’s calm shore.'
      }
    ]
  },

  // 7. AHMEDABAD (India)
  ahmedabad: {
    cityName: 'Ahmedabad',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
    overview: 'Ahmedabad, India’s first UNESCO World Heritage City, is Gujarat’s cultural and economic metropolis situated on the Sabarmati River. Famous as the cradle of Mahatma Gandhi’s freedom struggle, it features stunning Indo-Islamic stepwells, intricately carved pols (wooden housing clusters), and legendary night street food.',
    whyVisit: [
      'Mahatma Gandhi’s tranquil Sabarmati Ashram (Hriday Kunj)',
      '15th-century subterranean architectural marvel: Adalaj Stepwell with 5 levels of ornate carvings',
      'The "Tree of Life" stone jali screen at Sidi Saiyyed Mosque',
      'Manek Chowk midnight jewelry market transforming into a legendary street food haven'
    ],
    bestTimeToVisit: {
      best_overall_period: 'November to February (Cool, pleasant winter season)',
      peak_season: 'November to January (Navratri dance festivities & International Kite Festival in January)',
      shoulder_season: 'October & March (Warm days ~32°C, comfortable evenings)',
      off_season: 'April to June (Scorching dry heat with daytime temperatures exceeding 43°C)',
      weather: 'Semi-arid climate with mild winters (12°C–28°C) and hot summers.',
      crowds: 'Moderate; massive cultural buzz during International Kite Festival (Uttarayan, January 14-15).',
      price_differences: 'Hotels fill fast around Kite Festival in mid-January.',
      special_events: 'International Kite Festival (Uttarayan), 9-night Navratri Garba celebrations'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements apply.',
      currency: 'Indian Rupee (INR, ₹). UPI accepted everywhere; cash handy for street food.',
      customs: 'Remove shoes at Sabarmati Ashram and temples. Gujarat is historically a dry state (alcohol restricted; out-of-state/international visitors can obtain liquor permits at designated hotel counters).',
      weather: 'Light cottons year-round; light sweater in December/January evenings.',
      safety: 'Rated among India’s safest cities with low street crime, even late at night in busy food markets.',
      transportation: 'Ahmedabad Metro connects east and west banks; extensive BRTS bus lanes and auto-rickshaws. Sardar Vallabhbhai Patel International Airport (AMD) is 20 minutes from the city center.',
      practicalTips: [
        'Visit Manek Chowk after 21:30 when jewelry stores close and the square converts into a street food bazaar.',
        'Take an early morning guided Ahmedabad Heritage Walk through the historic pols of old city.'
      ]
    },
    keyPlaces: [
      {
        name: 'Sabarmati Ashram (Gandhi Memorial)',
        whyVisit: 'Historic headquarters of Mahatma Gandhi from 1917 to 1930, launch site of the iconic Salt March (Dandi Yatra).',
        bestTime: '08:30 AM morning tranquility',
        timeNeeded: '2 hours',
        area: 'Ashram Road (Sabarmati)',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Adalaj Stepwell (Rudabai Stepwell)',
        whyVisit: 'Five-storey 1499 CE underground octagonal stepwell carved with intricate Solanki floral and mythological motifs.',
        bestTime: '10:00 AM when sunlight filters into lower shafts',
        timeNeeded: '1.5 hours',
        area: 'Gandhinagar / Ahmedabad border',
        cost: 25,
        category: 'Culture'
      },
      {
        name: 'Sidi Saiyyed Mosque',
        whyVisit: 'Famous for the 1573 CE intricately carved ten stone jali windows featuring the intertwined branches of the Tree of Life.',
        bestTime: '11:00 AM for daylight through the stone lattice',
        timeNeeded: '45 mins',
        area: 'Old City (Gheekanta)',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Manek Chowk Night Food Market',
        whyVisit: 'Historic city square that transforms every night into a vibrant culinary hub famous for Gwalior Dosa, chocolate cheese sandwiches, and kulfi.',
        bestTime: '22:00 to 01:00 midnight',
        timeNeeded: '2 hours',
        area: 'Old City',
        cost: 400,
        category: 'Food'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1200,
      midDaily: 3200,
      luxuryDaily: 8500,
      notes: 'Per person/day. Mid-tier covers heritage haveli stay, auto/cab transit, and local Gujarati thali dining.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Sabarmati Ashram & Hriday Kunj Guided Memorial Walk',
        category: 'Culture',
        cost: 0,
        time_slot: '09:00',
        desc: 'Walk through Mahatma Gandhi’s riverside cottage, spinning wheel museum, and original letter archives.'
      },
      {
        day_number: 1,
        name: 'Adalaj 5-Storey Subterranean Stepwell Exploration',
        category: 'Culture',
        cost: 50,
        time_slot: '11:30',
        desc: 'Descend five carved stone levels into the cool 15th-century stepwell admiring Solanki artisan masonry.'
      },
      {
        day_number: 1,
        name: 'Agashiye Rooftop Authentic Gujarati Thali Feast',
        category: 'Food',
        cost: 1100,
        time_slot: '13:30',
        desc: 'Dine on 18-course royal Gujarati thali with dhokla, ringna no olo, puran poli, and fresh shrikhand.'
      },
      {
        day_number: 1,
        name: 'Sidi Saiyyed Stone Jali & Sabarmati Riverfront Evening Walk',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '17:30',
        desc: 'View the famous Tree of Life stone lattice followed by sunset breeze along the Sabarmati promenade.'
      },
      {
        day_number: 1,
        name: 'Manek Chowk Midnight Street Food Trail',
        category: 'Food',
        cost: 450,
        time_slot: '21:30',
        desc: 'Sample Gwalior butter dosa, pineapple sandwich with cheese, jamun shots, and Ashrafi rabdi kulfi.'
      }
    ]
  },

  // 8. MUMBAI (India)
  mumbai: {
    cityName: 'Mumbai',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    overview: 'Mumbai (formerly Bombay), India’s financial powerhouse and home to Bollywood, is a high-energy coastal metropolis situated on seven merged islands. It combines Victorian Gothic and Art Deco heritage with bustling local trains, seaside promenades, and world-famous street food.',
    whyVisit: [
      'Gateway of India overlooking Mumbai Harbour and the historic Taj Mahal Palace Hotel',
      'UNESCO Victorian Gothic Chhatrapati Shivaji Maharaj Terminus (CST) and Marine Drive Queen’s Necklace',
      'Elephanta Caves 6th-century rock-cut Shiva sculptures on Elephanta Island',
      'Legendary Mumbai street food: Vada Pav, Pav Bhaji, Pani Puri at Chowpatty, and coastal seafood'
    ],
    bestTimeToVisit: {
      best_overall_period: 'November to February (Cool, pleasant coastal breeze)',
      peak_season: 'December to January (Comfortable 18°C–30°C temperatures, cultural festivals)',
      shoulder_season: 'October & March (Warm and humid)',
      off_season: 'June to August (Heavy monsoon downpours, occasional waterlogging)',
      weather: 'Tropical coastal climate; warm and humid year-round with heavy monsoons.',
      crowds: 'Very high across all transport and public hubs.',
      price_differences: 'Hotels in South Mumbai (Colaba, Marine Drive) are at peak rates in winter.',
      special_events: 'Ganesh Chaturthi (September grand immersions), Kala Ghoda Arts Festival (February)'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements apply.',
      currency: 'Indian Rupee (INR, ₹). UPI and cards widely accepted.',
      customs: 'Dress respectfully when entering temples (Siddhivinayak, Haji Ali Dargah).',
      weather: 'Light breathable clothes year-round.',
      safety: 'Generally very safe with 24/7 street life; mind your pockets in overcrowded local trains.',
      transportation: 'Mumbai Suburban Railway is the lifeline; Mumbai Metro and kaali-peeli cabs / Uber provide convenient transit. Chhatrapati Shivaji Maharaj Intl (BOM) is central.',
      practicalTips: [
        'Ride the ferry from Gateway of India to Elephanta Island in the morning for calm seas.',
        'Stroll along Marine Drive promenade between 18:00 and 20:00 to see the sunset over the Arabian Sea.'
      ]
    },
    keyPlaces: [
      {
        name: 'Gateway of India & Taj Mahal Palace Hotel',
        whyVisit: '1924 basalt ceremonial arch built to commemorate King George V, standing across from the iconic 1903 heritage hotel.',
        bestTime: '08:30 AM before harbor tour crowds',
        timeNeeded: '1.5 hours',
        area: 'Colaba (South Mumbai)',
        cost: 0,
        category: 'Sightseeing'
      },
      {
        name: 'Elephanta Caves (UNESCO Island Shrines)',
        whyVisit: 'Rock-cut basalt cave temples dating to 5th–7th century CE featuring the monumental 7-meter Sadashiva Trimurti sculpture.',
        bestTime: 'Morning ferry from Gateway of India (closed Mondays)',
        timeNeeded: '4 hours round trip',
        area: 'Elephanta Island (Mumbai Harbour)',
        cost: 260,
        category: 'Culture'
      },
      {
        name: 'Marine Drive & Girgaon Chowpatty Sunset',
        whyVisit: '3.6 km C-shaped coastal boulevard known as the Queen’s Necklace when street lamps illuminate at night, paired with beach bhel puri.',
        bestTime: '17:30 to 19:30 sunset promenade',
        timeNeeded: '2 hours',
        area: 'Marine Lines / Churchgate',
        cost: 0,
        category: 'Sightseeing'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 2200,
      midDaily: 5500,
      luxuryDaily: 16000,
      notes: 'Per person/day. South Mumbai hotels command premium rates.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Gateway of India & Colaba Heritage Walking Trail',
        category: 'Culture',
        cost: 0,
        time_slot: '09:00',
        desc: 'Admire the monumental basalt arch over Mumbai harbor and walk through Colaba Causeway’s heritage buildings.'
      },
      {
        day_number: 1,
        name: 'Elephanta Caves Ferry & Trimurti Rock Sculptures',
        category: 'Culture',
        cost: 260,
        time_slot: '11:00',
        desc: 'Cruise across Mumbai Harbour to explore ancient 6th-century rock-cut Shiva cave temples on Elephanta Island.'
      },
      {
        day_number: 1,
        name: 'Marine Drive Sunset & Girgaon Chowpatty Street Food',
        category: 'Food',
        cost: 250,
        time_slot: '17:30',
        desc: 'Watch the Queen’s Necklace curve light up while sampling authentic Mumbai sev puri, bhel puri, and kulfi.'
      }
    ]
  },

  // 9. UDAIPUR (India)
  udaipur: {
    cityName: 'Udaipur',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    overview: 'Udaipur, the City of Lakes and former capital of the Mewar Kingdom in Rajasthan, is famed for its romantic marble palaces, serene lakeside ghats, Aravalli hill fortresses, and vibrant Rajasthani arts.',
    whyVisit: [
      'The massive City Palace complex overlooking Lake Pichola',
      'Sunset boat cruises past the floating marble Taj Lake Palace to Jag Mandir island',
      'Dharohar folk dance performances with fire balancers at Bagore Ki Haveli',
      'Rooftop Mewari thali dinners overlooking illuminated lake waters'
    ],
    bestTimeToVisit: {
      best_overall_period: 'October to March (Winter months with crisp lake breezes)',
      peak_season: 'December to January (Grand weddings, holiday tourists, perfect 12°C–28°C weather)',
      shoulder_season: 'October & March (Pleasant weather, fewer crowds)',
      off_season: 'April to June (Hot summer 38°C–42°C) & July–September (Monsoon brings lush greenery and full lakes)',
      weather: 'Warm desert/semi-arid climate; delightful sunny winters and humid lush monsoons.',
      crowds: 'High in old city and lakeside ghats during winter weekends.',
      price_differences: 'Heritage havelis double in price in December.',
      special_events: 'Mewar Festival (March/April), Shilpgram Crafts Fair (December)'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements.',
      currency: 'Indian Rupee (INR, ₹). UPI and cards widely accepted.',
      customs: 'Dress modestly when visiting Jagdish Temple.',
      weather: 'Comfortable day cottons with evening light jacket in winter.',
      safety: 'Very tourist-friendly and safe.',
      transportation: 'Old city streets around Lake Pichola are narrow—walking and auto-rickshaws are best. Maharana Pratap Airport (UDR) is 25 km away.',
      practicalTips: [
        'Book the 17:00 boat ride from Bansi Ghat to reach Jag Mandir right before golden hour sunset.',
        'Buy Bagore Ki Haveli Dharohar dance tickets at 16:30 for the 19:00 evening performance.'
      ]
    },
    keyPlaces: [
      {
        name: 'City Palace of Udaipur & Crystal Gallery',
        whyVisit: 'Rajasthan’s largest palace complex built over 400 years with peacock mosaic courtyards and royal Mewar museum.',
        bestTime: '09:30 AM right at opening',
        timeNeeded: '3 hours',
        area: 'Lake Pichola East Bank',
        cost: 450,
        category: 'Culture'
      },
      {
        name: 'Lake Pichola Sunset Boat Cruise to Jag Mandir',
        whyVisit: 'Scenic boat ride past the floating Taj Lake Palace to the 17th-century marble island pleasure palace of Jag Mandir.',
        bestTime: '17:00 sunset cruise',
        timeNeeded: '1.5 hours',
        area: 'Lake Pichola',
        cost: 650,
        category: 'Sightseeing'
      },
      {
        name: 'Bagore Ki Haveli Dharohar Dance',
        whyVisit: 'Historic 18th-century waterfront mansion hosting nightly folk dances with 7-pot brass balancing and puppetry.',
        bestTime: '19:00 show',
        timeNeeded: '1.5 hours',
        area: 'Gangaur Ghat',
        cost: 250,
        category: 'Culture'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1600,
      midDaily: 4200,
      luxuryDaily: 12500,
      notes: 'Per person/day. Lakeside boutique hotels offer superb views.'
    },
    activities: [
      {
        day_number: 1,
        name: 'City Palace of Udaipur & Crystal Gallery Tour',
        category: 'Culture',
        cost: 450,
        time_slot: '09:30',
        desc: 'Explore the grand 16th-century lakeside palace of the Maharanas, including Mor Chowk peacock courtyards, Zenana Mahal, and the royal armory museum.'
      },
      {
        day_number: 1,
        name: 'Jagdish Temple & Old City Miniature Paintings Trail',
        category: 'Sightseeing',
        cost: 150,
        time_slot: '14:00',
        desc: 'Admire the 1651 CE intricately carved Indo-Aryan stone temple, then visit generational Mewar miniature painting studios on Gangaur Ghat Road.'
      },
      {
        day_number: 1,
        name: 'Lake Pichola Sunset Boat Cruise to Jag Mandir Island',
        category: 'Sightseeing',
        cost: 650,
        time_slot: '17:30',
        desc: 'Board a scenic motorboat at Bansi Ghat, glide past the iconic Taj Lake Palace, and explore the 17th-century marble palace gardens of Jag Mandir.'
      },
      {
        day_number: 1,
        name: 'Ambrai Ghat Dinner by Lake Pichola',
        category: 'Food',
        cost: 1200,
        time_slot: '20:00',
        desc: 'Savor authentic Rajasthani Laal Maas and Mewari dal baati churma right at the water’s edge with panoramic night views of the illuminated City Palace.'
      }
    ]
  },

  // 10. JAIPUR (India)
  jaipur: {
    cityName: 'Jaipur',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1603288940300-471120308b23?auto=format&fit=crop&w=1200&q=80',
    overview: 'Jaipur, the capital of Rajasthan and famed "Pink City", forms India’s Golden Triangle along with Delhi and Agra. Renowned for its imposing hilltop forts, astronomical observatories, honeycomb palace facades, and vibrant bazaars.',
    whyVisit: [
      'Amber Fort citadel with Sheesh Mahal (Hall of Mirrors) perched on the Aravalli hills',
      'Hawa Mahal (Palace of Winds) with its 953 honeycombed jharokha windows',
      'Jantar Mantar UNESCO observatory with the world’s largest stone sundial',
      'Traditional Rajasthani handicrafts, blue pottery, Jaipuri quilts, and gem markets'
    ],
    bestTimeToVisit: {
      best_overall_period: 'November to February (Mild, sunny winter days 15°C–27°C)',
      peak_season: 'December to January (Peak tourist season & Jaipur Literature Festival)',
      shoulder_season: 'October & March (Warm days, cool evenings)',
      off_season: 'May to June (Intense summer heat up to 44°C)',
      weather: 'Desert fringe climate: dry crisp winters, scorching summers.',
      crowds: 'Very high at Amber Fort in mornings during winter.',
      price_differences: 'Heritage palace hotels peak in December.',
      special_events: 'Jaipur Literature Festival (January/February), Gangaur Festival (March/April)'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements.',
      currency: 'Indian Rupee (INR, ₹). UPI and cards widely accepted.',
      customs: 'Cover shoulders and remove footwear at temples.',
      weather: 'Light woolens for winter evenings; sun protection year-round.',
      safety: 'Safe; bargain politely in Johari Bazaar and Bapu Bazaar.',
      transportation: 'Jaipur Metro connects central rail station to old city; Uber and auto-rickshaws are abundant. Jaipur International Airport (JAI) is 12 km from city center.',
      practicalTips: [
        'Visit Amber Fort early at 08:30 AM to beat the mid-day heat and large tour buses.',
        'Buy the Composite Ticket which covers Amber Fort, Hawa Mahal, Jantar Mantar, Nahargarh, and Albert Hall Museum.'
      ]
    },
    keyPlaces: [
      {
        name: 'Amber Fort (Amer Palace)',
        whyVisit: 'Majestic 16th-century hilltop fortress featuring Sheesh Mahal (Hall of Mirrors) and panoramic Aravalli mountain views.',
        bestTime: '08:30 AM morning arrival',
        timeNeeded: '3 hours',
        area: 'Amer',
        cost: 500,
        category: 'Culture'
      },
      {
        name: 'Hawa Mahal (Palace of Winds)',
        whyVisit: 'Iconic 1799 pink sandstone facade with 953 carved windows built for royal women to observe street processions.',
        bestTime: 'Morning when eastern sun illuminates the facade',
        timeNeeded: '1 hour',
        area: 'Badi Choupad',
        cost: 250,
        category: 'Sightseeing'
      },
      {
        name: 'Jantar Mantar Astronomical Observatory',
        whyVisit: 'UNESCO World Heritage site featuring 19 monumental stone instruments including the world’s largest sundial accurate to 2 seconds.',
        bestTime: '12:00 midday when sun is overhead for instrument shadow demonstration',
        timeNeeded: '1.5 hours',
        area: 'Old City',
        cost: 200,
        category: 'Culture'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1500,
      midDaily: 4000,
      luxuryDaily: 13000,
      notes: 'Per person/day. Great heritage hotel stays available at reasonable mid-tier rates.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Amber Fort (Amer Palace) & Sheesh Mahal Tour',
        category: 'Culture',
        cost: 500,
        time_slot: '09:30',
        desc: 'Ascend the rugged Aravalli hill to tour the sprawling Rajput citadel, royal Diwan-i-Khas, and the legendary glass-mosaic Hall of Mirrors.'
      },
      {
        day_number: 1,
        name: 'Panna Meena ka Kund Stepwell & Jal Mahal Water Palace',
        category: 'Sightseeing',
        cost: 150,
        time_slot: '13:30',
        desc: 'Photograph the mesmerizing crisscrossing staircases of the 16th-century stepwell, followed by lakeside photos of Jal Mahal on Man Sagar Lake.'
      },
      {
        day_number: 1,
        name: 'Chokhi Dhani Ethnic Rajasthani Village & Thali Feast',
        category: 'Food',
        cost: 1100,
        time_slot: '18:30',
        desc: 'Experience an evening of folk fire-eaters, camel rides, Kalbelia dancers, and authentic unlimited Dal Baati Churma served on leaf platters.'
      }
    ]
  },

  // 11. DELHI (India)
  delhi: {
    cityName: 'Delhi',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    overview: 'Delhi, India’s historic and political capital, is a vibrant fusion of eight historic cities spanning over a millennium. It features Mughal forts, ancient sultanate minarets, British colonial boulevards in Lutyens’ Delhi, and celebrated culinary street trails in Chandni Chowk.',
    whyVisit: [
      'UNESCO monuments: Qutub Minar, Humayun’s Tomb, and the Red Fort (Lal Qila)',
      'Chandni Chowk food lanes with centuries-old parathas, jalebis, and Mughlai kebabs',
      'Ceremonial architecture: India Gate, Kartavya Path, and Rashtrapati Bhavan',
      'Modern wonders: Swaminarayan Akshardham Temple and the Lotus Temple'
    ],
    bestTimeToVisit: {
      best_overall_period: 'October to March (Comfortable winter temperatures 12°C–25°C)',
      peak_season: 'November to February (Sightseeing weather, cultural fairs)',
      shoulder_season: 'October & March (Warm days, pleasant evenings)',
      off_season: 'May to June (Scorching 43°C heatwaves) & late December/early January (Dense fog)',
      weather: 'Subtropical semi-arid climate: cold winters, extremely hot summers, monsoon in July/August.',
      crowds: 'High in all central monuments; Metro provides seamless transit.',
      price_differences: 'Winter months command highest hotel occupancy.',
      special_events: 'Republic Day Parade (January 26), India Art Fair (February)'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements.',
      currency: 'Indian Rupee (INR, ₹). UPI and cards widely accepted.',
      customs: 'Cover head and remove shoes at Jama Masjid and Gurudwara Bangla Sahib.',
      weather: 'Warm coat in December/January; light airy cottons in summer.',
      safety: 'Stay alert in crowded markets; use the Delhi Metro or trusted ride-hailing apps (Uber/Ola).',
      transportation: 'Delhi Metro is one of the world’s best rapid transit systems. Indira Gandhi International Airport (DEL) connects via Airport Express Metro in 18 minutes.',
      practicalTips: [
        'Many Delhi monuments are closed on Mondays (e.g. Red Fort, Akshardham, Lotus Temple).',
        'Book monument tickets online via Archaeological Survey of India (ASI) portal to bypass ticket queues.'
      ]
    },
    keyPlaces: [
      {
        name: 'Qutub Minar & Iron Pillar',
        whyVisit: '73-meter victory tower built in 1192 and the famous 1,600-year-old rust-resistant iron pillar.',
        bestTime: '09:00 AM morning',
        timeNeeded: '2 hours',
        area: 'Mehrauli (South Delhi)',
        cost: 250,
        category: 'Culture'
      },
      {
        name: 'Humayun’s Tomb',
        whyVisit: 'UNESCO World Heritage red sandstone Mughal garden mausoleum that directly inspired the Taj Mahal.',
        bestTime: '15:30 to 17:00 golden light',
        timeNeeded: '2 hours',
        area: 'Nizamuddin East',
        cost: 250,
        category: 'Sightseeing'
      },
      {
        name: 'Red Fort & Chandni Chowk Food Trail',
        whyVisit: 'Mughal emperor Shah Jahan’s sandstone fortress and century-old street food stalls in Paranthe Wali Gali.',
        bestTime: '11:00 AM',
        timeNeeded: '3.5 hours',
        area: 'Old Delhi',
        cost: 300,
        category: 'Culture'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1500,
      midDaily: 4200,
      luxuryDaily: 14000,
      notes: 'Per person/day. Delhi Metro keeps transit very economical.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Qutub Minar & 1,600-Year-Old Rustless Iron Pillar',
        category: 'Culture',
        cost: 250,
        time_slot: '09:30',
        desc: 'Marvel at the 73-meter victory tower built in 1192 and the legendary Gupta-era iron pillar that has resisted corrosion for sixteen centuries.'
      },
      {
        day_number: 1,
        name: 'Humayun’s Tomb Red Sandstone Mughal Garden Mausoleum',
        category: 'Sightseeing',
        cost: 250,
        time_slot: '14:00',
        desc: 'Explore the grand UNESCO World Heritage Persian charbagh gardens and the twin-domed tomb that directly inspired the Taj Mahal.'
      },
      {
        day_number: 1,
        name: 'India Gate, Kartavya Path & Rashtrapati Bhavan Walk',
        category: 'Sightseeing',
        cost: 0,
        time_slot: '17:30',
        desc: 'Stroll along the central ceremonial boulevard from the 42m War Memorial arch to the illuminated facade of the President’s Estate.'
      }
    ]
  },

  // 12. VARANASI (India)
  varanasi: {
    cityName: 'Varanasi',
    country: 'India',
    currency: 'INR',
    coverPhoto: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    overview: 'Varanasi (Kashi / Banaras), situated on the crescent banks of the holy River Ganges in Uttar Pradesh, is one of the world’s oldest continuously inhabited cities. Famed as the spiritual heart of Hinduism, it is revered for its sacred bathing ghats, evening Ganga Aarti ceremonies, Banarasi silk handlooms, and nearby Sarnath Buddhist shrine.',
    whyVisit: [
      'Sunrise rowing boat ride on the holy Ganges along Dashashwamedh, Manikarnika, and Assi Ghats',
      'The transcendent evening Ganga Aarti ritual with brass lamps and Vedic chanting at Dashashwamedh Ghat',
      'Ancient Kashi Vishwanath Golden Temple dedicated to Lord Shiva',
      'Sarnath deer park where Gautama Buddha gave his first sermon in 528 BCE'
    ],
    bestTimeToVisit: {
      best_overall_period: 'October to March (Cool, pleasant weather for walking along river ghats)',
      peak_season: 'November to February & Dev Deepawali (Full moon of Kartik, million earthen lamps lit on ghats)',
      shoulder_season: 'October & March (Comfortable 20°C–32°C, lively cultural festivals)',
      off_season: 'May to June (Intense summer heat 43°C+) & July–September (High monsoon water levels submerge ghat walkways)',
      weather: 'Subtropical climate with distinct winter, severe hot summer, and monsoon river surges.',
      crowds: 'Very high on ghats during morning snan (holy dip) and evening aarti.',
      price_differences: 'Riverside heritage havelis book out months in advance for Dev Deepawali.',
      special_events: 'Dev Deepawali (November), Mahashivratri (February/March), Buddha Purnima (May)'
    },
    travelAdvice: {
      entryVisa: 'Standard Indian visa requirements apply.',
      currency: 'Indian Rupee (INR, ₹). UPI and cash needed in old city alleys.',
      customs: 'Strictly no photography at Manikarnika Ghat (cremation ghat). Remove shoes at all temples.',
      weather: 'Light woolens for winter boat rides; modest cotton clothing year-round.',
      safety: 'Be cautious of self-proclaimed guides and silk store touts in alleyways.',
      transportation: 'Old city alleyways (galis) are pedestrian-only. Cycle rickshaws and e-rickshaws connect to main roads. Lal Bahadur Shastri International Airport (VNS) is 24 km away.',
      practicalTips: [
        'Take the morning boat ride starting at 05:30 AM from Assi Ghat to watch the dawn light hit the river palaces.',
        'Taste Banarasi kachori-jalebi for breakfast at Ram Bhandar and a Blue Lassi near Manikarnika.'
      ]
    },
    keyPlaces: [
      {
        name: 'Dashashwamedh Ghat & Evening Ganga Aarti',
        whyVisit: 'The main ghat where seven priests perform the synchronized evening brass lamp worship ceremony to Mother Ganga.',
        bestTime: '18:15 evening (arrive 45 mins early for a good viewing spot or hire a wooden boat)',
        timeNeeded: '2 hours',
        area: 'Central Ghats',
        cost: 200,
        category: 'Culture'
      },
      {
        name: 'Kashi Vishwanath Golden Temple',
        whyVisit: 'One of the twelve sacred Jyotirlingas of Lord Shiva, crowned with an 800 kg gold-plated spire.',
        bestTime: '06:00 AM early morning darshan via the new Kashi Vishwanath Corridor',
        timeNeeded: '2 hours',
        area: 'Vishwanath Gali',
        cost: 0,
        category: 'Culture'
      },
      {
        name: 'Sarnath Buddhist Sacred Deer Park',
        whyVisit: 'Where Buddha preached his first sermon (Dharmachakra Pravartana) in 528 BCE; features Dhamek Stupa and Ashoka Lion Capital.',
        bestTime: '10:00 AM (10 km from Varanasi)',
        timeNeeded: '3 hours',
        area: 'Sarnath',
        cost: 250,
        category: 'Culture'
      }
    ],
    typicalBudget: {
      currency: 'INR',
      budgetDaily: 1200,
      midDaily: 3000,
      luxuryDaily: 9500,
      notes: 'Per person/day. Authentic riverside haveli stays provide unforgettable Ganges views.'
    },
    activities: [
      {
        day_number: 1,
        name: 'Sunrise Wooden Rowing Boat on the Holy Ganges',
        category: 'Sightseeing',
        cost: 450,
        time_slot: '05:30',
        desc: 'Glide past 84 historic stone ghats from Assi to Manikarnika as dawn sunbeams illuminate the river palaces.'
      },
      {
        day_number: 1,
        name: 'Kashi Vishwanath Golden Temple & Corridor Darshan',
        category: 'Culture',
        cost: 0,
        time_slot: '09:00',
        desc: 'Enter the sacred Jyotirlinga shrine of Lord Shiva via the grand marble corridor connecting river to temple.'
      },
      {
        day_number: 1,
        name: 'Dashashwamedh Ghat Grand Evening Ganga Aarti Ceremony',
        category: 'Culture',
        cost: 250,
        time_slot: '18:30',
        desc: 'Witness priests in silk robes chant Vedic hymns while raising multi-tiered flaming brass lamps to the holy river.'
      }
    ]
  }
};

/**
 * Retrieve verified destination profile by destination name
 */
export function getDestinationProfile(destinationName: string): DestinationProfile | null {
  if (!destinationName || typeof destinationName !== 'string') return null;
  const lower = destinationName.toLowerCase().replace(/[^a-z]/g, '');

  // Exact / substring match
  for (const [key, profile] of Object.entries(DESTINATION_PROFILES)) {
    const meta = profile.metadata || DEFAULT_CATALOG_METADATA;
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return { ...profile, metadata: meta, catalogMetadata: meta };
    }
    // Also match city name or country
    const cleanCity = profile.cityName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanCountry = profile.country.toLowerCase().replace(/[^a-z]/g, '');
    if (lower === cleanCity || lower.includes(cleanCity) || cleanCity.includes(lower)) {
      return { ...profile, metadata: meta, catalogMetadata: meta };
    }
    if (lower === cleanCountry) {
      return { ...profile, metadata: meta, catalogMetadata: meta };
    }
  }

  return null;
}
