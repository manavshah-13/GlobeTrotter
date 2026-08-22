import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "mock-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AI_API_BASE = process.env.VITE_AI_API_URL || process.env.AI_API_URL || "http://localhost:5000/api";

// 1. City Search & Filter
export async function searchCities(query = "", region = "", maxCost?: number) {
  let req = supabase.from("cities").select("*");
  if (query) req = req.ilike("name", `%${query}%`);
  if (region) req = req.eq("region", region);
  if (maxCost) req = req.lte("cost_index", maxCost);
  const { data, error } = await req.order("name");
  if (error) throw error;
  return data;
}

// 2. Activity Search & Filter
export async function searchActivities(cityId?: string, category?: string, maxCost?: number) {
  let req = supabase.from("activities").select("*, cities(name, country)");
  if (cityId) req = req.eq("city_id", cityId);
  if (category) req = req.ilike("category", category);
  if (maxCost !== undefined) req = req.lte("cost", maxCost);
  const { data, error } = await req.order("name");
  if (error) throw error;
  return data;
}

// 3. Full Trip By ID (Itinerary Builder & View)
export async function getFullTrip(tripId: string) {
  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      stops (
        id, order_index, start_date, end_date,
        cities (*),
        trip_activities (
          id, custom_name, category, cost, order_index, scheduled_time,
          activities (*)
        )
      )
    `)
    .eq("id", tripId)
    .order("order_index", { foreignTable: "stops", ascending: true })
    .single();

  if (error) throw error;
  return data;
}

// 4. Public Shared Itinerary by Slug
export async function getPublicTripBySlug(slug: string) {
  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      stops (
        id, order_index, start_date, end_date,
        cities (*),
        trip_activities (
          id, custom_name, category, cost, order_index,
          activities (*)
        )
      )
    `)
    .eq("public_slug", slug)
    .eq("is_public", true)
    .single();

  if (error) throw error;
  return data;
}

// 5. RPC: Deep-Copy Trip
export async function copyTrip(sourceTripId: string, targetUserId: string) {
  const { data, error } = await supabase.rpc("copy_trip", {
    source_trip_id: sourceTripId,
    target_user_id: targetUserId,
  });
  if (error) throw error;
  return data; // Returns new trip UUID
}

// 6. RPC: Live Budget Summary
export async function getTripBudgetSummary(tripId: string) {
  const { data, error } = await supabase.rpc("get_trip_budget_summary", {
    trip_uuid: tripId,
  });
  if (error) throw error;
  return data; // Returns { total_cost: number, by_category: object }
}

// 7. RPC: Admin Analytics
export async function getAdminAnalytics() {
  const { data, error } = await supabase.rpc("get_admin_analytics");
  if (error) throw error;
  return data;
}

// 8. AI Endpoints Client
export async function generateAIItinerary(prompt: string, userId: string, startDate?: string) {
  const res = await fetch(`${AI_API_BASE}/generate-itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, user_id: userId, start_date: startDate }),
  });
  if (!res.ok) throw new Error("AI generation failed");
  return res.json();
}

export async function getAIRecommendations(cityName: string, budgetLevel: string) {
  const res = await fetch(`${AI_API_BASE}/recommend-activities?city_name=${encodeURIComponent(cityName)}&budget_level=${encodeURIComponent(budgetLevel)}`);
  if (!res.ok) throw new Error("Recommendation query failed");
  return res.json();
}

export async function getAIBudgetEstimate(destination: string, days: number, travelStyle: string) {
  const res = await fetch(`${AI_API_BASE}/estimate-budget?destination=${encodeURIComponent(destination)}&days=${days}&travel_style=${encodeURIComponent(travelStyle)}`);
  if (!res.ok) throw new Error("Budget estimation failed");
  return res.json();
}

export async function getAIAdminInsight() {
  const res = await fetch(`${AI_API_BASE}/admin-insight`);
  if (!res.ok) throw new Error("Admin insight failed");
  return res.json();
}