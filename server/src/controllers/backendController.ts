import { Request, Response } from "express";
import { supabase } from "../services/supabaseService.js";

// --- TRIPS CRUD ---

export async function createTripManual(req: Request, res: Response) {
  try {
    const { user_id, name, description, start_date, end_date, cover_photo_url, is_public } = req.body;
    const cleanSlug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from("trips")
      .insert({
        user_id,
        name,
        description,
        start_date,
        end_date,
        cover_photo_url: cover_photo_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        is_public: is_public ?? false,
        public_slug: cleanSlug
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTripDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
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
      .eq("id", id)
      .order("order_index", { foreignTable: "stops", ascending: true })
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function deleteTrip(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Trip deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// --- STOPS CRUD ---

export async function addStop(req: Request, res: Response) {
  try {
    const { trip_id, city_id, start_date, end_date, order_index } = req.body;
    const { data, error } = await supabase
      .from("stops")
      .insert({ trip_id, city_id, start_date, end_date, order_index })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function reorderStops(req: Request, res: Response) {
  try {
    const { trip_id, stop_orders } = req.body;
    const { error } = await supabase.rpc("reorder_trip_stops", {
      p_trip_id: trip_id,
      p_stop_orders: stop_orders
    });

    if (error) throw error;
    res.json({ message: "Stops reordered successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeStop(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("stops").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Stop removed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// --- TRIP ACTIVITIES ---

export async function assignActivityToStop(req: Request, res: Response) {
  try {
    const { stop_id, activity_id, custom_name, category, cost, order_index } = req.body;
    const { data, error } = await supabase
      .from("trip_activities")
      .insert({
        stop_id,
        activity_id,
        custom_name,
        category: (category || "activity").toLowerCase(),
        cost: cost ?? 0,
        order_index: order_index ?? 0
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeActivityFromStop(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("trip_activities").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Activity unlinked successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// --- SEARCH & AGGREGATIONS ---

export async function getCityCatalog(req: Request, res: Response) {
  try {
    const { query, region, max_cost } = req.query;
    const { data, error } = await supabase.rpc("search_cities", {
      p_query: query ? String(query) : null,
      p_region: region ? String(region) : null,
      p_max_cost: max_cost ? Number(max_cost) : null
    });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getActivityCatalog(req: Request, res: Response) {
  try {
    const { city_id, category, max_cost, max_duration } = req.query;
    const { data, error } = await supabase.rpc("search_activities", {
      p_city_id: city_id ? String(city_id) : null,
      p_category: category ? String(category) : null,
      p_max_cost: max_cost ? Number(max_cost) : null,
      p_max_duration: max_duration ? Number(max_duration) : null
    });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function copyTripHandler(req: Request, res: Response) {
  try {
    const { source_trip_id, target_user_id } = req.body;
    const { data, error } = await supabase.rpc("copy_trip", {
      source_trip_id,
      target_user_id
    });

    if (error) throw error;
    res.json({ new_trip_id: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTripBudget(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.rpc("get_trip_budget_summary", {
      trip_uuid: id
    });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAdminMetrics(req: Request, res: Response) {
  try {
    const { data, error } = await supabase.rpc("get_admin_analytics");
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}