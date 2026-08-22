import express, { Router } from "express";
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

const apiRouter = Router();

// Health Check
apiRouter.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// --- AI Automation Endpoints ---
apiRouter.post("/generate-itinerary", generateItineraryHandler);
apiRouter.all("/recommend-activities", recommendActivitiesHandler);
apiRouter.all("/estimate-budget", estimateBudgetHandler);
apiRouter.all("/admin-insight", adminInsightHandler);

// --- Core Backend Endpoints ---
apiRouter.get("/trips", getUserTrips);
apiRouter.post("/trips", createTripManual);
apiRouter.get("/trips/:id", getTripDetails);
apiRouter.delete("/trips/:id", deleteTrip);
apiRouter.get("/trips/:id/budget", getTripBudget);
apiRouter.post("/trips/copy", copyTripHandler);

apiRouter.post("/stops", addStop);
apiRouter.post("/stops/reorder", reorderStops);
apiRouter.delete("/stops/:id", removeStop);

apiRouter.post("/trip-activities", assignActivityToStop);
apiRouter.delete("/trip-activities/:id", removeActivityFromStop);

apiRouter.get("/cities", getCityCatalog);
apiRouter.get("/activities", getActivityCatalog);
apiRouter.get("/admin/metrics", getAdminMetrics);

// Mount router on BOTH `/api` and `/` so all rewrite configurations work seamlessly
app.use("/api", apiRouter);
app.use("/", apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Unified Backend listening on port ${PORT}`);
});