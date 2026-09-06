import { createClient } from "@supabase/supabase-js";
import { ItineraryResponse } from "../types/ai-schemas.js";
import { isIndianDestination } from "./geminiService.js";

const supabaseUrl = process.env.SUPABASE_URL || "https://mock.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "mock-key";

const _supabase = createClient(supabaseUrl, supabaseServiceKey);

const isMock = !process.env.SUPABASE_URL;

export function sanitizeAndNormalizeActivityCost(
  rawCost: number | undefined | null,
  isIndia: boolean,
  currency?: string
): number {
  let cost = Number(rawCost) || 0;
  if (cost < 0) cost = 0;

  const isINR = currency === 'INR' || (isIndia && cost > 50);

  if (isINR) {
    // Sanitize any extreme outlier spikes in domestic activities
    if (cost > 5000) {
      cost = 2500;
    }
    // Normalize INR to base USD (CurrencyContext rate: 83.5)
    return Math.round((cost / 83.5) * 100) / 100;
  }

  // Already USD
  if (cost > 500) {
    cost = 150;
  }
  return Math.round(cost * 100) / 100;
}

export function toValidUUID(id: string): string | null {
  if (!id) return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  return null;
}

export const supabase = isMock
  ? (new Proxy(_supabase, {
      get(target, prop) {
        if (prop === "rpc") {
          return async (rpcName: string) => {
            if (rpcName === "search_cities") return { data: [{ id: "c1", name: "Tokyo", country: "Japan" }], error: null };
            if (rpcName === "search_activities") return { data: [{ id: "a1", name: "Food Tour", category: "food" }], error: null };
            if (rpcName === "get_admin_analytics") return { data: { total_trips: 42, active_users: 10 }, error: null };
            if (rpcName === "get_trip_budget_summary") return { data: { total_cost: 1200 }, error: null };
            return { data: null, error: null };
          };
        }
        if (prop === "from") {
          return () => ({
            select: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [] }),
              }),
            }),
          });
        }
        return target[prop as keyof typeof target];
      },
    }) as any)
  : _supabase;

export async function insertFullItinerary(
  parsed: ItineraryResponse,
  userId: string,
  startDateStr?: string
) {
  if (isMock) {
    return { trip_id: "mock-trip-123", trip: {}, stops: parsed.stops || [] };
  }

  const startDate = startDateStr ? new Date(startDateStr) : new Date();
  const dayMatch = (parsed.trip?.name || parsed.name || "").match(/(\d+)\s*-?\s*day/i);
  const parsedDays = dayMatch ? parseInt(dayMatch[1], 10) : null;
  const totalDays = parsedDays || parsed.trip?.total_days || (parsed.stops || []).reduce((acc: number, s: any) => acc + (s.duration_days || 1), 0) || 4;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays);

  const tripName = parsed.trip?.name || parsed.name || "Trip Expedition";
  const tripDesc = parsed.trip?.description || parsed.description || "";
  const coverPhotoUrl = parsed.trip?.cover_photo_url || parsed.cover_photo || "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
  const validUserId = toValidUUID(userId);

  const cleanSlug = `${tripName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")}-${Date.now().toString(36)}`;

  // 1. Insert Trip
  const { data: tripData, error: tripErr } = await supabase
    .from("trips")
    .insert({
      user_id: validUserId,
      name: tripName,
      description: tripDesc,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      is_public: true,
      public_slug: cleanSlug,
      cover_photo_url: coverPhotoUrl,
    })
    .select()
    .single();

  if (tripErr) throw new Error(`Failed to insert trip: ${tripErr.message}`);

  // 2. Iterate Stops and Insert
  for (let sIdx = 0; sIdx < (parsed.stops || []).length; sIdx++) {
    const stop = parsed.stops[sIdx];
    // Find or Create City
    let { data: city } = await supabase
      .from("cities")
      .select("id")
      .ilike("name", stop.city_name)
      .maybeSingle();

    if (!city) {
      const { data: newCity } = await supabase
        .from("cities")
        .insert({
          name: stop.city_name,
          country: stop.country || "Global",
          region: "International",
          cost_index: 1.0,
          image_url:
            stop.city_image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        })
        .select("id")
        .single();
      city = newCity;
    }

    const stopStart = new Date(startDate);
    stopStart.setDate(startDate.getDate() + ((stop.day_start || 1) - 1));
    const stopEnd = new Date(startDate);
    stopEnd.setDate(startDate.getDate() + ((stop.day_end || stop.day_start || (stop.duration_days || 1)) - 1));

    const { data: stopData, error: stopErr } = await supabase
      .from("stops")
      .insert({
        trip_id: tripData.id,
        city_id: city?.id,
        order_index: stop.order_index ?? sIdx,
        start_date: stopStart.toISOString().split("T")[0],
        end_date: stopEnd.toISOString().split("T")[0],
      })
      .select("id")
      .single();

    if (stopErr || !stopData) continue;

    // 3. Insert Activities & Link to Trip Stop
    const isIndia = isIndianDestination(parsed.name) || isIndianDestination(stop.city_name) || stop.country === 'India';
    for (let i = 0; i < (stop.activities || []).length; i++) {
      const act = stop.activities[i];
      const normalizedCost = sanitizeAndNormalizeActivityCost(act.cost, isIndia, act.currency || parsed.currency);

      // Catalog Activity Insert
      const { data: actData } = await supabase
        .from("activities")
        .insert({
          city_id: city?.id,
          name: act.name,
          category: (act.category || "activity").toLowerCase(),
          cost: normalizedCost,
          duration_minutes: act.duration_min || 60,
          description: act.description || "",
        })
        .select("id")
        .single();

      // Trip Activity Join Insert
      await supabase.from("trip_activities").insert({
        stop_id: stopData.id,
        activity_id: actData?.id || null,
        custom_name: act.name,
        category: (act.category || "activity").toLowerCase(),
        cost: normalizedCost,
        order_index: i,
        scheduled_time: act.time_slot || "10:00",
      });
    }
  }

  return { trip_id: tripData.id, trip: tripData, stops: parsed.stops };
}

export async function fetchRecentTripsSummary(limitCount: number = 8): Promise<string[]> {
  if (isMock) return ["Tokyo: 3 days", "Paris: 5 days"];
  const { data } = await supabase
    .from("trips")
    .select("name, description")
    .order("created_at", { ascending: false })
    .limit(limitCount);

  return (data || []).map((t: any) => `${t.name}: ${t.description || ""}`);
}