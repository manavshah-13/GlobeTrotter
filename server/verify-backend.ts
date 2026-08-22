const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

async function runVerification() {
  console.log("🧪 Starting Backend Verification Suite...\n");

  // 1. Health Check
  const health = await fetch(`${BASE_URL}/health`).then((r) => r.json());
  console.log("✅ 1. Health Check:", health.status === "healthy" ? "PASSED" : "FAILED");

  // 2. City Catalog & Search RPC
  const cities = await fetch(`${BASE_URL}/cities?query=Tokyo`).then((r) => r.json());
  console.log("✅ 2. City Search RPC:", Array.isArray(cities) && cities.length > 0 ? `PASSED (${cities[0].name})` : "FAILED");

  // 3. Activity Catalog & Filter RPC
  const activities = await fetch(`${BASE_URL}/activities?category=food`).then((r) => r.json());
  console.log("✅ 3. Activity Filter RPC:", Array.isArray(activities) && activities.length > 0 ? `PASSED (${activities.length} items found)` : "FAILED");

  // 4. AI Budget Estimator
  const budgetEst = await fetch(`${BASE_URL}/estimate-budget?destination=Paris&days=4&travel_style=moderate`).then((r) => r.json());
  console.log("✅ 4. AI Budget Estimator:", budgetEst.daily_average > 0 ? `PASSED ($${budgetEst.daily_average}/day)` : "FAILED");

  // 5. AI Activity Recommendations
  const aiRecs = await fetch(`${BASE_URL}/recommend-activities?city_name=Rome&budget_level=mid`).then((r) => r.json());
  console.log("✅ 5. AI Recommendations:", Array.isArray(aiRecs) && aiRecs.length > 0 ? `PASSED (${aiRecs.length} suggestions)` : "FAILED");

  // 6. Admin Analytics RPC & AI Trend Insight
  const adminMetrics = await fetch(`${BASE_URL}/admin/metrics`).then((r) => r.json());
  const adminInsight = await fetch(`${BASE_URL}/admin-insight`).then((r) => r.json());
  console.log("✅ 6. Admin Metrics & Insight:", adminMetrics.total_trips !== undefined && adminInsight.insight ? "PASSED" : "FAILED");

  // 7. Core AI Itinerary Generator + Supabase Relational Inserts
  console.log("\n⏳ Testing AI Itinerary Generation & DB Writes (target < 5s)...");
  const t0 = Date.now();
  const genResult = await fetch(`${BASE_URL}/generate-itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "3 days in Tokyo on a moderate budget",
      user_id: "00000000-0000-0000-0000-000000000000", // Fallback test UUID
    }),
  }).then((r) => r.json());
  const duration = ((Date.now() - t0) / 1000).toFixed(2);

  if (genResult.trip_id) {
    console.log(`✅ 7. Full Generator & DB Writes: PASSED in ${duration}s (Trip ID: ${genResult.trip_id})`);

    // 8. Trip Budget Aggregation RPC
    const budgetSummary = await fetch(`${BASE_URL}/trips/${genResult.trip_id}/budget`).then((r) => r.json());
    console.log("✅ 8. Trip Budget Summary RPC:", budgetSummary.total_cost !== undefined ? `PASSED (Calculated Total: $${budgetSummary.total_cost})` : "FAILED");
  } else {
    console.log("❌ 7. Full Generator Failed:", genResult);
  }

  console.log("\n🎉 Verification Complete!");
}

runVerification().catch(console.error);
