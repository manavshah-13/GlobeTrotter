/**
 * AI Travel Assistant Service for GlobeTrotter
 * Intent-Aware, Grounded in Destination Catalog & Specialized Domain Services
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import {
  classifyTravelIntentAndEntities,
  ExtractedEntities,
  ConversationTurn,
  TravelIntent
} from './intentClassifier.js';
import {
  getDestinationProfile,
  DestinationProfile
} from './destinationCatalog.js';
import {
  getTravelTimingWithAI,
  getComprehensiveBudget,
  searchTransportationService
} from './travelService.js';
import { generateItineraryWithAI } from './geminiService.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

export interface AskAssistantRequest {
  question: string;
  conversation_history?: ConversationTurn[];
  user_id?: string;
  context?: {
    origin?: string;
    travel_style?: string;
    budget?: string;
  };
}

export interface AskAssistantResponse {
  success: boolean;
  intent: TravelIntent;
  destination?: string;
  origin?: string;
  entities: ExtractedEntities;
  answer: string;
  data?: any;
  structured_data?: any;
  service_used: string;
  grounding_source: string;
  is_estimate: boolean;
  is_live: boolean;
  data_source: string;
  data_timestamp: string;
  confidence: 'high' | 'moderate' | 'estimated';
  display_badge: string;
  debug: {
    query: string;
    intent: TravelIntent;
    entities: ExtractedEntities;
    destination?: string;
    origin?: string;
    retrievedContextSummary: string;
    serviceUsed: string;
    modelInvoked: boolean;
  };
}

/**
 * Main General Travel Assistant Entry Point
 */
export async function handleAIAssistantQuestion(
  params: AskAssistantRequest
): Promise<AskAssistantResponse> {
  const { question, conversation_history = [], user_id, context } = params;

  // 1. Natural Language Intent & Entity Extraction
  const entities = classifyTravelIntentAndEntities(question, conversation_history, context);
  const { intent, destination, origin, duration, travelers, travelStyle, needsClarification, clarificationMessage } = entities;

  console.log(`\n======================================================`);
  console.log(`[AI Pipeline] USER QUERY: "${question}"`);
  console.log(`[AI Pipeline] INTENT: ${intent}`);
  console.log(`[AI Pipeline] EXTRACTED ENTITIES:`, { destination, origin, duration, travelers, travelStyle, startDate: entities.startDate });

  // If destination could not be identified and clarification is needed
  if (needsClarification && clarificationMessage) {
    console.log(`[AI Pipeline] CLARIFICATION NEEDED`);
    return {
      success: true,
      intent,
      destination: undefined,
      origin: undefined,
      entities,
      answer: clarificationMessage,
      data: null,
      structured_data: null,
      service_used: 'intent-classifier-clarification',
      grounding_source: 'Entity Validation & Clarification Engine',
      is_estimate: false,
      is_live: false,
      data_source: 'Clarification Engine',
      data_timestamp: new Date().toISOString(),
      confidence: 'high',
      display_badge: 'Clarification Needed',
      debug: {
        query: question,
        intent,
        entities,
        destination: undefined,
        origin: undefined,
        retrievedContextSummary: 'Needs clarification on destination',
        serviceUsed: 'intent-classifier-clarification',
        modelInvoked: false
      }
    };
  }

  // 2. Retrieve Destination-Specific Grounding Context
  const targetDest = destination || 'Paris';
  const profile = getDestinationProfile(targetDest);

  const contextSummary = profile
    ? `Destination catalog match: ${profile.cityName}, ${profile.country} (${profile.keyPlaces?.length || 0} landmarks, ${profile.activities?.length || 0} activities)`
    : `No exact catalog profile found for "${targetDest}"; using general knowledge engine`;

  console.log(`[AI Pipeline] DESTINATION: ${targetDest} (${profile ? profile.country : 'Unknown Country / Outside Curated Catalog'})`);
  console.log(`[AI Pipeline] RETRIEVED CONTEXT: ${contextSummary}`);

  // 3. Dispatch to Specialized Handlers Based on Intent
  switch (intent) {
    case 'COST_ESTIMATE':
      return await handleCostEstimateIntent(question, entities, profile, context);

    case 'BEST_TIME_TO_VISIT':
      return await handleTimingIntent(question, entities, profile);

    case 'TRANSPORTATION':
      return await handleTransportationIntent(question, entities, profile);

    case 'DESTINATION_ACTIVITIES':
      return await handleActivitiesIntent(question, entities, profile);

    case 'TRAVEL_ADVICE':
      return await handleTravelAdviceIntent(question, entities, profile);

    case 'DESTINATION_OVERVIEW':
      return await handleOverviewIntent(question, entities, profile);

    case 'FOOD':
      return await handleFoodIntent(question, entities, profile);

    case 'ACCOMMODATION':
      return await handleAccommodationIntent(question, entities, profile);

    case 'ITINERARY':
      return await handleItineraryIntent(question, entities, profile, user_id);

    default:
      return await handleGeneralTravelIntent(question, entities, profile);
  }
}

// =========================================================================
// INTENT HANDLER 1: COST ESTIMATE
// =========================================================================
async function handleCostEstimateIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null,
  context?: AskAssistantRequest['context']
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Tokyo');
  const origin = entities.origin || context?.origin || 'India';
  const days = entities.duration || 5;
  const travelers = entities.travelers || 1;
  const style = entities.travelStyle || context?.travel_style || 'balanced';

  console.log(`[AI Pipeline] SERVICE USED: comprehensive-budget service`);

  // Call the deterministic budget calculator
  const budgetData = await getComprehensiveBudget({
    origin,
    destination,
    days,
    travelers,
    travel_style: style
  });

  const currency = budgetData.currency;
  const hasINRConversion = budgetData.converted_currency === 'INR';
  const rate = 84.0;

  let answerText = `### Cost Estimate: ${days}-Day Trip to ${destination} from ${origin}\n\n`;

  // Explicit Date Handling
  if (entities.startDate) {
    answerText += `**Travel Date / Period:** ${entities.startDate} ${entities.dateAssumptionNote ? `(${entities.dateAssumptionNote})` : ''}\n\n`;
  } else {
    answerText += `**Travel Date / Period:** *Unspecified* — *Estimates assume standard shoulder-season travel rates. Peak seasons (e.g. cherry blossom or holiday weeks) may increase airline and hotel tariffs by 30% to 50%.*\n\n`;
  }

  answerText += `Here is a comprehensive, itemized budget breakdown for **${travelers} traveler${travelers > 1 ? 's' : ''}** with a **${style}** travel tier:\n\n`;

  const transitBd = budgetData.breakdown.flights_transit;
  const accomBd = budgetData.breakdown.accommodation;
  const foodBd = budgetData.breakdown.food_dining;
  const localBd = budgetData.breakdown.local_transport;
  const actBd = budgetData.breakdown.activities_tours;

  if (hasINRConversion) {
    answerText += `| Category | Estimated Range (INR & USD) | Recommended Benchmark | Notes |\n`;
    answerText += `| :--- | :--- | :--- | :--- |\n`;
    answerText += `| **Transportation (Flights/Rail)** | ₹${(transitBd.min_cost * rate).toLocaleString()} – ₹${(transitBd.max_cost * rate).toLocaleString()} ($${transitBd.min_cost}–$${transitBd.max_cost}) | **₹${(transitBd.avg_cost * rate).toLocaleString()}** ($${transitBd.avg_cost}) | Round-trip transit from ${origin} |\n`;
    answerText += `| **Accommodation** | ₹${(accomBd.min_cost * rate).toLocaleString()} – ₹${(accomBd.max_cost * rate).toLocaleString()} ($${accomBd.min_cost}–$${accomBd.max_cost}) | **₹${(accomBd.avg_cost * rate).toLocaleString()}** ($${accomBd.avg_cost}) | ${days} nights (${travelers > 1 ? 'shared room/villa' : 'single room'}) |\n`;
    answerText += `| **Food & Dining** | ₹${(foodBd.min_cost * rate).toLocaleString()} – ₹${(foodBd.max_cost * rate).toLocaleString()} ($${foodBd.min_cost}–$${foodBd.max_cost}) | **₹${(foodBd.avg_cost * rate).toLocaleString()}** ($${foodBd.avg_cost}) | Daily meals, local specialties, & drinks |\n`;
    answerText += `| **Local City Transport** | ₹${(localBd.min_cost * rate).toLocaleString()} – ₹${(localBd.max_cost * rate).toLocaleString()} ($${localBd.min_cost}–$${localBd.max_cost}) | **₹${(localBd.avg_cost * rate).toLocaleString()}** ($${localBd.avg_cost}) | Metro, buses, and cabs |\n`;
    answerText += `| **Activities & Sightseeing** | ₹${(actBd.min_cost * rate).toLocaleString()} – ₹${(actBd.max_cost * rate).toLocaleString()} ($${actBd.min_cost}–$${actBd.max_cost}) | **₹${(actBd.avg_cost * rate).toLocaleString()}** ($${actBd.avg_cost}) | Monument entries, tours, and passes |\n\n`;

    answerText += `#### **Estimated Total Cost**\n`;
    answerText += `- **Budget Range:** ₹${budgetData.converted_total_min?.toLocaleString()} – ₹${budgetData.converted_total_max?.toLocaleString()} INR (≈ $${budgetData.total_min.toLocaleString()} – $${budgetData.total_max.toLocaleString()} USD)\n`;
    answerText += `- **Recommended Budget Average:** **₹${budgetData.converted_total_avg?.toLocaleString()} INR (≈ $${budgetData.total_avg.toLocaleString()} USD)**\n\n`;
    answerText += `*Exchange Conversion Benchmark:* 1 USD ≈ ₹84.0 INR (planning conversion estimate).\n\n`;
  } else {
    const symbol = currency === 'INR' ? '₹' : '$';
    answerText += `| Category | Estimated Range | Recommended Benchmark | Notes |\n`;
    answerText += `| :--- | :--- | :--- | :--- |\n`;
    answerText += `| **Transportation (Flights/Rail)** | ${symbol}${transitBd.min_cost.toLocaleString()} – ${symbol}${transitBd.max_cost.toLocaleString()} | **${symbol}${transitBd.avg_cost.toLocaleString()}** | Round-trip transit from ${origin} |\n`;
    answerText += `| **Accommodation** | ${symbol}${accomBd.min_cost.toLocaleString()} – ${symbol}${accomBd.max_cost.toLocaleString()} | **${symbol}${accomBd.avg_cost.toLocaleString()}** | ${days} nights (${travelers > 1 ? 'shared room/villa' : 'single room'}) |\n`;
    answerText += `| **Food & Dining** | ${symbol}${foodBd.min_cost.toLocaleString()} – ${symbol}${foodBd.max_cost.toLocaleString()} | **${symbol}${foodBd.avg_cost.toLocaleString()}** | Daily meals, local specialties, & drinks |\n`;
    answerText += `| **Local City Transport** | ${symbol}${localBd.min_cost.toLocaleString()} – ${symbol}${localBd.max_cost.toLocaleString()} | **${symbol}${localBd.avg_cost.toLocaleString()}** | Metro, buses, and cabs |\n`;
    answerText += `| **Activities & Sightseeing** | ${symbol}${actBd.min_cost.toLocaleString()} – ${symbol}${actBd.max_cost.toLocaleString()} | **${symbol}${actBd.avg_cost.toLocaleString()}** | Monument entries, tours, and passes |\n\n`;

    answerText += `#### **Estimated Total Cost**\n`;
    answerText += `- **Budget Range:** ${symbol}${budgetData.total_min.toLocaleString()} – ${symbol}${budgetData.total_max.toLocaleString()} ${currency}\n`;
    answerText += `- **Recommended Budget Average:** **${symbol}${budgetData.total_avg.toLocaleString()} ${currency}**\n\n`;
  }

  answerText += `#### **Key Assumptions & Clarifications**\n`;
  budgetData.assumptions.forEach(a => {
    answerText += `- ${a}\n`;
  });
  answerText += `- *Planning Benchmark:* Calculations are performed deterministically by GlobeTrotter's travel pricing engine based on average seasonal tariffs.\n`;

  return {
    success: true,
    intent: 'COST_ESTIMATE',
    destination,
    origin,
    entities,
    answer: answerText,
    data: budgetData,
    structured_data: budgetData,
    service_used: 'comprehensive-budget',
    grounding_source: 'Deterministic Budget Engine & Historical Fare Benchmarks',
    is_estimate: true,
    is_live: false,
    data_source: 'Comprehensive Travel Budget Engine',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'Itemized Budget Benchmark',
    debug: {
      query,
      intent: 'COST_ESTIMATE',
      entities,
      destination,
      origin,
      retrievedContextSummary: `Calculated itemized budget for ${days} days in ${destination} from ${origin}`,
      serviceUsed: 'comprehensive-budget',
      modelInvoked: false
    }
  };
}

// =========================================================================
// INTENT HANDLER 2: BEST TIME TO VISIT / TIMING
// =========================================================================
async function handleTimingIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Switzerland');
  console.log(`[AI Pipeline] SERVICE USED: travel-timing service`);

  let timingData: any;
  if (profile?.bestTimeToVisit) {
    const b = profile.bestTimeToVisit;
    timingData = {
      destination: profile.cityName,
      best_overall_period: b.best_overall_period,
      peak_season: b.peak_season,
      shoulder_season: b.shoulder_season,
      off_season: b.off_season,
      weather: b.weather,
      crowds: b.crowds,
      price_differences: b.price_differences,
      special_events: b.special_events
    };
  } else {
    timingData = await getTravelTimingWithAI(destination);
  }

  let answerText = `### Best Time to Visit ${destination}\n\n`;
  answerText += `**Optimal Travel Window:** ${timingData.best_overall_period}\n\n`;

  answerText += `#### 1. Seasonal Breakdown\n`;
  answerText += `- **Peak Season:** ${timingData.peak_season || (timingData.seasons?.peak?.months ? `${timingData.seasons.peak.months} (${timingData.seasons.peak.weather})` : 'Summer & Major Holidays')}\n`;
  answerText += `- **Shoulder Season:** ${timingData.shoulder_season || (timingData.seasons?.shoulder?.months ? `${timingData.seasons.shoulder.months} (${timingData.seasons.shoulder.weather})` : 'Spring & Autumn')}\n`;
  answerText += `- **Off-Season:** ${timingData.off_season || (timingData.seasons?.off?.months ? `${timingData.seasons.off.months} (${timingData.seasons.off.weather})` : 'Winter')}\n\n`;

  answerText += `#### 2. Climate & Weather Conditions\n`;
  answerText += `${timingData.weather || timingData.seasons?.peak?.weather || 'Temperate conditions with distinct seasonal variations.'}\n\n`;

  answerText += `#### 3. Tourist Crowds & Pricing Dynamics\n`;
  answerText += `- **Crowds:** ${timingData.crowds || 'High during summer festivals and holiday breaks; tranquil in shoulder months.'}\n`;
  answerText += `- **Price Differences:** ${timingData.price_differences || 'Accommodations average 25-40% lower during shoulder and off-peak months.'}\n\n`;

  if (timingData.special_events) {
    answerText += `#### 4. Highlights & Notable Events\n`;
    answerText += `${timingData.special_events}\n`;
  }

  return {
    success: true,
    intent: 'BEST_TIME_TO_VISIT',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: timingData,
    structured_data: timingData,
    service_used: 'travel-timing',
    grounding_source: profile ? 'Verified Destination Catalog' : 'Climate & Seasonal Benchmarks',
    is_estimate: false,
    is_live: false,
    data_source: profile ? 'Curated Destination Catalog' : 'Climatological Model',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'Climate & Seasonal Intelligence',
    debug: {
      query,
      intent: 'BEST_TIME_TO_VISIT',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Seasonal climate intelligence retrieved for ${destination}`,
      serviceUsed: 'travel-timing',
      modelInvoked: !profile?.bestTimeToVisit
    }
  };
}

// =========================================================================
// INTENT HANDLER 3: TRANSPORTATION SEARCH
// =========================================================================
async function handleTransportationIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const origin = entities.origin || 'Ahmedabad';
  const destination = entities.destination || (profile ? profile.cityName : 'Goa');

  console.log(`[AI Pipeline] SERVICE USED: transport-search service`);

  // Call transportation service with extracted date
  const transitResults = searchTransportationService({
    origin,
    destination,
    date: entities.startDate,
    passengers: entities.travelers || 1
  });

  const currencySymbol = transitResults.currency === 'INR' ? '₹' : '$';

  let answerText = `### Transportation Options: ${origin} to ${destination}\n\n`;

  if (entities.startDate) {
    answerText += `**Travel Date:** ${entities.startDate} ${entities.dateAssumptionNote ? `(${entities.dateAssumptionNote})` : ''}\n\n`;
  } else {
    answerText += `**Travel Date:** *Unspecified (standard route schedule benchmarks)*\n\n`;
  }

  answerText += `Here are the scheduled transportation routes connecting **${origin}** and **${destination}**:\n\n`;

  // Flights
  if (transitResults.flights.length > 0) {
    answerText += `#### ✈️ Flight Options (Fastest)\n`;
    transitResults.flights.forEach(f => {
      answerText += `- **${f.carrier} (${f.flight_number})**: Departs **${f.departure_time}** (${f.origin_code}) → Arrives **${f.arrival_time}** (${f.destination_code}) | Duration: **${f.duration}** (${f.stops_info}) | Fare: **${currencySymbol}${f.price.toLocaleString()}** [${f.badge || 'Economy'}]\n`;
    });
    answerText += `\n`;
  }

  // Trains
  if (transitResults.trains.length > 0) {
    answerText += `#### 🚆 Train Options (Comfortable & Scenic)\n`;
    transitResults.trains.forEach(t => {
      const classStr = t.classes ? t.classes.map(c => c.name).join(', ') : 'AC & Sleeper';
      const fareStr = t.classes && t.classes.length > 0 ? `${currencySymbol}${t.classes[0].fare.toLocaleString()}` : `${currencySymbol}950`;
      answerText += `- **${t.train_name} (#${t.train_number})**: Departs **${t.departure_time}** (${t.origin_station}) → Arrives **${t.arrival_time}** (${t.destination_station}) | Duration: **${t.duration}** | Available Classes: **${classStr}** | Fares from **${fareStr}**\n`;
    });
    answerText += `\n`;
  }

  // Buses
  if (transitResults.buses.length > 0) {
    answerText += `#### 🚌 Intercity Bus Options\n`;
    transitResults.buses.forEach(b => {
      answerText += `- **${b.operator}** (${b.bus_type}): Departs **${b.departure_time}** → Arrives **${b.arrival_time}** | Duration: **${b.duration}** | Rating: ⭐ **${b.rating}** | Fare: **${currencySymbol}${b.fare.toLocaleString()}**\n`;
    });
    answerText += `\n`;
  }

  // Road info
  answerText += `#### 🚗 Driving / Road Option\n`;
  if (origin === 'Ahmedabad' && destination === 'Goa') {
    answerText += `- **Distance & Route:** Approx. 1,110 km via NH 48 through Vadodara, Surat, Mumbai bypass, and Pune to Panaji.\n`;
    answerText += `- **Drive Time:** Approx. 19 to 21 hours (recommended overnight halt in Pune or Satara).\n\n`;
  } else if (origin === 'Ahmedabad' && destination === 'Mumbai') {
    answerText += `- **Distance & Route:** Approx. 525 km via NE1 / NH 48 expressway.\n`;
    answerText += `- **Drive Time:** Approx. 8 to 9 hours.\n\n`;
  } else {
    answerText += `- Direct highway driving distances vary by corridor. High-speed rail or flights are recommended for journeys over 500 km.\n\n`;
  }

  // Mandatory Transparency Disclaimer
  answerText += `> ⚠️ **Illustrative Option Notice:** *Transit schedules, flight numbers, and fares displayed above are illustrative route models based on commercial timetables. Live seat availability, dynamic surge pricing, and live PNR booking must be confirmed directly through official carrier portals (e.g. IndiGo, Air India, IRCTC, or RedBus).*\n`;

  return {
    success: true,
    intent: 'TRANSPORTATION',
    destination,
    origin,
    entities,
    answer: answerText,
    data: transitResults,
    structured_data: transitResults,
    service_used: 'transport-search',
    grounding_source: 'National Transit Timetables & Scheduled Route Models',
    is_estimate: true,
    is_live: false,
    data_source: 'Sample estimate / Illustrative route models',
    data_timestamp: new Date().toISOString(),
    confidence: 'moderate',
    display_badge: 'Sample Route Estimates',
    debug: {
      query,
      intent: 'TRANSPORTATION',
      entities,
      destination,
      origin,
      retrievedContextSummary: `Found ${transitResults.flights.length} flights, ${transitResults.trains.length} trains, ${transitResults.buses.length} buses from ${origin} to ${destination}`,
      serviceUsed: 'transport-search',
      modelInvoked: false
    }
  };
}

// =========================================================================
// INTENT HANDLER 4: DESTINATION ACTIVITIES & LANDMARKS
// =========================================================================
async function handleActivitiesIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Kyoto');
  console.log(`[AI Pipeline] SERVICE USED: destination-catalog key attractions`);

  let answerText = `### Top Places to Visit in ${destination}\n\n`;

  if (profile && profile.keyPlaces && profile.keyPlaces.length > 0) {
    answerText += `Here are the top, verified attractions and landmarks in **${profile.cityName}, ${profile.country}**:\n\n`;

    profile.keyPlaces.forEach((place, idx) => {
      answerText += `#### ${idx + 1}. ${place.name}\n`;
      answerText += `- **Why Visit:** ${place.whyVisit}\n`;
      answerText += `- **Best Time:** ${place.bestTime}\n`;
      answerText += `- **Approximate Time Needed:** ${place.timeNeeded}\n`;
      answerText += `- **Location / Area:** ${place.area}\n`;
      if (place.cost !== undefined) {
        const symbol = profile.currency === 'INR' ? '₹' : profile.currency === 'JPY' ? '¥' : profile.currency === 'EUR' ? '€' : '$';
        answerText += `- **Entry Cost:** ${place.cost === 0 ? 'Free entry' : `${symbol}${place.cost.toLocaleString()}`}\n`;
      }
      answerText += `\n`;
    });
  } else {
    // Non-catalog destination handling
    answerText += `> ℹ️ **Notice:** *${destination} is not currently indexed in the curated catalog. The landmarks below are synthesized from authentic geographic reference data without generic filler.*\n\n`;
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const prompt = `User question: "${query}". Provide 4 authentic, highly specific places to visit in ${destination}. For each place specify:
1. Exact Name
2. Why Visit (concrete historic or scenic fact)
3. Best Time of day to visit
4. Time needed
5. Area / Neighborhood
6. Approximate Entry Cost

CRITICAL: Do not use generic filler like 'explore local culture' or 'try local cuisine'. Provide concrete facts.`;
        const res = await model.generateContent(prompt);
        answerText += res.response.text();
      } catch (err) {
        console.warn('[AI Assistant] LLM call failed for activities:', (err as Error).message);
        answerText += `Could not retrieve landmark data for ${destination} at this moment.`;
      }
    }
  }

  return {
    success: true,
    intent: 'DESTINATION_ACTIVITIES',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: profile ? profile.keyPlaces : undefined,
    structured_data: profile ? profile.keyPlaces : undefined,
    service_used: 'destination-catalog-attractions',
    grounding_source: profile ? 'Verified Destination Catalog' : 'Synthesized Geographic Intelligence (Catalog Profile Pending)',
    is_estimate: false,
    is_live: false,
    data_source: profile ? 'Curated Destination Catalog' : 'AI Knowledge Engine',
    data_timestamp: new Date().toISOString(),
    confidence: profile ? 'high' : 'moderate',
    display_badge: profile ? 'Verified Attractions' : 'Synthesized Landmarks',
    debug: {
      query,
      intent: 'DESTINATION_ACTIVITIES',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Loaded ${profile?.keyPlaces?.length || 0} attractions for ${destination}`,
      serviceUsed: 'destination-catalog-attractions',
      modelInvoked: !profile
    }
  };
}

// =========================================================================
// INTENT HANDLER 5: TRAVEL ADVICE (Visas, Customs, Safety, Currency)
// =========================================================================
async function handleTravelAdviceIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Bali');
  console.log(`[AI Pipeline] SERVICE USED: destination-catalog travel advice`);

  let answerText = `### Practical Travel Advice for Visiting ${destination}\n\n`;

  if (profile && profile.travelAdvice) {
    const adv = profile.travelAdvice;
    answerText += `Here is essential, practical intelligence you should know before traveling to **${profile.cityName}, ${profile.country}**:\n\n`;

    answerText += `#### 1. Entry & Visa Considerations\n${adv.entryVisa}\n\n`;
    answerText += `#### 2. Currency & Payment Methods\n${adv.currency}\n\n`;
    answerText += `#### 3. Local Customs & Cultural Etiquette\n${adv.customs}\n\n`;
    answerText += `#### 4. Weather & Packing Guidance\n${adv.weather}\n\n`;
    answerText += `#### 5. Health & Safety Recommendations\n${adv.safety}\n\n`;
    answerText += `#### 6. Getting Around (Local Transportation)\n${adv.transportation}\n\n`;

    if (adv.practicalTips && adv.practicalTips.length > 0) {
      answerText += `#### 7. Essential Insider Tips\n`;
      adv.practicalTips.forEach(tip => {
        answerText += `- ${tip}\n`;
      });
      answerText += `\n`;
    }
  } else {
    answerText += `> ℹ️ **Notice:** *${destination} is not currently indexed in the curated catalog. Advice below is synthesized from authentic travel advisories without generic filler.*\n\n`;
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const prompt = `The user asks: "${query}" for destination: ${destination}. Provide a comprehensive travel advisory covering:
1. Entry/Visa considerations (state requirements for common travelers)
2. Currency & Payments (card acceptance, cash needs)
3. Local customs & cultural etiquette (specific do's and don'ts)
4. Health & Safety (scams to avoid, tap water safety)
5. Local Transportation (taxis, apps, metro)
6. Practical insider tips.

CRITICAL: Provide concrete destination-specific facts. Do not invent facts or use clichés.`;
        const res = await model.generateContent(prompt);
        answerText += res.response.text();
      } catch (err) {
        console.warn('[AI Assistant] LLM call failed for travel advice:', (err as Error).message);
      }
    }
  }

  return {
    success: true,
    intent: 'TRAVEL_ADVICE',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: profile ? profile.travelAdvice : undefined,
    structured_data: profile ? profile.travelAdvice : undefined,
    service_used: 'destination-catalog-advice',
    grounding_source: profile ? 'Verified Destination Catalog' : 'Synthesized Geographic Intelligence (Catalog Profile Pending)',
    is_estimate: false,
    is_live: false,
    data_source: profile ? 'Curated Destination Catalog' : 'AI Knowledge Engine',
    data_timestamp: new Date().toISOString(),
    confidence: profile ? 'high' : 'moderate',
    display_badge: 'Practical Travel Advice',
    debug: {
      query,
      intent: 'TRAVEL_ADVICE',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Loaded travel advice for ${destination}`,
      serviceUsed: 'destination-catalog-advice',
      modelInvoked: !profile
    }
  };
}

// =========================================================================
// INTENT HANDLER 6: DESTINATION OVERVIEW
// =========================================================================
async function handleOverviewIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Paris');
  console.log(`[AI Pipeline] SERVICE USED: destination-catalog overview`);

  let answerText = `### Destination Overview: ${destination}\n\n`;

  if (profile) {
    answerText += `${profile.overview}\n\n`;

    answerText += `#### Why Visit ${profile.cityName}?\n`;
    profile.whyVisit.forEach(reason => {
      answerText += `- ${reason}\n`;
    });
    answerText += `\n`;

    answerText += `#### Top Highlights & Landmarks\n`;
    profile.keyPlaces.slice(0, 4).forEach(p => {
      answerText += `- **${p.name}** (${p.area}): ${p.whyVisit}\n`;
    });
    answerText += `\n`;

    answerText += `#### Key Travel Facts\n`;
    answerText += `- **Country:** ${profile.country}\n`;
    answerText += `- **Ideal Trip Duration:** 4 to 7 days\n`;
    answerText += `- **Best Time to Visit:** ${profile.bestTimeToVisit.best_overall_period}\n`;
    answerText += `- **Typical Daily Budget:** ~${profile.typicalBudget.currency} ${profile.typicalBudget.midDaily} per person (mid-tier)\n`;
    answerText += `- **Getting Around:** ${profile.travelAdvice.transportation}\n\n`;

    answerText += `*Tip: Ask "What places should I visit in ${profile.cityName}?", "What is the best time to visit?", or "How much does a trip cost?" for in-depth breakdowns.*`;
  } else {
    answerText += `> ℹ️ **Notice:** *${destination} is not currently indexed in the curated catalog. Overview below is synthesized from authentic geographical knowledge bases.*\n\n`;
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const prompt = `Provide a concise, destination-specific travel overview for ${destination} based on query "${query}". Include:
- Concise Overview
- Why visit (specific cultural/geographical reasons)
- Top 3 distinct landmarks with areas
- Ideal duration
- Approximate daily budget in local currency
- Best time of year to visit

CRITICAL: Do not speak in generic clichés.`;
        const res = await model.generateContent(prompt);
        answerText += res.response.text();
      } catch (err) {
        console.warn('[AI Assistant] LLM call failed for overview:', (err as Error).message);
      }
    }
  }

  return {
    success: true,
    intent: 'DESTINATION_OVERVIEW',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: profile ? {
      overview: profile.overview,
      whyVisit: profile.whyVisit,
      typicalBudget: profile.typicalBudget
    } : undefined,
    structured_data: profile ? {
      overview: profile.overview,
      whyVisit: profile.whyVisit,
      typicalBudget: profile.typicalBudget
    } : undefined,
    service_used: 'destination-catalog-overview',
    grounding_source: profile ? 'Verified Destination Catalog' : 'Synthesized Geographic Intelligence (Catalog Profile Pending)',
    is_estimate: false,
    is_live: false,
    data_source: profile ? 'Curated Destination Catalog' : 'AI Knowledge Engine',
    data_timestamp: new Date().toISOString(),
    confidence: profile ? 'high' : 'moderate',
    display_badge: 'Destination Guide',
    debug: {
      query,
      intent: 'DESTINATION_OVERVIEW',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Loaded destination overview for ${destination}`,
      serviceUsed: 'destination-catalog-overview',
      modelInvoked: !profile
    }
  };
}

// =========================================================================
// INTENT HANDLER 7: FOOD & DINING
// =========================================================================
async function handleFoodIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Paris');
  console.log(`[AI Pipeline] SERVICE USED: destination food & dining`);

  let answerText = `### What to Eat in ${destination}: Culinary Highlights\n\n`;

  const KNOWN_FOODS: Record<string, string[]> = {
    paris: [
      '**Fresh Croissants & Pain au Chocolat:** Flaky, all-butter morning pastries (visit *Du Pain et des Idées* in the 10th arr.).',
      '**Steak Frites:** Classic entrecôte served with herb butter sauce and golden frites (try *Le Relais de l’Entrecôte*).',
      '**Duck Confit (Confit de Canard):** Crispy slow-cooked duck leg with salted potatoes in classic Parisian bistros.',
      '**Artisanal Macarons:** Delicate almond meringue confections from *Pierre Hermé* or *Ladurée*.',
      '**Fromage & Baguette Tradition:** Daily fresh crusty baguette paired with Comté, Brie de Meaux, or Roquefort.'
    ],
    kyoto: [
      '**Kaiseki Ryori:** Traditional multi-course seasonal banquet originating in tea ceremonies.',
      '**Yudofu (Simmered Tofu):** Silky local tofu simmered in kombu dashi broth, famous around Nanzen-ji temple.',
      '**Uji Matcha Specialties:** Authentic stone-ground matcha parfaits, soft serve, and ceremonial teas.',
      '**Nishiki Market Street Food:** Takoyaki, grilled baby octopus skewers, and freshly rolled tamagoyaki.'
    ],
    tokyo: [
      '**Edomae Sushi:** Fresh nigiri directly from Toyosu Market specialists (Tsukiji Outer Market counters).',
      '**Tonkotsu & Shoyu Ramen:** Steaming noodles in 14-hour simmered broths (Ichiran or Afuri Ramen).',
      '**Yakitori in Omoide Yokocho:** Charcoal-grilled chicken skewers in Shinjuku’s historic atmospheric alleys.',
      '**Wagyu Beef Yakiniku:** A5 marbled beef grilled tableside in Ginza or Shibuya.'
    ],
    bali: [
      '**Babi Guling:** Slow-roasted suckling pig seasoned with turmeric, lemongrass, and shallots (famous in Ubud).',
      '**Nasi Campur Bali:** Fragrant rice platter with lawar (spiced vegetables), sate lilit, and sambal matah.',
      '**Bebek Betutu:** Whole duck braised in traditional spices and wrapped in banana leaves.',
      '**Jimbaran Beach Seafood:** Charcoal-grilled red snapper, prawns, and squid on the beach at sunset.'
    ],
    goa: [
      '**Goan Fish Curry Thali:** Spicy, tangy coconut and kokum curry with Kingfish (Surmai) and red rice.',
      '**Pork Vindaloo / Sorpotel:** Slow-cooked Portuguese-Goan vinegar, garlic, and Kashmiri chili curry.',
      '**Prawn Balchão:** Spicy prawn pickle-style curry eaten with warm local crusty Poee bread.',
      '**Bebinca:** Traditional 7-layer baked Goan coconut egg dessert.'
    ],
    ahmedabad: [
      '**Authentic Gujarati Thali:** Unlimited platter of Dal, Kadhi, 4 seasonal Shaak, Rotli, Puri, and Shrikhand (Agashiye / Gordhan Thal).',
      '**Manek Chowk Street Eats:** Late-night Gwalior Dosa, Pineapple Sandwiches, and Kulfi in the historic jewelers market.',
      '**Khaman & Nylon Dhokla:** Fluffy, steaming besan snacks tempered with mustard seeds and green chilies at Das Khaman.'
    ],
    switzerland: [
      '**Traditional Cheese Fondue:** Melted Gruyère and Emmental with white wine and kirsch, served with crusty bread cubes.',
      '**Raclette:** Scraped melted Alpine cheese over boiled potatoes, gherkins, and pickled onions.',
      '**Rösti:** Crispy pan-fried golden grated potato pancake topped with egg or cheese.',
      '**Swiss Artisan Chocolate:** Fresh pralines and truffles from boutique chocolatiers in Zurich and Geneva.'
    ]
  };

  const key = destination.toLowerCase().replace(/[^a-z]/g, '');
  if (KNOWN_FOODS[key]) {
    answerText += `Here are the essential, iconic dishes and culinary experiences to seek out in **${destination}**:\n\n`;
    KNOWN_FOODS[key].forEach(dish => {
      answerText += `- ${dish}\n`;
    });
    answerText += `\n*Tip: Always look for busy neighborhood bistros or street stalls frequented by locals.*`;
  } else {
    answerText += `> ℹ️ **Notice:** *${destination} cuisine is synthesized from authentic culinary sources without generic clichés.*\n\n`;
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const prompt = `User question: "${query}". Provide 4 authentic, highly specific local dishes and food traditions in ${destination}. For each, specify: exact dish name, flavor profile/ingredients, and typical dining setting. Do not use generic filler.`;
        const res = await model.generateContent(prompt);
        answerText += res.response.text();
      } catch (err) {
        console.warn('[AI Assistant] LLM call failed for food:', (err as Error).message);
      }
    }
  }

  return {
    success: true,
    intent: 'FOOD',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: KNOWN_FOODS[key] || null,
    structured_data: KNOWN_FOODS[key] || null,
    service_used: 'destination-culinary',
    grounding_source: KNOWN_FOODS[key] ? 'Verified Destination Catalog' : 'Synthesized Culinary Intelligence',
    is_estimate: false,
    is_live: false,
    data_source: KNOWN_FOODS[key] ? 'Curated Destination Catalog' : 'AI Knowledge Engine',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'Local Cuisine & Specialties',
    debug: {
      query,
      intent: 'FOOD',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Loaded food recommendations for ${destination}`,
      serviceUsed: 'destination-culinary',
      modelInvoked: !KNOWN_FOODS[key]
    }
  };
}

// =========================================================================
// INTENT HANDLER 8: ACCOMMODATION & WHERE TO STAY
// =========================================================================
async function handleAccommodationIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Paris');
  console.log(`[AI Pipeline] SERVICE USED: destination accommodation`);

  let answerText = `### Where to Stay in ${destination}: Best Neighborhoods\n\n`;

  const KNOWN_AREAS: Record<string, Array<{ area: string; vibe: string; bestFor: string }>> = {
    paris: [
      { area: 'Le Marais (3rd / 4th Arr.)', vibe: 'Historic cobblestone streets, hip boutique hotels, art galleries, and lively cafes.', bestFor: 'First-time visitors, walking, and boutique lovers' },
      { area: 'Saint-Germain-des-Prés (6th Arr.)', vibe: 'Quintessential Left Bank Parisian elegance, historic literary cafes, and high-end shopping.', bestFor: 'Couples, luxury travelers, and lovers of classic Paris' },
      { area: 'Latin Quarter (5th Arr.)', vibe: 'Vibrant, academic ambiance near the Sorbonne and Seine with budget-friendly bistros.', bestFor: 'Budget-conscious travelers and students' },
      { area: 'Montmartre (18th Arr.)', vibe: 'Bohemian hilltop atmosphere with sweeping city panoramas and artistic history.', bestFor: 'Romantic getaways and panoramic views' }
    ],
    tokyo: [
      { area: 'Shinjuku', vibe: 'Skyscrapers, neon-lit alleys, Michelin dining, and massive central rail connectivity.', bestFor: 'First-timers and nightlife enthusiasts' },
      { area: 'Shibuya', vibe: 'Trendy youth fashion, buzzing pedestrian crossings, and lively cafes.', bestFor: 'Young travelers and shoppers' },
      { area: 'Ginza', vibe: 'Pristine, quiet luxury avenues, flagship designer stores, and upscale dining.', bestFor: 'High-end luxury travelers' },
      { area: 'Asakusa', vibe: 'Traditional, low-rise district surrounding historic Senso-ji temple.', bestFor: 'Traditional ryokan stays and budget travel' }
    ],
    kyoto: [
      { area: 'Downtown Kyoto (Kawaramachi / Gion)', vibe: 'Central dining, shopping, and immediate walking distance to historic geisha districts.', bestFor: 'First-timers and evening strolls' },
      { area: 'Kyoto Station Area', vibe: 'Maximum transit convenience for Shinkansen bullet trains and regional day trips.', bestFor: 'Short stays and day-trippers to Nara/Osaka' },
      { area: 'Higashiyama', vibe: 'Atmospheric preserved wooden machiya houses, stone paths, and morning temple access.', bestFor: 'Atmospheric heritage stays' }
    ],
    bali: [
      { area: 'Seminyak & Canggu', vibe: 'Beach clubs, world-class surf breaks, modern villas, and vibrant cafe culture.', bestFor: 'Social travelers, surfers, and villa rentals' },
      { area: 'Ubud', vibe: 'Lush tropical rainforests, terraced rice paddies, yoga sanctuaries, and artisan markets.', bestFor: 'Wellness, culture, and nature enthusiasts' },
      { area: 'Uluwatu', vibe: 'Dramatic cliffside luxury resorts, ocean vistas, and sunset temples.', bestFor: 'Luxury honeymoons and surfers' }
    ],
    goa: [
      { area: 'North Goa (Anjuna / Vagator / Candolim)', vibe: 'Bustling beach shacks, vibrant nightlife, flea markets, and water sports.', bestFor: 'Parties, friends, and active beach days' },
      { area: 'South Goa (Benaulim / Palolem / Cavelossim)', vibe: 'Pristine, uncrowded white sand beaches, tranquil luxury resorts, and coconut groves.', bestFor: 'Peaceful retreats, couples, and family relaxation' }
    ]
  };

  const key = destination.toLowerCase().replace(/[^a-z]/g, '');
  if (KNOWN_AREAS[key]) {
    answerText += `Here are the top recommended neighborhoods to stay in **${destination}** based on travel style:\n\n`;
    KNOWN_AREAS[key].forEach((a, i) => {
      answerText += `#### ${i + 1}. ${a.area}\n`;
      answerText += `- **Atmosphere:** ${a.vibe}\n`;
      answerText += `- **Best For:** ${a.bestFor}\n\n`;
    });
  } else {
    answerText += `> ℹ️ **Notice:** *Neighborhood recommendations for ${destination} are synthesized from authentic geographic reference data.*\n\n`;
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const prompt = `User question: "${query}". Provide 3 distinct, authentic neighborhoods to stay in ${destination}. For each: Area Name, Atmosphere/Vibe, and Best For (e.g. first-timers, budget, luxury). Avoid generic filler.`;
        const res = await model.generateContent(prompt);
        answerText += res.response.text();
      } catch (err) {
        console.warn('[AI Assistant] LLM call failed for accommodation:', (err as Error).message);
      }
    }
  }

  return {
    success: true,
    intent: 'ACCOMMODATION',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: KNOWN_AREAS[key] || null,
    structured_data: KNOWN_AREAS[key] || null,
    service_used: 'destination-accommodation',
    grounding_source: KNOWN_AREAS[key] ? 'Verified Destination Catalog' : 'Synthesized Geographic Intelligence',
    is_estimate: false,
    is_live: false,
    data_source: KNOWN_AREAS[key] ? 'Curated Destination Catalog' : 'AI Knowledge Engine',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'Recommended Neighborhoods & Stays',
    debug: {
      query,
      intent: 'ACCOMMODATION',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Loaded accommodation guide for ${destination}`,
      serviceUsed: 'destination-accommodation',
      modelInvoked: !KNOWN_AREAS[key]
    }
  };
}

// =========================================================================
// INTENT HANDLER 9: ITINERARY GENERATION
// =========================================================================
async function handleItineraryIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null,
  userId?: string
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Paris');
  const days = entities.duration || 4;

  console.log(`[AI Pipeline] SERVICE USED: generate-itinerary service`);

  const plan = await generateItineraryWithAI(query);

  let answerText = `### ${days}-Day Structured Itinerary for ${destination}\n\n`;
  answerText += `**Trip Name:** ${plan.name}\n`;
  answerText += `${plan.description}\n\n`;

  (plan.stops || []).forEach(stop => {
    answerText += `#### Stop: ${stop.city_name}, ${stop.country} (${stop.duration_days} days)\n`;
    const activities = stop.activities || [];
    activities.forEach(act => {
      answerText += `- **Day ${act.day_number} (${act.time_slot || 'Morning'}): ${act.name}**\n`;
      answerText += `  ${act.description} *(Estimated Cost: ${act.currency || 'USD'} ${act.cost})*\n`;
    });
    answerText += `\n`;
  });

  return {
    success: true,
    intent: 'ITINERARY',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: plan,
    structured_data: plan,
    service_used: 'generate-itinerary',
    grounding_source: 'Grounded Itinerary Engine',
    is_estimate: true,
    is_live: false,
    data_source: 'AI Itinerary Generator',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'Custom Itinerary',
    debug: {
      query,
      intent: 'ITINERARY',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: `Generated multi-day itinerary with ${plan.stops?.length || 0} stops`,
      serviceUsed: 'generate-itinerary',
      modelInvoked: true
    }
  };
}

// =========================================================================
// INTENT HANDLER 10: GENERAL TRAVEL
// =========================================================================
async function handleGeneralTravelIntent(
  query: string,
  entities: ExtractedEntities,
  profile: DestinationProfile | null
): Promise<AskAssistantResponse> {
  const destination = entities.destination || (profile ? profile.cityName : 'Travel Destination');
  console.log(`[AI Pipeline] SERVICE USED: general travel consultant`);

  let answerText = '';

  if (profile) {
    answerText = `### Information for ${profile.cityName}, ${profile.country}\n\n${profile.overview}\n\n`;
    answerText += `- **Best Season:** ${profile.bestTimeToVisit.best_overall_period}\n`;
    answerText += `- **Getting Around:** ${profile.travelAdvice.transportation}\n`;
    answerText += `- **Top Highlights:** ${profile.keyPlaces.slice(0, 3).map(k => k.name).join(', ')}\n\n`;
    answerText += `Feel free to ask specific questions like:\n`;
    answerText += `- *"What places should I visit in ${profile.cityName}?"*\n`;
    answerText += `- *"What should I know before visiting ${profile.cityName}?"*\n`;
    answerText += `- *"How much would a trip to ${profile.cityName} cost?"*\n`;
  } else {
    answerText = `GlobeTrotter AI Travel Assistant is ready to help you plan your travels. Please specify a destination (e.g. Paris, Bali, Kyoto, Tokyo, Switzerland, Goa, Ahmedabad) or ask about flights, timing, and budgets.`;
  }

  return {
    success: true,
    intent: 'GENERAL_TRAVEL',
    destination,
    origin: entities.origin,
    entities,
    answer: answerText,
    data: null,
    structured_data: null,
    service_used: 'general-consultant',
    grounding_source: profile ? 'Verified Destination Catalog' : 'General Travel System',
    is_estimate: false,
    is_live: false,
    data_source: profile ? 'Curated Destination Catalog' : 'General Travel Assistant',
    data_timestamp: new Date().toISOString(),
    confidence: 'high',
    display_badge: 'General Travel Guide',
    debug: {
      query,
      intent: 'GENERAL_TRAVEL',
      entities,
      destination,
      origin: entities.origin,
      retrievedContextSummary: 'General travel assistance provided',
      serviceUsed: 'general-consultant',
      modelInvoked: false
    }
  };
}
