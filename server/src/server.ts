import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  generateItineraryHandler,
  recommendActivitiesHandler,
  estimateBudgetHandler,
  adminInsightHandler,
} from "./controllers/aiController.js";

import {
  getUserTrips,
  createTripManual,
  getTripDetails,
  deleteTrip,
  addStop,
  reorderStops,
  removeStop,
  assignActivityToStop,
  removeActivityFromStop,
  getCityCatalog,
  getActivityCatalog,
  copyTripHandler,
  getTripBudget,
  getAdminMetrics,
} from "./controllers/backendController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// --- AI Automation Endpoints ---
app.post("/api/generate-itinerary", generateItineraryHandler);
app.all("/api/recommend-activities", recommendActivitiesHandler);
app.all("/api/estimate-budget", estimateBudgetHandler);
app.all("/api/admin-insight", adminInsightHandler);

// --- Core Backend Endpoints ---
app.get("/api/trips", getUserTrips);
app.post("/api/trips", createTripManual);
app.get("/api/trips/:id", getTripDetails);
app.delete("/api/trips/:id", deleteTrip);
app.get("/api/trips/:id/budget", getTripBudget);
app.post("/api/trips/copy", copyTripHandler);

app.post("/api/stops", addStop);
app.post("/api/stops/reorder", reorderStops);
app.delete("/api/stops/:id", removeStop);

app.post("/api/trip-activities", assignActivityToStop);
app.delete("/api/trip-activities/:id", removeActivityFromStop);

app.get("/api/cities", getCityCatalog);
app.get("/api/activities", getActivityCatalog);
app.get("/api/admin/metrics", getAdminMetrics);

app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Unified Backend listening on port ${PORT}`);
});