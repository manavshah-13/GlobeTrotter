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
                cost: { type: "number", description: "Estimated cost in USD" },
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
