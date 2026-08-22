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
    const cityName = body.city_name || url.searchParams.get("city_name") || "Tokyo";
    const budgetLevel = body.budget_level || url.searchParams.get("budget_level") || "budget";

    const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
    let recommendations;

    if (apiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const resp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `Recommend 3-5 activities for ${cityName} on a ${budgetLevel} budget.` }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
        })
      });
      const data = await resp.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (raw) recommendations = JSON.parse(raw);
    }

    if (!recommendations) {
      recommendations = [
        {
          name: `${cityName} Historic District Tour`,
          category: "Culture",
          cost: budgetLevel.includes("budget") ? 0 : 25,
          duration_min: 120,
          reason: `Explore the vibrant history and culture of ${cityName} without stretching your ${budgetLevel} budget.`
        },
        {
          name: `${cityName} Street Food Alley Walk`,
          category: "Food",
          cost: 15,
          duration_min: 90,
          reason: "Taste authentic culinary specialties prepared live by local street artisans."
        },
        {
          name: `${cityName} Scenic Park & Landmark Viewpoint`,
          category: "Sightseeing",
          cost: 0,
          duration_min: 60,
          reason: "Enjoy stunning iconic views and relaxing scenery for free."
        }
      ];
    }

    const result = Array.isArray(recommendations) ? recommendations : (recommendations.recommendations || []);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
