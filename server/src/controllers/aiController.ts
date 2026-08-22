import { Request, Response } from 'express';
import {
  generateItineraryWithAI,
  recommendActivitiesWithAI,
  estimateBudgetWithAI,
  generateAdminInsightWithAI
} from '../services/geminiService.js';
import {
  insertFullItinerary,
  fetchRecentTripsSummary
} from '../services/supabaseService.js';

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
    const dbResult = await insertFullItinerary(aiPlan, userId, start_date);

    const latencyMs = Date.now() - startTime;

    res.status(200).json({
      success: true,
      latency_ms: latencyMs,
      trip_id: dbResult.trip_id,
      trip: dbResult.trip,
      stops: dbResult.stops,
      meta: {
        cities_created: dbResult.cities_created,
        activities_created: dbResult.activities_created
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
