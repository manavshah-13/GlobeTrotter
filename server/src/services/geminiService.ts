import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GeneratedTripPlan,
  ITINERARY_JSON_SCHEMA,
  ActivityRecommendationResponse,
  RECOMMENDATION_JSON_SCHEMA,
  BudgetEstimateResponse,
  BUDGET_ESTIMATE_JSON_SCHEMA,
  AdminInsightResponse,
  ADMIN_INSIGHT_JSON_SCHEMA
} from '../types/ai-schemas.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const PRIMARY_MODEL = 'gemini-3.6-flash';

export function formatLocationTitle(str: string): string {
  if (!str) return 'Travel Destination';
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map(w => {
      const lower = w.toLowerCase();
      if (['and', '&', 'of', 'the', 'in', 'on', 'to'].includes(lower)) {
        return lower === '&' ? '&' : lower;
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

export function extractDestinationName(rawPrompt: string): string {
  if (!rawPrompt || typeof rawPrompt !== 'string') return 'Travel Destination';

  // 1. Remove parenthesized travel style/metadata: e.g. "(Travel style: balanced)"
  let cleaned = rawPrompt.replace(/\s*\(\s*travel\s*style\s*:[^)]*\)/gi, '').trim();

  // If the prompt is already a concise destination (e.g. "Tokyo", "Paris", "Ujjain", "Tokyo, Kyoto", "Rome & Florence")
  const isPlainLocation = !/\b(day|days|trip|tour|vacation|itinerary|adventure|expedition|guide|explore|exploring|retreat|getaway|holiday|backpacking|budget|flight|hotel)\b/i.test(cleaned);
  if (isPlainLocation) {
    const formatted = cleaned.replace(/[^A-Za-z\s,\.\-&']/g, ' ').replace(/\s+/g, ' ').trim();
    if (formatted.length >= 2) {
      return formatLocationTitle(formatted);
    }
  }

  // 2. Remove any remaining parenthesized text (e.g. details)
  const textWithoutParens = cleaned.replace(/\s*\([^)]*\)/g, '').trim();

  // 3. Prepositional extraction patterns:
  // e.g. "in Tokyo and Kyoto with...", "across the Swiss Alps", "through Naples, Positano, and Capri", "exploration of Rome, Florence, and Venice", "trip to Paris", "backpacking Thailand"
  const prepPatterns = [
    /\b(?:in|into|to|across|through|exploring|around|visit|visiting|of|backpacking)\s+([A-Za-z\s,&'\-]+?)(?:\s+(?:with|for|on|focusing|featuring|during|and\s+its|style|budget)\b|[,\.\(\]]|$)/i,
    /\b(?:trip|tour|vacation|expedition|getaway|holiday|retreat)\s+(?:in|to|through|across|around|of)\s+([A-Za-z\s,&'\-]+?)(?:\s+(?:with|for|on|focusing|featuring|during)\b|[,\.\(\]]|$)/i
  ];

  for (const pattern of prepPatterns) {
    const match = (textWithoutParens || cleaned).match(pattern);
    if (match && match[1]) {
      let dest = match[1].trim();
      dest = dest.replace(/^the\s+/i, '').trim();
      dest = dest.replace(/\b(on|with|for|and|a|an|the)\b$/i, '').trim();
      if (dest.length >= 2) {
        return formatLocationTitle(dest);
      }
    }
  }

  // 4. Fallback: Strip known filler words using WORD BOUNDARIES (\b...\b) so letters inside names are NEVER stripped
  const text = (textWithoutParens || cleaned)
    .replace(/\b\d+\s*-?\s*days?\b/gi, ' ')
    .replace(/\b(travel|style|balanced|moderate|shoestring|budget|luxury|expedition|trip|planner|adventure|vacation|tour|culinary|food|culture|scenic|hiking|retreat|exploration|historical|coastal|road|getaway|backpacking|holiday|flight|hotel|tourist|visiting|visit|explore|exploring)\b/gi, ' ')
    .replace(/\b(in|into|to|for|on|a|an|the|with|across|through|of|and|its|or)\b/gi, ' ')
    .replace(/[^a-zA-Z\s\-&']/g, ' ')
    .trim();

  const words = text.split(/\s+/).filter(w => w.length > 1);
  if (words.length > 0) {
    return formatLocationTitle(words.slice(0, 4).join(' '));
  }

  return 'Travel Destination';
}

function cleanLocationName(rawPrompt: string): string {
  return extractDestinationName(rawPrompt);
}

async function callGeminiStructuredAI<T>(
  systemInstruction: string,
  userPrompt: string,
  responseSchema: any,
  modelName: string = PRIMARY_MODEL
): Promise<T> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 1600,
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    if (text) {
      return JSON.parse(text) as T;
    }
  } catch (sdkError) {
    console.warn(`[GeminiService] SDK call failed for ${modelName} (${(sdkError as Error).message}), attempting direct REST call...`);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 1600,
      responseMimeType: 'application/json',
      responseSchema: responseSchema
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini REST API');
  return JSON.parse(rawText) as T;
}

// =========================================================================
// 1. GENERATE ITINERARY
// =========================================================================
export async function generateItineraryWithAI(prompt: string, startDate?: string): Promise<GeneratedTripPlan> {
  const destination = cleanLocationName(prompt);

  const systemInstruction = `You are GlobeTrotter's Master AI Travel Planner.
Given a travel prompt:
- Destination: "${destination}"
- Parse the EXACT number of days requested in prompt (default to 4 if unspecified).
- Create a realistic itinerary where EVERY SINGLE DAY HAS COMPLETELY UNIQUE, NON-REPEATING ACTIVITIES.
- ALL COSTS MUST BE IN INDIAN RUPEES (INR, ₹). Use realistic Indian prices (e.g. ₹200 to ₹1,500 per activity).
- Day 1 MUST be different from Day 2, Day 3, Day 4, etc. Use REAL landmark names, real temple names, real street food markets, and real attraction spots in "${destination}".
- Each activity MUST have a distinct title, distinct description, category, cost in INR (₹), and scheduled time.
- Group activities cleanly by day_number (1, 2, 3, 4...).`;

  const userPrompt = `Destination: ${destination}. Full Prompt: "${prompt}". ${startDate ? `Start date: ${startDate}` : ''}`;

  try {
    return await callGeminiStructuredAI<GeneratedTripPlan>(systemInstruction, userPrompt, ITINERARY_JSON_SCHEMA);
  } catch (error) {
    console.error('[GeminiService] AI generation failed, using rich unique fallback generator:', (error as Error).message);
    return getFallbackItinerary(prompt);
  }
}

// =========================================================================
// 2. RECOMMEND ACTIVITIES
// =========================================================================
export async function recommendActivitiesWithAI(
  cityName: string,
  budgetLevel: string
): Promise<ActivityRecommendationResponse> {
  const cleanCity = cleanLocationName(cityName);
  const systemInstruction = `You are GlobeTrotter's Local Concierge AI.
Provide 3 UNIQUE activity recommendations for "${cleanCity}" tailored to budget level "${budgetLevel}".
- Include distinct activity name, category, cost in INDIAN RUPEES (INR, ₹ e.g. ₹300-₹1200), duration in minutes, and EXACTLY ONE short sentence reason.`;

  const userPrompt = `City: "${cleanCity}", Budget: "${budgetLevel}"`;

  try {
    return await callGeminiStructuredAI<ActivityRecommendationResponse>(systemInstruction, userPrompt, RECOMMENDATION_JSON_SCHEMA);
  } catch (error) {
    console.error('[GeminiService] AI recommendation failed, using fallback:', (error as Error).message);
    return getFallbackRecommendations(cleanCity, budgetLevel);
  }
}

// =========================================================================
// 3. ESTIMATE BUDGET
// =========================================================================
export async function estimateBudgetWithAI(
  destination: string,
  days: number,
  travelStyle: string
): Promise<BudgetEstimateResponse> {
  const cleanDest = cleanLocationName(destination);
  const systemInstruction = `You are GlobeTrotter's AI Travel Budget Estimator.
Provide realistic average daily costs and categorical breakdown (accommodation, food, activities, transport) in INDIAN RUPEES (INR, ₹).`;

  const userPrompt = `Destination: "${cleanDest}", Days: ${days}, Style: "${travelStyle}"`;

  try {
    return await callGeminiStructuredAI<BudgetEstimateResponse>(systemInstruction, userPrompt, BUDGET_ESTIMATE_JSON_SCHEMA);
  } catch (error) {
    console.error('[GeminiService] AI budget estimation failed, using fallback:', (error as Error).message);
    return getFallbackBudget(cleanDest, days, travelStyle);
  }
}

// =========================================================================
// 4. ADMIN INSIGHT
// =========================================================================
export async function generateAdminInsightWithAI(recentTripsSummary: any[]): Promise<AdminInsightResponse> {
  const systemInstruction = `You are GlobeTrotter's Analytics AI Engine.
Analyze the provided user trips summary and synthesize EXACTLY ONE punchy trend sentence in INR.`;

  const userPrompt = `Data: ${JSON.stringify(recentTripsSummary)}`;

  try {
    return await callGeminiStructuredAI<AdminInsightResponse>(systemInstruction, userPrompt, ADMIN_INSIGHT_JSON_SCHEMA);
  } catch (error) {
    return {
      insight: 'Most-requested destinations this week: Ujjain, Kashmir, and Jaipur with budget-friendly INR itineraries.'
    };
  }
}

// =========================================================================
// RICH UNIQUE FALLBACK GENERATOR IN INDIAN RUPEES (₹)
// =========================================================================
function getFallbackItinerary(prompt: string): GeneratedTripPlan {
  const lower = prompt.toLowerCase();
  const dayMatch = prompt.match(/(\d+)\s*-?\s*day[s]?/i);
  const requestedDays = dayMatch ? Math.max(1, parseInt(dayMatch[1], 10)) : 4;
  const mainLocation = cleanLocationName(prompt);

  const isUjjain = lower.includes('ujjain') || lower.includes('ujj') || lower.includes('mahakal');
  const isKashmir = lower.includes('kashmir') || lower.includes('srinagar') || lower.includes('gulmarg');

  let activities: any[] = [];

  if (isUjjain) {
    const ujjainPool = [
      // Day 1
      { day_number: 1, name: 'Mahakaleshwar Jyotirlinga Darshan & Sacred Bhasma Aarti', category: 'Culture', cost: 250, time_slot: '06:00', desc: 'Visit one of the 12 sacred Jyotirlingas of Lord Shiva for early morning prayers.' },
      { day_number: 1, name: 'Ram Ghat Shipra River Promenade & Holy Dip', category: 'Sightseeing', cost: 150, time_slot: '11:00', desc: 'Stroll along the historic bathing ghats of Shipra river where Simhastha Kumbh is celebrated.' },
      { day_number: 1, name: 'Harsiddhi Mata Temple & 101 Deep Stambha Illumination', category: 'Culture', cost: 100, time_slot: '18:30', desc: 'Witness the grand evening lighting of hundreds of oil lamps on twin stone pillars.' },
      // Day 2
      { day_number: 2, name: 'Kal Bhairav Temple & Sacred Traditional Offerings', category: 'Culture', cost: 150, time_slot: '09:30', desc: 'Visit the guardian deity temple of Ujjain renowned for ancient tantric rituals.' },
      { day_number: 2, name: 'Ved Shala (Jantar Mantar) Astronomical Observatory', category: 'Sightseeing', cost: 100, time_slot: '14:00', desc: 'Explore 18th-century masonry instruments built by Raja Jai Singh for planetary tracking.' },
      { day_number: 2, name: 'Tower Chowk & Gopal Mandir Street Food Trail', category: 'Food', cost: 400, time_slot: '19:00', desc: 'Sample authentic Malwi poha-jalebi, sabudana khichdi, and rabri in old Ujjain.' },
      // Day 3
      { day_number: 3, name: 'Sandipani Ashram Ancient Hermitage Exploration', category: 'Culture', cost: 100, time_slot: '09:30', desc: 'Visit the legendary ashram where Lord Krishna and Sudama received their education.' },
      { day_number: 3, name: 'Chintaman Ganesh Temple & Vikramaditya Memorial', category: 'Sightseeing', cost: 150, time_slot: '14:00', desc: 'Explore the ancient swayambhu Ganesh shrine and King Vikramaditya history park.' },
      { day_number: 3, name: 'Freeganj Bazaar Shopping & Malwi Thali Dinner', category: 'Food', cost: 600, time_slot: '18:30', desc: 'Browse handcrafted brassware, Maheshwari sarees, and enjoy traditional local dinners.' },
      // Day 4
      { day_number: 4, name: 'Mangalnath Temple & Shipra Sunset Boat Ride', category: 'Sightseeing', cost: 250, time_slot: '09:30', desc: 'Visit the birth site of Mars according to Indian astronomy, followed by a serene boat ride.' },
      { day_number: 4, name: 'Bhartrihari Caves & Kaliadeh Water Palace Excursion', category: 'Adventure', cost: 300, time_slot: '14:00', desc: 'Explore riverside caves where saint Bhartrihari meditated and historic water palaces.' }
    ];

    activities = ujjainPool.filter(a => a.day_number <= requestedDays);
  } else if (isKashmir) {
    const kashmirPool = [
      { day_number: 1, name: 'Shikara Boat Ride on Dal Lake & Floating Market', category: 'Sightseeing', cost: 800, time_slot: '09:30', desc: 'Glide across pristine waters of Dal Lake in a traditional wooden shikara boat.' },
      { day_number: 1, name: 'Mughal Gardens (Shalimar & Nishat Bagh) Exploration', category: 'Culture', cost: 200, time_slot: '14:00', desc: 'Stroll through terraced lawns, cascading fountains, and historic Persian gardens.' },
      { day_number: 2, name: 'Gulmarg Gondola Cable Car Ride to Apharwat Peak', category: 'Adventure', cost: 1800, time_slot: '10:00', desc: 'Ride one of the highest cable cars in the world for spectacular Himalayan snow views.' },
      { day_number: 2, name: 'Traditional Kashmiri Wazwan Culinary Feast', category: 'Food', cost: 1200, time_slot: '18:30', desc: 'Enjoy authentic Kashmiri rogan josh, gushtaba, and saffron kahwa tea.' },
      { day_number: 3, name: 'Pahalgam Aru & Betaab Valley Scenic Nature Walk', category: 'Sightseeing', cost: 600, time_slot: '09:30', desc: 'Explore lush pine forests and crystalline Lidder River in Pahalgam.' },
      { day_number: 3, name: 'Lal Chowk Handicraft & Pure Saffron Market Shopping', category: 'Culture', cost: 1500, time_slot: '15:00', desc: 'Shop for authentic Pashmina shawls, walnut woodcraft, and Kashmiri saffron.' },
      { day_number: 4, name: 'Sonamarg Thajiwas Glacier Pony Trek', category: 'Adventure', cost: 1500, time_slot: '09:30', desc: 'Trek along snow-capped meadow peaks and alpine streams in Sonamarg.' }
    ];
    activities = kashmirPool.filter(a => a.day_number <= requestedDays);
  } else {
    // Universal Rich Fallback Generator: Unique INR Activities for EVERY Day
    const dayTemplates = [
      // Day 1
      [
        { name: `${mainLocation} Historic Heritage & Landmark Walking Tour`, category: 'Culture', cost: 350, time_slot: '09:30', desc: `Explore historic architecture, iconic city plazas, and ancient heritage sites in ${mainLocation}.` },
        { name: `${mainLocation} Traditional Food Market & Local Tasting`, category: 'Food', cost: 500, time_slot: '13:00', desc: `Sample regional culinary specialties, street food, and artisanal beverages in ${mainLocation}.` },
        { name: `${mainLocation} Sunset Riverbank & Cultural Evening Promenade`, category: 'Sightseeing', cost: 250, time_slot: '18:00', desc: `Enjoy scenic golden-hour views and lively evening cultural walks across ${mainLocation}.` }
      ],
      // Day 2
      [
        { name: `${mainLocation} Sacred Temples & Sanctuary Trail`, category: 'Culture', cost: 400, time_slot: '09:00', desc: `Visit famous spiritual shrines, carved stone temples, and peaceful gardens in ${mainLocation}.` },
        { name: `${mainLocation} Panoramic Hilltop Viewpoint & Nature Hike`, category: 'Adventure', cost: 600, time_slot: '14:00', desc: `Hike to high elevation viewpoints offering panoramic city and valley vistas.` },
        { name: `${mainLocation} Night Bazaar & Traditional Performance Evening`, category: 'Nightlife', cost: 800, time_slot: '19:30', desc: `Experience vibrant evening bazaars, live traditional music, and light shows in ${mainLocation}.` }
      ],
      // Day 3
      [
        { name: `${mainLocation} Science Observatory & Art Heritage Museum`, category: 'Sightseeing', cost: 300, time_slot: '10:00', desc: `Discover historic astronomical instruments, art galleries, and regional artifacts in ${mainLocation}.` },
        { name: `${mainLocation} Artisan Craft & Handloom Souvenir Trail`, category: 'Culture', cost: 700, time_slot: '14:30', desc: `Learn local handicraft traditions and browse handmade silk, woodwork, and jewelry.` },
        { name: `${mainLocation} Gourmet Fine Dining & Starlight Dinner`, category: 'Food', cost: 1200, time_slot: '20:00', desc: `Gourmet dinner featuring authentic multi-course regional recipes.` }
      ],
      // Day 4
      [
        { name: `${mainLocation} Botanical Gardens & Serene Nature Reserve Walk`, category: 'Relaxation', cost: 250, time_slot: '09:30', desc: `Stroll through lush terraced gardens, lotus ponds, and ancient tree groves.` },
        { name: `${mainLocation} Interactive Pottery & Local Workshop Experience`, category: 'Culture', cost: 600, time_slot: '14:00', desc: `Hands-on workshop with traditional master artisans in ${mainLocation}.` },
        { name: `${mainLocation} Illuminated City Night Tour & Fountain Promenade`, category: 'Sightseeing', cost: 400, time_slot: '19:00', desc: `Marvel at lit-up monuments and nighttime architectural illumination.` }
      ]
    ];

    for (let d = 1; d <= requestedDays; d++) {
      const templateGroup = dayTemplates[(d - 1) % dayTemplates.length];
      for (const t of templateGroup) {
        activities.push({
          day_number: d,
          name: t.name,
          category: t.category,
          cost: t.cost,
          time_slot: t.time_slot,
          description: t.desc,
          image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
        });
      }
    }
  }

  const formattedActivities = activities.map((a) => ({
    name: a.name,
    category: a.category,
    cost: a.cost,
    duration_min: 120,
    description: a.desc || a.description || '',
    image_url: a.img || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    day_number: a.day_number,
    time_slot: a.time_slot
  }));

  const cityList = mainLocation
    .split(/(?:\s+and\s+|,\s*(?:and\s+)?)/i)
    .map(c => c.trim())
    .filter(c => c.length > 1);

  const distinctCities = cityList.length > 0 ? cityList : [mainLocation];
  const daysPerCity = Math.max(1, Math.floor(requestedDays / distinctCities.length));

  const stops = isUjjain
    ? [
        {
          city_name: 'Ujjain',
          country: 'India',
          cost_index: 2,
          popularity: 95,
          city_image_url: 'https://images.unsplash.com/photo-1609946727292-c94318c5e638',
          duration_days: requestedDays,
          day_start: 1,
          day_end: requestedDays,
          activities: formattedActivities
        }
      ]
    : isKashmir
    ? [
        {
          city_name: 'Srinagar & Gulmarg',
          country: 'India',
          cost_index: 3,
          popularity: 98,
          city_image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d',
          duration_days: requestedDays,
          day_start: 1,
          day_end: requestedDays,
          activities: formattedActivities
        }
      ]
    : distinctCities.map((cityName, idx) => {
        const isLast = idx === distinctCities.length - 1;
        const dayStart = idx * daysPerCity + 1;
        const dayEnd = isLast ? requestedDays : (idx + 1) * daysPerCity;
        const stopActivities = formattedActivities.filter(a => a.day_number >= dayStart && a.day_number <= dayEnd);

        return {
          city_name: cityName,
          country: 'Travel Destination',
          cost_index: 3,
          popularity: 90,
          city_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          duration_days: Math.max(1, dayEnd - dayStart + 1),
          day_start: dayStart,
          day_end: dayEnd,
          activities: stopActivities.length > 0 ? stopActivities : formattedActivities
        };
      });

  return {
    name: `${requestedDays}-Day ${mainLocation} Expedition`,
    description: `A rich ${requestedDays}-day travel itinerary exploring iconic landmarks, local food, and cultural highlights in ${mainLocation}.`,
    cover_photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    stops
  };
}

function getFallbackRecommendations(cityName: string, budgetLevel: string): ActivityRecommendationResponse {
  const isBudget = budgetLevel.toLowerCase().includes('shoestring') || budgetLevel.toLowerCase().includes('budget');
  return {
    recommendations: [
      {
        name: `${cityName} Historic District Self-Guided Heritage Walk`,
        category: 'Culture',
        cost: isBudget ? 0 : 250,
        duration_min: 120,
        reason: `Explore ${cityName}'s iconic monuments and historical sites on a ${budgetLevel} budget.`
      },
      {
        name: `${cityName} Street Food & Bazaars Culinary Tour`,
        category: 'Food',
        cost: isBudget ? 200 : 600,
        duration_min: 90,
        reason: `Sample authentic regional delicacies and local dishes.`
      },
      {
        name: `${cityName} Panoramic Sunset Viewpoint & Riverfront Walk`,
        category: 'Sightseeing',
        cost: 0,
        duration_min: 60,
        reason: `Offers breathtaking photography spots and scenic sunset views.`
      }
    ]
  };
}

function getFallbackBudget(destination: string, days: number, travelStyle: string): BudgetEstimateResponse {
  const isLuxury = travelStyle.toLowerCase().includes('luxury');
  const isBackpack = travelStyle.toLowerCase().includes('shoestring') || travelStyle.toLowerCase().includes('backpack');

  let dailyAvg = 4500;
  let breakdown = { accommodation: 2500, food: 1000, activities: 600, transport: 400 };

  if (isLuxury) {
    dailyAvg = 15000;
    breakdown = { accommodation: 9000, food: 3500, activities: 1500, transport: 1000 };
  } else if (isBackpack) {
    dailyAvg = 1800;
    breakdown = { accommodation: 900, food: 500, activities: 250, transport: 150 };
  }

  return {
    daily_average: dailyAvg,
    breakdown,
    currency: 'INR'
  };
}
