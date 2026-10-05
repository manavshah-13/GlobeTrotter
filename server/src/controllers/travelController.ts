import { Request, Response } from 'express';
import {
  parseTravelIntentWithAI,
  getTravelTimingWithAI,
  getComprehensiveBudget,
  searchTransportationService
} from '../services/travelService.js';
import {
  findUserByEmail,
  createUser,
  generateToken,
  UserPayload
} from '../services/authService.js';
import { handleAIAssistantQuestion } from '../services/aiAssistantService.js';

// General AI Travel Assistant Endpoint
export async function askAssistantHandler(req: Request, res: Response): Promise<void> {
  try {
    const { question, conversation_history, user_id, context } = req.body || {};
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ error: 'Field "question" is required and must be a non-empty string.' });
      return;
    }

    const response = await handleAIAssistantQuestion({
      question: question.trim(),
      conversation_history: conversation_history || [],
      user_id: user_id || (req as any).user?.id,
      context: context || {}
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('[travelController] Error in askAssistantHandler:', error);
    res.status(500).json({
      error: 'Failed to process travel assistant question',
      message: (error as Error).message
    });
  }
}

// 1. Natural Language Travel Intent Parser
export async function parseIntentHandler(req: Request, res: Response): Promise<void> {
  try {
    const { query, user_profile } = req.body || {};
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Field "query" is required as a string.' });
      return;
    }

    const parsed = await parseTravelIntentWithAI(query, user_profile);
    res.status(200).json(parsed);
  } catch (error) {
    console.error('[travelController] Error in parseIntentHandler:', error);
    res.status(500).json({ error: 'Failed to parse travel intent', message: (error as Error).message });
  }
}

// 2. Travel Timing Recommendations
export async function travelTimingHandler(req: Request, res: Response): Promise<void> {
  try {
    const destination = (req.body?.destination || req.query?.destination || '').toString().trim();
    if (!destination) {
      res.status(400).json({ error: 'Field "destination" is required.' });
      return;
    }

    const timing = await getTravelTimingWithAI(destination);
    res.status(200).json(timing);
  } catch (error) {
    console.error('[travelController] Error in travelTimingHandler:', error);
    res.status(500).json({ error: 'Failed to retrieve travel timing', message: (error as Error).message });
  }
}

// 3. Itemized Comprehensive Cost Estimator
export async function comprehensiveBudgetHandler(req: Request, res: Response): Promise<void> {
  try {
    const { origin, destination, days, travelers, travel_style, transport_type } = req.body || req.query || {};
    if (!destination) {
      res.status(400).json({ error: 'Field "destination" is required.' });
      return;
    }

    const budget = await getComprehensiveBudget({
      origin: origin?.toString(),
      destination: destination.toString(),
      days: days ? parseInt(days.toString(), 10) : undefined,
      travelers: travelers ? parseInt(travelers.toString(), 10) : undefined,
      travel_style: travel_style?.toString(),
      transport_type: transport_type?.toString()
    });

    res.status(200).json(budget);
  } catch (error) {
    console.error('[travelController] Error in comprehensiveBudgetHandler:', error);
    res.status(500).json({ error: 'Failed to compute comprehensive budget', message: (error as Error).message });
  }
}

// 4. Transportation Search (Flights, Trains, Buses)
export async function transportSearchHandler(req: Request, res: Response): Promise<void> {
  try {
    const origin = (req.body?.origin || req.query?.origin || 'Ahmedabad').toString();
    const destination = (req.body?.destination || req.query?.destination || 'Delhi').toString();
    const date = (req.body?.date || req.query?.date || '').toString();
    const passengers = req.body?.passengers || req.query?.passengers ? parseInt((req.body?.passengers || req.query?.passengers).toString(), 10) : 1;

    const results = searchTransportationService({ origin, destination, date, passengers });
    res.status(200).json(results);
  } catch (error) {
    console.error('[travelController] Error in transportSearchHandler:', error);
    res.status(500).json({ error: 'Failed to search transportation', message: (error as Error).message });
  }
}

// 5. One-Click Google Authentication Handler
export async function googleAuthHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, avatar, city, country, travel_style, budget_tier, preferences } = req.body || {};
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Valid Google email is required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await findUserByEmail(cleanEmail);

    if (!user) {
      user = await createUser({
        email: cleanEmail,
        password: `google_oauth_${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        city: city || 'Ahmedabad',
        country: country || 'India',
        role: 'traveler'
      });
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      city: user.city,
      country: user.country,
      avatar: avatar || user.avatar || user.name.slice(0, 2).toUpperCase(),
      created_at: user.created_at
    };

    const token = generateToken(userPayload);

    res.status(200).json({
      success: true,
      user: {
        ...userPayload,
        travel_style: travel_style || ['Balanced', 'Cultural'],
        budget_tier: budget_tier || 'Moderate',
        preferences: preferences || ['Sightseeing', 'Food']
      },
      token
    });
  } catch (error) {
    console.error('[travelController] Error in googleAuthHandler:', error);
    res.status(500).json({ error: 'Google authentication failed', message: (error as Error).message });
  }
}
