import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = req.method === "POST" ? await req.json() : {};
    const url = new URL(req.url);
    const destination = body.destination || url.searchParams.get("destination") || "Tokyo";
    const days = parseInt(body.days || url.searchParams.get("days") || "5", 10);
    const travelStyle = body.travel_style || url.searchParams.get("travel_style") || "moderate";

    const isLuxury = travelStyle.includes("luxury");
    const isShoestring = travelStyle.includes("shoestring") || travelStyle.includes("budget");

    let dailyAvg = 150;
    let breakdown = { accommodation: 80, food: 40, activities: 20, transport: 10 };

    if (isLuxury) {
      dailyAvg = 420;
      breakdown = { accommodation: 250, food: 100, activities: 50, transport: 20 };
    } else if (isShoestring) {
      dailyAvg = 45;
      breakdown = { accommodation: 20, food: 15, activities: 5, transport: 5 };
    }

    const output = {
      daily_average: dailyAvg,
      breakdown,
      currency: "USD"
    };

    return new Response(JSON.stringify(output), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
