import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  generateItineraryHandler,
  recommendActivitiesHandler,
  estimateBudgetHandler,
  adminInsightHandler
} from './controllers/aiController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'GlobeTrotter AI Backend', timestamp: new Date().toISOString() });
});

// AI API Routes
app.post('/api/generate-itinerary', generateItineraryHandler);
app.get('/api/generate-itinerary', generateItineraryHandler);

app.post('/api/recommend-activities', recommendActivitiesHandler);
app.get('/api/recommend-activities', recommendActivitiesHandler);

app.post('/api/estimate-budget', estimateBudgetHandler);
app.get('/api/estimate-budget', estimateBudgetHandler);

app.post('/api/admin-insight', adminInsightHandler);
app.get('/api/admin-insight', adminInsightHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Start Server if directly invoked
if (process.env.NODE_ENV !== 'test' && !process.env.TEST_SUITE_RUNNING) {
  app.listen(PORT, () => {
    console.log(`🚀 GlobeTrotter AI Backend running on http://localhost:${PORT}`);
    console.log(`- POST/GET /api/generate-itinerary`);
    console.log(`- POST/GET /api/recommend-activities`);
    console.log(`- POST/GET /api/estimate-budget`);
    console.log(`- POST/GET /api/admin-insight`);
  });
}

export default app;
