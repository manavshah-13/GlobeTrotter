/**
 * Intent Classifier & Entity Extraction Service for GlobeTrotter AI
 * Lightweight, deterministic, high-precision NLP layer.
 */

export type TravelIntent =
  | 'DESTINATION_OVERVIEW'
  | 'TRAVEL_ADVICE'
  | 'DESTINATION_ACTIVITIES'
  | 'BEST_TIME_TO_VISIT'
  | 'COST_ESTIMATE'
  | 'TRANSPORTATION'
  | 'ITINERARY'
  | 'ACCOMMODATION'
  | 'FOOD'
  | 'WEATHER'
  | 'GENERAL_TRAVEL';

export interface ExtractedEntities {
  intent: TravelIntent;
  origin?: string;
  destination?: string;
  country?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
  isDateExplicit?: boolean;
  dateAssumptionNote?: string;
  travelers?: number;
  budget?: number;
  travelStyle?: string;
  preferences?: string[];
  confidence: number;
  rawQuery: string;
  needsClarification?: boolean;
  clarificationMessage?: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  intent?: TravelIntent;
  destination?: string;
  origin?: string;
}

// Known cities and countries dictionary for exact entity recognition
const KNOWN_PLACES: Record<string, { type: 'city' | 'country' | 'region'; country: string }> = {
  paris: { type: 'city', country: 'France' },
  france: { type: 'country', country: 'France' },
  bali: { type: 'region', country: 'Indonesia' },
  indonesia: { type: 'country', country: 'Indonesia' },
  tokyo: { type: 'city', country: 'Japan' },
  kyoto: { type: 'city', country: 'Japan' },
  osaka: { type: 'city', country: 'Japan' },
  japan: { type: 'country', country: 'Japan' },
  switzerland: { type: 'country', country: 'Switzerland' },
  swiss: { type: 'country', country: 'Switzerland' },
  zurich: { type: 'city', country: 'Switzerland' },
  geneva: { type: 'city', country: 'Switzerland' },
  lucerne: { type: 'city', country: 'Switzerland' },
  interlaken: { type: 'city', country: 'Switzerland' },
  zermatt: { type: 'city', country: 'Switzerland' },
  ahmedabad: { type: 'city', country: 'India' },
  mumbai: { type: 'city', country: 'India' },
  delhi: { type: 'city', country: 'India' },
  newdelhi: { type: 'city', country: 'India' },
  goa: { type: 'region', country: 'India' },
  jaipur: { type: 'city', country: 'India' },
  udaipur: { type: 'city', country: 'India' },
  varanasi: { type: 'city', country: 'India' },
  kashi: { type: 'city', country: 'India' },
  ujjain: { type: 'city', country: 'India' },
  kashmir: { type: 'region', country: 'India' },
  srinagar: { type: 'city', country: 'India' },
  bengaluru: { type: 'city', country: 'India' },
  bangalore: { type: 'city', country: 'India' },
  chennai: { type: 'city', country: 'India' },
  kolkata: { type: 'city', country: 'India' },
  hyderabad: { type: 'city', country: 'India' },
  pune: { type: 'city', country: 'India' },
  agra: { type: 'city', country: 'India' },
  india: { type: 'country', country: 'India' },
  london: { type: 'city', country: 'United Kingdom' },
  uk: { type: 'country', country: 'United Kingdom' },
  dubai: { type: 'city', country: 'United Arab Emirates' },
  singapore: { type: 'country', country: 'Singapore' },
  newyork: { type: 'city', country: 'United States' },
  usa: { type: 'country', country: 'United States' },
  rome: { type: 'city', country: 'Italy' },
  italy: { type: 'country', country: 'Italy' },
  spain: { type: 'country', country: 'Spain' },
  barcelona: { type: 'city', country: 'Spain' },
  thailand: { type: 'country', country: 'Thailand' },
  bangkok: { type: 'city', country: 'Thailand' },
  vietnam: { type: 'country', country: 'Vietnam' },
  maldives: { type: 'country', country: 'Maldives' },
  tbilisi: { type: 'city', country: 'Georgia' },
  georgia: { type: 'country', country: 'Georgia' },
  albania: { type: 'country', country: 'Albania' },
  tirana: { type: 'city', country: 'Albania' },
  patagonia: { type: 'region', country: 'Argentina & Chile' },
  argentina: { type: 'country', country: 'Argentina' },
  chile: { type: 'country', country: 'Chile' }
};

/**
 * Standardize capitalization for a city/country name
 */
function titleCase(str: string): string {
  if (!str) return '';
  return str
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * Deterministically resolve relative dates from user query without letting LLM guess.
 */
export function resolveRelativeDates(
  text: string,
  referenceDate: Date = new Date()
): { startDate?: string; targetMonth?: string; isDateExplicit: boolean; dateAssumptionNote?: string } {
  const lower = text.toLowerCase();
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth(); // 0-indexed

  // "tomorrow"
  if (/\btomorrow\b/i.test(lower)) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      startDate: `${yyyy}-${mm}-${dd}`,
      isDateExplicit: true,
      dateAssumptionNote: `Travel date resolved to tomorrow (${yyyy}-${mm}-${dd}).`
    };
  }

  // "day after tomorrow"
  if (/\bday\s+after\s+tomorrow\b/i.test(lower)) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + 2);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      startDate: `${yyyy}-${mm}-${dd}`,
      isDateExplicit: true,
      dateAssumptionNote: `Travel date resolved to day after tomorrow (${yyyy}-${mm}-${dd}).`
    };
  }

  // "next week"
  if (/\bnext\s+week\b/i.test(lower)) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + 7);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      startDate: `${yyyy}-${mm}-${dd}`,
      isDateExplicit: true,
      dateAssumptionNote: `Travel date resolved to next week starting ${yyyy}-${mm}-${dd}.`
    };
  }

  // Month extraction: "next December", "in December", "December trip", "winter", "summer"
  const monthMatch = lower.match(/\b(?:in|next|for|during)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
  if (monthMatch) {
    const monthStr = monthMatch[1].toLowerCase();
    const targetMonthIdx = MONTH_NAMES.indexOf(monthStr);
    if (targetMonthIdx !== -1) {
      // If month is upcoming this year, use this year; otherwise next year
      let targetYear = refYear;
      if (lower.includes('next ' + monthStr)) {
        targetYear = targetMonthIdx <= refMonth ? refYear + 1 : refYear;
      } else if (targetMonthIdx < refMonth) {
        targetYear = refYear + 1;
      }
      const mm = String(targetMonthIdx + 1).padStart(2, '0');
      const formattedMonth = titleCase(monthStr);
      return {
        startDate: `${targetYear}-${mm}-01`,
        targetMonth: `${formattedMonth} ${targetYear}`,
        isDateExplicit: true,
        dateAssumptionNote: `Pricing & availability calibrated for ${formattedMonth} ${targetYear}.`
      };
    }
  }

  // Seasons: "next winter", "next summer", "in winter"
  if (/\b(?:next\s+summer|summer)\b/i.test(lower)) {
    const targetYear = refMonth > 7 ? refYear + 1 : refYear;
    return {
      startDate: `${targetYear}-06-01`,
      targetMonth: `June ${targetYear}`,
      isDateExplicit: true,
      dateAssumptionNote: `Summer season travel assumption (${targetYear}). Peak seasonal demand applies.`
    };
  }
  if (/\b(?:next\s+winter|winter)\b/i.test(lower)) {
    const targetYear = refMonth > 1 ? refYear : refYear - 1;
    return {
      startDate: `${refYear}-12-01`,
      targetMonth: `December ${refYear}`,
      isDateExplicit: true,
      dateAssumptionNote: `Winter season travel assumption (${refYear}).`
    };
  }

  // Default: no date specified
  return {
    isDateExplicit: false,
    dateAssumptionNote: 'No travel dates specified. Estimates assume standard mid-season shoulder rates.'
  };
}

/**
 * Extract intent and entities from a user's natural query
 */
export function classifyTravelIntentAndEntities(
  rawQuery: string,
  conversationHistory: ConversationTurn[] = [],
  userContext?: { origin?: string; travel_style?: string; budget?: string }
): ExtractedEntities {
  const query = (rawQuery || '').trim();
  const lower = query.toLowerCase();

  // 1. Duration extraction: "5-day", "5 days", "a week", "3-day trip"
  let duration: number | undefined;
  const dayMatch = lower.match(/(\d+)\s*-?\s*days?/i);
  if (dayMatch) {
    duration = parseInt(dayMatch[1], 10);
  } else if (/\ba\s+week\b|\bone\s+week\b/i.test(lower)) {
    duration = 7;
  } else if (/\btwo\s+weeks\b|\b2\s+weeks\b/i.test(lower)) {
    duration = 14;
  } else if (/\bweekend\b/i.test(lower)) {
    duration = 3;
  }

  // 2. Traveler count extraction: "two people", "solo", "for 3 travelers", "for 4 of us"
  let travelers: number | undefined;
  const paxMatch = lower.match(/(\d+)\s*(?:people|person|travelers|passengers|adults|pax)/i);
  if (paxMatch) {
    travelers = parseInt(paxMatch[1], 10);
  } else if (/\btwo\s+people\b|\bfor\s+two\b|\bcouple\b/i.test(lower)) {
    travelers = 2;
  } else if (/\bfamily\b/i.test(lower)) {
    travelers = 4;
  } else if (/\bsolo\b/i.test(lower)) {
    travelers = 1;
  }

  // 3. Date extraction
  const dateInfo = resolveRelativeDates(query);

  // 4. Extract Origin & Destination with high-precision pattern matching
  let origin: string | undefined = userContext?.origin;
  let destination: string | undefined;

  // Pattern A: "How do I travel from Ahmedabad to Goa?" or "flights from Ahmedabad to Paris"
  const fromToMatch = lower.match(/(?:from\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)|([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)\s+flights?)(?:\s+(?:for|next|tomorrow|in|with|on|by|via|\d|\?|$)|$|\?)/i);
  if (fromToMatch) {
    if (fromToMatch[1] && fromToMatch[2]) {
      origin = cleanPlaceName(fromToMatch[1]);
      destination = cleanPlaceName(fromToMatch[2]);
    } else if (fromToMatch[3] && fromToMatch[4]) {
      origin = cleanPlaceName(fromToMatch[3]);
      destination = cleanPlaceName(fromToMatch[4]);
    }
  }

  // Pattern B: "How much would a 5-day trip to Tokyo cost from India?"
  if (!destination) {
    const toCostFromMatch = lower.match(/(?:trip\s+to|to)\s+([a-zA-Z\s]+?)\s+(?:cost|budget|expense|price|pricing)\s+from\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|in|\d|\?|$)|$|\?)/i);
    if (toCostFromMatch) {
      destination = cleanPlaceName(toCostFromMatch[1]);
      origin = cleanPlaceName(toCostFromMatch[2]);
    }
  }

  // Pattern C: "What about Mumbai?" / "How about Bali?"
  if (!destination) {
    const whatAboutMatch = lower.match(/\b(?:what\s+about|how\s+about)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|in|\?|$)|$|\?)/i);
    if (whatAboutMatch) {
      const candidate = cleanPlaceName(whatAboutMatch[1]);
      const nonPlaces = new Set(['train', 'trains', 'flight', 'flights', 'bus', 'buses', 'hotel', 'hotels', 'food', 'weather', 'cost', 'costs', 'pricing', 'itinerary', 'this', 'that', 'there', 'it']);
      if (candidate && !nonPlaces.has(candidate.toLowerCase())) {
        destination = candidate;
      }
    }
  }

  // Pattern D: Destination-first patterns:
  // "Tell me about Paris", "visiting Bali", "trip to Japan", "visit in Kyoto", "best time to visit Switzerland", "Paris travel guide"
  if (!destination) {
    const destPatterns = [
      /\b(?:tell\s+me\s+about|information\s+about|guide\s+(?:to|for)|overview\s+of|explore|exploring)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|in|during|\?|$)|$|\?)/i,
      /\b([a-zA-Z\s]+?)\s+travel\s+guide\b/i,
      /\b(?:before\s+visiting|before\s+traveling\s+to|before\s+going\s+to)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|in|\?|$)|$|\?)/i,
      /\b(?:things\s+to\s+know\s+about|tips\s+for)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|in|\?|$)|$|\?)/i,
      /\b(?:places\s+should\s+i\s+visit\s+in|places\s+to\s+visit\s+in|places\s+in|what\s+to\s+see\s+in|things\s+to\s+do\s+in|what\s+should\s+i\s+do\s+in|attractions\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|\?|$)|$|\?)/i,
      /\b(?:best\s+time\s+to\s+visit|when\s+should\s+i\s+visit|when\s+to\s+go\s+to|season\s+for)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|\?|$)|$|\?)/i,
      /\b(?:how\s+long\s+should\s+i\s+stay\s+in|how\s+many\s+days\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|\?|$)|$|\?)/i,
      /\b(?:is)\s+([a-zA-Z\s]+?)\s+(?:expensive|cheap|good\s+for|worth\s+visiting|safe\s+for)/i,
      /\b(?:can\s+i\s+go\s+to|travel\s+to)\s+([a-zA-Z\s]+?)\s+in\s+(?:winter|summer|spring|autumn|monsoon|\w+)/i,
      /\b(?:what\s+should\s+i\s+eat\s+in|what\s+to\s+eat\s+in|food\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|\?|$)|$|\?)/i,
      /\b(?:where\s+should\s+i\s+stay\s+in|where\s+to\s+stay\s+in|hotels\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|\?|$)|$|\?)/i,
      /\b([a-zA-Z\s]+?)\s+in\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|winter|summer|spring|autumn)\b/i,
      /\b(?:plan\s+a\s+\d+\s*-?\s*day\s+trip\s+to|itinerary\s+for|trip\s+to|vacation\s+in|holidays\s+in)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|from|\?|$)|$|\?)/i
    ];

    for (const pat of destPatterns) {
      const match = lower.match(pat);
      if (match && match[1]) {
        const candidate = cleanPlaceName(match[1]);
        if (candidate) {
          destination = candidate;
          break;
        }
      }
    }
  }

  // Pattern E: Dictionary scan if destination is still not identified
  if (!destination) {
    const words = lower.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
      if (KNOWN_PLACES[word]) {
        destination = titleCase(word);
        break;
      }
    }
  }

  // 5. Follow-up & Conversation History Inheritance!
  // If user asks a follow-up ("How much would it cost?", "What about trains?", "What is the best month?", "What should I see there?")
  if (!destination && conversationHistory.length > 0) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const turn = conversationHistory[i];
      if (turn.destination) {
        destination = turn.destination;
        break;
      }
      const turnLower = (turn.content || '').toLowerCase();
      for (const [placeKey] of Object.entries(KNOWN_PLACES)) {
        if (turnLower.includes(placeKey)) {
          destination = titleCase(placeKey);
          break;
        }
      }
      if (destination) break;
    }
  }

  // Also inherit previous origin, duration, travelers if not provided in current turn
  if (conversationHistory.length > 0) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const turn = conversationHistory[i];
      if (!origin && turn.origin) {
        origin = turn.origin;
      }
    }
  }

  // Default travelers to 1 if not extracted
  travelers = travelers || 1;

  // Look up country if destination is known
  let country: string | undefined;
  if (destination) {
    const cleanKey = destination.toLowerCase().replace(/[^a-z]/g, '');
    if (KNOWN_PLACES[cleanKey]) {
      country = KNOWN_PLACES[cleanKey].country;
    }
  }

  // 6. Intent Classification (Deterministic, Intent-Aware & Edge-Case Hardened)
  let intent: TravelIntent = 'GENERAL_TRAVEL';
  let confidence = 0.85;

  // FOOD: "what should I eat in Paris", "street food", "dishes"
  if (/\b(what\s+should\s+i\s+eat|what\s+to\s+eat|food|cuisine|dishes|eat\s+in|restaurants?|dining|specialties)\b/i.test(lower)) {
    intent = 'FOOD';
    confidence = 0.95;
  }
  // ACCOMMODATION: "where should I stay in Paris", "where to stay", "hotels in"
  else if (
    /\b(where\s+should\s+i\s+stay|where\s+to\s+stay|hotels?|resorts?|hostels?|villas?|accommodation)\b/i.test(lower) ||
    (/\bstay\s+in\b/i.test(lower) && !lower.includes('how long'))
  ) {
    intent = 'ACCOMMODATION';
    confidence = 0.95;
  }
  // TRANSPORTATION: "how do I travel", "how do I get there", "flight", "train", "trains", "cheapest way to get"
  else if (
    /\b(how\s+do\s+i\s+travel|how\s+do\s+i\s+get|how\s+can\s+i\s+get|how\s+to\s+get|how\s+to\s+travel|cheapest\s+way\s+to\s+get|transport|flight|flights|train|trains|bus|buses|fly\s+from|reach|what\s+about\s+trains)\b/i.test(lower) ||
    (lower.includes('from ') && lower.includes(' to ') && !lower.includes('cost') && !lower.includes('budget'))
  ) {
    intent = 'TRANSPORTATION';
    confidence = 0.95;
  }
  // BEST_TIME_TO_VISIT & WEATHER: "best time to visit", "what is the best month", "Paris in December", "can I go in winter", "season"
  else if (
    /\b(best\s+time|when\s+should\s+i|when\s+to\s+visit|best\s+month|which\s+month|season|ideal\s+time|weather|climate)\b/i.test(lower) ||
    /\b(?:in\s+december|in\s+winter|in\s+summer|in\s+spring|in\s+autumn|in\s+january|in\s+july)\b/i.test(lower) ||
    /\bcan\s+i\s+go\s+(?:to\s+[a-z]+\s+)?in\s+(?:winter|summer|december|monsoon)\b/i.test(lower)
  ) {
    intent = 'BEST_TIME_TO_VISIT';
    confidence = 0.95;
  }
  // COST_ESTIMATE: "how much", "cost", "budget", "price", "is Paris expensive", "expenses"
  else if (/\b(how\s+much|cost|budget|price|pricing|expenses|is\s+[a-z\s]+\s+expensive|expensive|cheapest|rupees|inr|usd)\b/i.test(lower)) {
    intent = 'COST_ESTIMATE';
    confidence = 0.95;
  }
  // DESTINATION_ACTIVITIES: "what should I see there?", "what places should i visit", "places in Paris", "attractions", "things to do"
  else if (
    /\b(what\s+should\s+i\s+see|what\s+to\s+see|places\s+to\s+visit|places\s+should\s+i\s+visit|places\s+in|what\s+should\s+i\s+do|things\s+to\s+do|attractions|monuments|sightseeing|must\s+visit)\b/i.test(lower)
  ) {
    intent = 'DESTINATION_ACTIVITIES';
    confidence = 0.95;
  }
  // TRAVEL_ADVICE: "things to know about", "what should i know before", "how long should I stay", "is it safe", "visa"
  else if (
    /\b(things\s+to\s+know|what\s+should\s+i\s+know|before\s+visiting|travel\s+tips|advice|safe|safety|visa|customs|etiquette|scam|scams|rules|precautions|how\s+long\s+should\s+i\s+stay|how\s+many\s+days)\b/i.test(lower)
  ) {
    intent = 'TRAVEL_ADVICE';
    confidence = 0.95;
  }
  // ITINERARY: Explicit plan requests: "plan a 5-day trip", "itinerary for", "day by day schedule"
  else if (/\b(plan\s+a\s+\d+|plan\s+a\s+trip|itinerary\s+for|day\s+by\s+day|day-by-day|create\s+an?\s+itinerary|generate\s+itinerary)\b/i.test(lower)) {
    intent = 'ITINERARY';
    confidence = 0.95;
  }
  // DESTINATION_OVERVIEW: "tell me about", "Paris?", "Paris travel guide", "overview of"
  else if (
    /\b(tell\s+me\s+about|overview\s+of|guide\s+for|travel\s+guide|what\s+is\s+[a-z]+\s+like|is\s+[a-z]+\s+good\s+for)\b/i.test(lower) ||
    (destination && query.replace(/[^a-zA-Z]/g, '').toLowerCase() === destination.toLowerCase()) ||
    (destination && query.split(/\s+/).length <= 2)
  ) {
    intent = 'DESTINATION_OVERVIEW';
    confidence = 0.90;
  }

  // 7. Check if Clarification is Needed (Ambiguous Query Handling)
  let needsClarification = false;
  let clarificationMessage: string | undefined;

  // If user asks a specific question ("How much does it cost?", "How do I get there?") but NO destination is known
  if (!destination && (intent === 'COST_ESTIMATE' || intent === 'TRANSPORTATION' || intent === 'DESTINATION_ACTIVITIES' || intent === 'BEST_TIME_TO_VISIT' || intent === 'TRAVEL_ADVICE')) {
    needsClarification = true;
    clarificationMessage = `Which destination are you asking about? Please specify the city or country you would like information on.`;
  }

  return {
    intent,
    origin: origin ? titleCase(origin) : undefined,
    destination: destination ? titleCase(destination) : undefined,
    country,
    duration,
    startDate: dateInfo.startDate,
    isDateExplicit: dateInfo.isDateExplicit,
    dateAssumptionNote: dateInfo.dateAssumptionNote,
    travelers,
    travelStyle: userContext?.travel_style || 'balanced',
    confidence,
    rawQuery: query,
    needsClarification,
    clarificationMessage
  };
}

/**
 * Clean and normalize extracted place name strings
 */
function cleanPlaceName(text: string): string {
  if (!text) return '';
  let cleaned = text
    .replace(/\b(the|a|an|trip|tour|cost|price|budget|flight|train|bus|travel|visit|visiting|places|things|about|know|guide)\b/gi, ' ')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim();

  // Pick first 1-3 significant words
  const words = cleaned.split(/\s+/).filter(w => w.length > 1);
  if (words.length > 0) {
    for (const w of words) {
      const lowerW = w.toLowerCase();
      if (KNOWN_PLACES[lowerW]) {
        return titleCase(lowerW);
      }
    }
    return titleCase(words.slice(0, 2).join(' '));
  }
  return '';
}

