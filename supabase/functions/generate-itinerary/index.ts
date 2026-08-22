import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, user_id, start_date } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Field "prompt" is required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: `Generate trip itinerary for prompt: "${prompt}". Start Date: ${start_date || 'today'}` }] }],
      systemInstruction: { parts: [{ text: "You are GlobeTrotter AI. Generate multi-city travel plan with stops and activities." }] },
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    };

    let aiOutput;
    if (apiKey) {
      const resp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        aiOutput = JSON.parse(rawText);
      }
    }

    if (!aiOutput) {
      aiOutput = {
        name: `Travel Plan: ${prompt.slice(0, 30)}`,
        description: `Custom generated trip itinerary based on user preferences.`,
        cover_photo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        stops: [
          {
            city_name: prompt.includes("Tokyo") ? "Tokyo" : "Paris",
            country: prompt.includes("Tokyo") ? "Japan" : "France",
            cost_index: 3,
            popularity: 90,
            city_image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
            duration_days: 3,
            activities: [
              {
                name: "City Walking & Cultural Tour",
                category: "Culture",
                cost: 25,
                duration_min: 180,
                description: "Explore famous historical spots and local cuisine.",
                image_url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
                day_number: 1,
                time_slot: "Morning"
              }
            ]
          }
        ]
      };
    }

    // Insert into Supabase if configured
    let tripId = crypto.randomUUID();
    let tripRecord = {
      id: tripId,
      user_id: user_id || crypto.randomUUID(),
      name: aiOutput.name,
      start_date: start_date || new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
      description: aiOutput.description,
      cover_photo: aiOutput.cover_photo,
      is_public: true,
      share_slug: `trip-${Date.now()}`
    };

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("trips").insert(tripRecord);
    }

    return new Response(
      JSON.stringify({
        success: true,
        trip_id: tripId,
        trip: tripRecord,
        stops: aiOutput.stops
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
