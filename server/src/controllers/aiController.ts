import { Request, Response } from 'express';
import {
  generateItineraryWithAI,
  recommendActivitiesWithAI,
  estimateBudgetWithAI,
  generateAdminInsightWithAI,
  isIndianDestination
} from '../services/geminiService.js';
import {
  insertFullItinerary,
  fetchRecentTripsSummary,
  sanitizeAndNormalizeActivityCost
} from '../services/supabaseService.js';
import { memoryTrips } from './backendController.js';

/**
 * Task 3 & 4: /api/generate-itinerary
 * Input: { prompt: string, user_id: string, start_date?: string }
 */
export async function generateItineraryHandler(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  try {
    const { prompt, user_id, start_date } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ error: 'Field "prompt" is required and must be a non-empty string.' });
      return;
    }

    const userId = user_id || 'guest-user-123';

    // 1. Generate multi-city itinerary via Gemini AI
    const aiPlan = await generateItineraryWithAI(prompt.trim(), start_date);

    // 2. Insert into Supabase relational tables
    let dbResult;
    try {
      dbResult = await insertFullItinerary(aiPlan, userId, start_date);
    } catch (e) {
      console.warn('[AIController] Supabase insert failed, using memory fallback:', (e as Error).message);
    }

    const tripId = dbResult?.trip_id || `ai-trip-${Date.now()}`;
    const startStr = start_date || new Date().toISOString().split("T")[0];
    const dayMatch = (prompt || '').match(/(\d+)\s*-?\s*day/i) || (aiPlan.name || '').match(/(\d+)\s*-?\s*day/i);
    const parsedDays = dayMatch ? parseInt(dayMatch[1], 10) : null;
    const totalDays = parsedDays || aiPlan.trip?.total_days || (aiPlan.stops || []).reduce((acc, s) => acc + (s.duration_days || 1), 0) || 4;
    const endDate = new Date(startStr);
    endDate.setDate(endDate.getDate() + totalDays);

    const tripName = aiPlan.trip?.name || aiPlan.name || "AI Generated Trip";
    const tripDesc = aiPlan.trip?.description || aiPlan.description || "Custom AI trip itinerary";
    const coverPhoto = aiPlan.trip?.cover_photo_url || aiPlan.cover_photo || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
    const isIndia = isIndianDestination(prompt) || isIndianDestination(aiPlan.name);

    const formattedTrip = {
      id: tripId,
      user_id: userId,
      name: tripName,
      description: tripDesc,
      start_date: startStr,
      end_date: endDate.toISOString().split("T")[0],
      cover_photo_url: coverPhoto,
      is_public: true,
      public_slug: `${tripName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`,
      stops: (aiPlan.stops || []).map((s, idx) => {
        const stopIsIndia = isIndia || isIndianDestination(s.city_name) || s.country === 'India';
        const stopActs = s.activities || [];
        const actsPerDay = Math.max(1, Math.ceil(stopActs.length / totalDays));

        return {
          id: `stop-${idx + 1}-${Date.now()}`,
          trip_id: tripId,
          order_index: s.order_index ?? idx,
          city_name: s.city_name,
          country: s.country || (stopIsIndia ? "India" : "Global"),
          start_date: startStr,
          end_date: endDate.toISOString().split("T")[0],
          cities: { name: s.city_name, country: s.country || (stopIsIndia ? "India" : "Global") },
          trip_activities: stopActs.map((a, aIdx) => {
            const fallbackDay = Math.floor(aIdx / actsPerDay) + 1;
            const clampedDay = Math.min(totalDays, Math.max(1, a.day_number || fallbackDay));
            const normCost = sanitizeAndNormalizeActivityCost(a.cost, stopIsIndia, a.currency || aiPlan.currency);

            return {
              id: `act-${idx}-${aIdx}-${Date.now()}`,
              custom_name: a.name,
              category: (a.category || "activity").toLowerCase(),
              cost: normCost,
              order_index: aIdx,
              scheduled_time: a.time_slot || "10:00",
              description: a.description,
              day_number: clampedDay
            };
          })
        };
      })
    };

    memoryTrips.set(tripId, formattedTrip);

    const latencyMs = Date.now() - startTime;

    res.status(200).json({
      success: true,
      latency_ms: latencyMs,
      trip_id: tripId,
      trip: formattedTrip,
      stops: formattedTrip.stops,
      meta: {
        cities_created: formattedTrip.stops.length,
        activities_created: formattedTrip.stops.reduce((acc, st) => acc + st.trip_activities.length, 0)
      }
    });
  } catch (error) {
    console.error('[AIController] Error in generateItineraryHandler:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      message: (error as Error).message
    });
  }
}

/**
 * Task 5: /api/recommend-activities
 * Input: { city_name: string, budget_level: string }
 */
export async function recommendActivitiesHandler(req: Request, res: Response): Promise<void> {
  try {
    const cityName = (req.body?.city_name || req.query?.city_name || '').toString().trim();
    const budgetLevel = (req.body?.budget_level || req.query?.budget_level || 'budget').toString().trim();

    if (!cityName) {
      res.status(400).json({ error: 'Field "city_name" is required.' });
      return;
    }

    const recommendations = await recommendActivitiesWithAI(cityName, budgetLevel);

    res.status(200).json(recommendations.recommendations);
  } catch (error) {
    console.error('[AIController] Error in recommendActivitiesHandler:', error);
    res.status(500).json({
      error: 'Failed to recommend activities',
      message: (error as Error).message
    });
  }
}

/**
 * Task 6: /api/estimate-budget
 * Input: { destination: string, days: number, travel_style: string }
 */
export async function estimateBudgetHandler(req: Request, res: Response): Promise<void> {
  try {
    const destination = (req.body?.destination || req.query?.destination || '').toString().trim();
    const daysRaw = req.body?.days || req.query?.days || 3;
    const travelStyle = (req.body?.travel_style || req.query?.travel_style || 'moderate').toString().trim();

    if (!destination) {
      res.status(400).json({ error: 'Field "destination" is required.' });
      return;
    }

    const days = Math.max(1, parseInt(daysRaw, 10) || 1);

    const budgetEstimate = await estimateBudgetWithAI(destination, days, travelStyle);

    res.status(200).json(budgetEstimate);
  } catch (error) {
    console.error('[AIController] Error in estimateBudgetHandler:', error);
    res.status(500).json({
      error: 'Failed to estimate budget',
      message: (error as Error).message
    });
  }
}

/**
 * Task 8: /api/admin-insight
 * Queries recent trips from Supabase and prompts Gemini for a trend sentence.
 */
export async function adminInsightHandler(req: Request, res: Response): Promise<void> {
  try {
    // 1. Query Supabase
    const recentTrips = await fetchRecentTripsSummary(15);

    // 2. Generate insight via Gemini
    const result = await generateAdminInsightWithAI(recentTrips);

    res.status(200).json(result);
  } catch (error) {
    console.error('[AIController] Error in adminInsightHandler:', error);
    res.status(500).json({
      error: 'Failed to generate admin insight',
      message: (error as Error).message
    });
  }
}
