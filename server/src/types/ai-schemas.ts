/**
 * AI Schema Definitions for GlobeTrotter
 * Covers Itinerary Generation, Activity Recommendations, Budget Estimates, and Admin Insights.
 */

// ==========================================
// 1. ITINERARY GENERATION SCHEMAS
// ==========================================

export interface GeneratedActivity {
  name: string;
  category: string; // e.g., Sightseeing, Food, Culture, Adventure, Relaxation, Nightlife
  cost: number;
  duration_min: number;
  description: string;
  image_url?: string;
  day_number?: number;
  time_slot?: string; // "Morning", "Afternoon", "Evening"
  currency?: string;
}

export interface GeneratedStop {
  city_name: string;
  country: string;
  cost_index?: number; // 1 to 5
  popularity?: number; // 1 to 100
  city_image_url?: string;
  duration_days?: number;
  day_start?: number;
  day_end?: number;
  order_index?: number;
  activities: GeneratedActivity[];
}

export interface GeneratedTripPlan {
  name: string;
  description: string;
  cover_photo?: string;
  currency?: string;
  stops: GeneratedStop[];
  trip?: {
    name?: string;
    description?: string;
    total_days?: number;
    cover_photo_url?: string;
  };
}

export type ItineraryResponse = GeneratedTripPlan;

// JSON Schema for Gemini Itinerary Output
export const ITINERARY_JSON_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "Catchy title for the trip" },
    description: { type: "string", description: "Brief summary of the trip itinerary" },
    cover_photo: { type: "string", description: "Unsplash image URL representing the primary destination" },
    currency: { type: "string", description: "Base currency used for costs: 'USD' or 'INR'" },
    stops: {
      type: "array",
      description: "Ordered array of city stops",
      items: {
        type: "object",
        properties: {
          city_name: { type: "string", description: "Name of the city" },
          country: { type: "string", description: "Country of the city" },
          cost_index: { type: "integer", description: "Cost index from 1 (budget) to 5 (luxury)" },
          popularity: { type: "integer", description: "Popularity index from 1 to 100" },
          city_image_url: { type: "string", description: "Image URL for the city" },
          duration_days: { type: "integer", description: "Number of days spent in this city stop" },
          activities: {
            type: "array",
            description: "List of activities scheduled in this city",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Activity title" },
                category: { type: "string", description: "Category: Sightseeing, Food, Culture, Adventure, Relaxation, Nightlife" },
                cost: { type: "number", description: "Estimated cost (in USD for international or INR for Indian destinations)" },
                currency: { type: "string", description: "Currency code: 'USD' or 'INR'" },
                duration_min: { type: "integer", description: "Duration in minutes" },
                description: { type: "string", description: "Short activity description" },
                image_url: { type: "string", description: "Relevant activity image URL" },
                day_number: { type: "integer", description: "Day number within this city stop (1 to duration_days)" },
                time_slot: { type: "string", description: "Time slot: Morning, Afternoon, or Evening" }
              },
              required: ["name", "category", "cost", "duration_min", "description"]
            }
          }
        },
        required: ["city_name", "country", "activities"]
      }
    }
  },
  required: ["name", "description", "stops"]
};

// ==========================================
// 2. ACTIVITY RECOMMENDATION SCHEMAS
// ==========================================

export interface ActivityRecommendation {
  name: string;
  category: string;
  cost: number;
  duration_min: number;
  reason: string;
  description?: string;
}

export interface ActivityRecommendationResponse {
  recommendations: ActivityRecommendation[];
}

export const RECOMMENDATION_JSON_SCHEMA = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      description: "Array of 3 to 5 tailored activity recommendations",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Activity name" },
          category: { type: "string", description: "Category of activity" },
          cost: { type: "number", description: "Estimated cost in USD" },
          duration_min: { type: "integer", description: "Estimated duration in minutes" },
          reason: { type: "string", description: "Exactly 1 punchy sentence explaining why this activity fits" }
        },
        required: ["name", "category", "cost", "duration_min", "reason"]
      }
    }
  },
  required: ["recommendations"]
};

// ==========================================
// 3. BUDGET ESTIMATION SCHEMAS
// ==========================================

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
}

export interface BudgetEstimateResponse {
  daily_average: number;
  breakdown: BudgetBreakdown;
  currency: string; // "USD"
}

export const BUDGET_ESTIMATE_JSON_SCHEMA = {
  type: "object",
  properties: {
    daily_average: { type: "number", description: "Average total daily cost in USD" },
    breakdown: {
      type: "object",
      properties: {
        accommodation: { type: "number", description: "Daily accommodation cost in USD" },
        food: { type: "number", description: "Daily food/dining cost in USD" },
        activities: { type: "number", description: "Daily activity/attraction cost in USD" },
        transport: { type: "number", description: "Daily transportation cost in USD" }
      },
      required: ["accommodation", "food", "activities", "transport"]
    },
    currency: { type: "string", description: "Currency code, strictly 'USD'" }
  },
  required: ["daily_average", "breakdown", "currency"]
};

// ==========================================
// 4. ADMIN INSIGHT SCHEMAS
// ==========================================

export interface AdminInsightResponse {
  insight: string;
}

export const ADMIN_INSIGHT_JSON_SCHEMA = {
  type: "object",
  properties: {
    insight: { type: "string", description: "A single punchy analytical trend sentence summarizing user trip patterns" }
  },
  required: ["insight"]
};

// ==========================================
// 5. NATURAL LANGUAGE TRAVEL INTENT SCHEMAS
// ==========================================

export interface ParsedTravelIntent {
  intent: 'plan_trip' | 'flight_search' | 'train_search' | 'bus_search' | 'best_time' | 'budget_inquiry' | 'general_explore';
  origin?: string;
  destination?: string;
  travel_date?: string;
  return_date?: string;
  duration_days?: number;
  passengers?: number;
  budget?: number;
  budget_tier?: 'budget' | 'moderate' | 'premium' | 'luxury';
  transport_type?: 'flight' | 'train' | 'bus' | 'any';
  travel_style?: string;
  preferences?: string[];
  summary: string;
}

export const TRAVEL_INTENT_JSON_SCHEMA = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      enum: ["plan_trip", "flight_search", "train_search", "bus_search", "best_time", "budget_inquiry", "general_explore"]
    },
    origin: { type: "string", description: "Departure city or station if specified" },
    destination: { type: "string", description: "Target city or country" },
    travel_date: { type: "string", description: "Resolved ISO date YYYY-MM-DD or descriptive date" },
    return_date: { type: "string", description: "Return date if specified" },
    duration_days: { type: "integer", description: "Number of days for the trip" },
    passengers: { type: "integer", description: "Number of travelers" },
    budget: { type: "number", description: "Numerical budget if mentioned" },
    budget_tier: { type: "string", enum: ["budget", "moderate", "premium", "luxury"] },
    transport_type: { type: "string", enum: ["flight", "train", "bus", "any"] },
    travel_style: { type: "string", description: "Travel style persona (e.g., adventure, relaxed, cultural)" },
    preferences: {
      type: "array",
      items: { type: "string" },
      description: "Extracted tags like beaches, food, mountains, nightlife"
    },
    summary: { type: "string", description: "A concise 1-sentence recap of what the user wants" }
  },
  required: ["intent", "destination", "summary"]
};

// ==========================================
// 6. TRAVEL TIMING SCHEMAS
// ==========================================

export interface TravelSeasonInfo {
  months: string;
  weather: string;
  crowd_level: 'Low' | 'Moderate' | 'High' | 'Peak';
  price_level: 'Budget ($)' | 'Moderate ($$)' | 'Premium ($$$)' | 'Peak ($$$$)';
  highlights: string;
}

export interface TravelTimingResponse {
  destination: string;
  best_overall_period: string;
  best_budget_period: string;
  best_weather_period: string;
  periods_to_avoid: string;
  avoid_reason: string;
  seasons: {
    peak: TravelSeasonInfo;
    shoulder: TravelSeasonInfo;
    off_season: TravelSeasonInfo;
  };
  festivals_events: string[];
  weather_summary: string;
  data_reliability: string;
}

export const TRAVEL_TIMING_JSON_SCHEMA = {
  type: "object",
  properties: {
    destination: { type: "string" },
    best_overall_period: { type: "string", description: "Recommended months for the best balanced trip" },
    best_budget_period: { type: "string", description: "Months with cheapest flights & accommodation" },
    best_weather_period: { type: "string", description: "Months with the most pleasant meteorological conditions" },
    periods_to_avoid: { type: "string", description: "Months or seasons not recommended" },
    avoid_reason: { type: "string", description: "Clear factual reason why (e.g. monsoon floods, extreme 45C heat, heavy typhoon season)" },
    seasons: {
      type: "object",
      properties: {
        peak: {
          type: "object",
          properties: {
            months: { type: "string" },
            weather: { type: "string" },
            crowd_level: { type: "string" },
            price_level: { type: "string" },
            highlights: { type: "string" }
          },
          required: ["months", "weather", "crowd_level", "price_level", "highlights"]
        },
        shoulder: {
          type: "object",
          properties: {
            months: { type: "string" },
            weather: { type: "string" },
            crowd_level: { type: "string" },
            price_level: { type: "string" },
            highlights: { type: "string" }
          },
          required: ["months", "weather", "crowd_level", "price_level", "highlights"]
        },
        off_season: {
          type: "object",
          properties: {
            months: { type: "string" },
            weather: { type: "string" },
            crowd_level: { type: "string" },
            price_level: { type: "string" },
            highlights: { type: "string" }
          },
          required: ["months", "weather", "crowd_level", "price_level", "highlights"]
        }
      },
      required: ["peak", "shoulder", "off_season"]
    },
    festivals_events: {
      type: "array",
      items: { type: "string" }
    },
    weather_summary: { type: "string" },
    data_reliability: { type: "string" }
  },
  required: ["destination", "best_overall_period", "best_budget_period", "best_weather_period", "periods_to_avoid", "avoid_reason", "seasons"]
};

// ==========================================
// 7. COMPREHENSIVE ITEMIZED BUDGET SCHEMAS
// ==========================================

export interface ItemizedCostItem {
  category: string;
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  unit: string;
  notes: string;
  status: 'Estimated' | 'Live' | 'Verified' | 'User-provided';
}

export interface ComprehensiveBudgetResponse {
  destination: string;
  origin?: string;
  days: number;
  travelers: number;
  currency: string;
  display_currency?: string;
  converted_currency?: string;
  converted_total_min?: number;
  converted_total_max?: number;
  converted_total_avg?: number;
  conversion_rate_note?: string;
  travel_style: string;
  breakdown: {
    flights_transit: ItemizedCostItem;
    train_bus_alternative?: ItemizedCostItem;
    accommodation: ItemizedCostItem;
    food_dining: ItemizedCostItem;
    local_transport: ItemizedCostItem;
    activities_tours: ItemizedCostItem;
  };
  total_min: number;
  total_max: number;
  total_avg: number;
  assumptions: string[];
}

// ==========================================
// 8. TRANSPORTATION SEARCH SCHEMAS
// ==========================================

export interface FlightOption {
  id: string;
  carrier: string;
  carrier_code: string;
  flight_number: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  stops_info: string;
  price: number;
  currency: string;
  cabin_class: string;
  badge?: 'Fastest' | 'Cheapest' | 'Best Value';
  booking_provider: string;
  booking_url: string;
}

export interface TrainClassInfo {
  code: string;
  name: string;
  fare: number;
  status: 'Available' | 'RAC' | 'Waitlist';
  seats_available?: number;
}

export interface TrainOption {
  id: string;
  train_number: string;
  train_name: string;
  origin_station: string;
  origin_code: string;
  destination_station: string;
  destination_code: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  runs_on: string;
  classes: TrainClassInfo[];
  booking_provider: string;
  booking_url: string;
}

export interface BusOption {
  id: string;
  operator: string;
  bus_type: string;
  origin_city: string;
  boarding_point: string;
  destination_city: string;
  dropping_point: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  rating: number;
  seats_available: number;
  fare: number;
  currency: string;
  booking_provider: string;
  booking_url: string;
}

export interface TransitSearchResult {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  currency: string;
  is_live: boolean;
  data_source: string;
  availability_status: string;
  booking_note: string;
  flights: FlightOption[];
  trains: TrainOption[];
  buses: BusOption[];
}

