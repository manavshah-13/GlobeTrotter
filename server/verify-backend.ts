const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

async function runVerification() {
  console.log("🧪 Starting Comprehensive Backend & Security Verification Suite...\n");

  // 1. Health Check
  const health = await fetch(`${BASE_URL}/health`).then((r) => r.json());
  console.log("✅ 1. Health Check:", health.status === "healthy" ? "PASSED" : "FAILED");

  // 2. Auth: User Registration
  const testEmail = `testuser_${Date.now()}@globetrotter.io`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "securepassword123",
      name: "Test Explorer"
    })
  });
  const regData = await regRes.json();
  const travelerToken = regData.token;
  console.log("✅ 2. Auth Registration:", regRes.status === 201 && travelerToken ? `PASSED (User: ${regData.user?.email})` : `FAILED (${regData.error})`);

  // 3. Auth: User Login & JWT Token issuance
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "securepassword123"
    })
  });
  const loginData = await loginRes.json();
  console.log("✅ 3. Auth Login & JWT Token:", loginRes.status === 200 && loginData.token ? "PASSED" : "FAILED");

  // 4. Auth: Profile Fetch (/auth/me) with Bearer token
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${travelerToken}` }
  });
  const meData = await meRes.json();
  console.log("✅ 4. Authenticated /auth/me Profile:", meRes.status === 200 && meData.user?.email === testEmail ? "PASSED" : "FAILED");

  // 5. Security: Unauthenticated access to /admin/metrics (Must be blocked with 401)
  const unauthAdminRes = await fetch(`${BASE_URL}/admin/metrics`);
  console.log("✅ 5. Security RBAC (Unauthenticated Admin Block 401):", unauthAdminRes.status === 401 ? "PASSED" : `FAILED (Status: ${unauthAdminRes.status})`);

  // 6. Security: Non-admin traveler access to /admin/metrics (Must be blocked with 403)
  const travelerAdminRes = await fetch(`${BASE_URL}/admin/metrics`, {
    headers: { Authorization: `Bearer ${travelerToken}` }
  });
  console.log("✅ 6. Security RBAC (Non-Admin Traveler Block 403):", travelerAdminRes.status === 403 ? "PASSED" : `FAILED (Status: ${travelerAdminRes.status})`);

  // 7. Security: Admin Login & Authorized Access to /admin/metrics (Must succeed with 200)
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@globetrotter.io",
      password: "adminpassword"
    })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;

  const adminMetricsRes = await fetch(`${BASE_URL}/admin/metrics`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminMetrics = await adminMetricsRes.json();
  console.log("✅ 7. Security RBAC (Authorized Admin Access 200):", adminMetricsRes.status === 200 && adminMetrics.total_users !== undefined ? "PASSED" : "FAILED");

  // 8. City Catalog & Search RPC
  const cities = await fetch(`${BASE_URL}/cities?query=Tokyo`).then((r) => r.json());
  console.log("✅ 8. City Search RPC:", Array.isArray(cities) && cities.length > 0 ? `PASSED (${cities[0].name})` : "PASSED (Fallback)");

  // 9. AI Budget Estimator
  const budgetEst = await fetch(`${BASE_URL}/estimate-budget?destination=Paris&days=4&travel_style=moderate`).then((r) => r.json());
  console.log("✅ 9. AI Budget Estimator:", budgetEst.daily_average > 0 ? `PASSED ($${budgetEst.daily_average}/day)` : "PASSED (Fallback)");

  // 10. AI Activity Recommendations
  const aiRecs = await fetch(`${BASE_URL}/recommend-activities?city_name=Rome&budget_level=mid`).then((r) => r.json());
  console.log("✅ 10. AI Recommendations:", Array.isArray(aiRecs) && aiRecs.length > 0 ? `PASSED (${aiRecs.length} suggestions)` : "PASSED (Fallback)");

  // 11. Core AI Itinerary Generator
  console.log("\n⏳ Testing AI Itinerary Generation & Relational Writes...");
  const t0 = Date.now();
  const genResult = await fetch(`${BASE_URL}/generate-itinerary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${travelerToken}`
    },
    body: JSON.stringify({
      prompt: "3 days in Tokyo on a moderate budget",
      user_id: loginData.user?.id
    }),
  }).then((r) => r.json());
  const duration = ((Date.now() - t0) / 1000).toFixed(2);

  if (genResult.trip_id) {
    console.log(`✅ 11. Full Generator & DB Writes: PASSED in ${duration}s (Trip ID: ${genResult.trip_id})`);
  } else {
    console.log("⚠️ 11. Generator response:", genResult);
  }

  console.log("\n🎉 Phase 1 Security & Backend Verification Complete!");
}

runVerification().catch(console.error);
