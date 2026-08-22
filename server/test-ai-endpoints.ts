import dotenv from 'dotenv';
import {
  generateItineraryWithAI,
  recommendActivitiesWithAI,
  estimateBudgetWithAI,
  generateAdminInsightWithAI
} from './src/services/geminiService.js';
import {
  insertFullItinerary,
  fetchRecentTripsSummary
} from './src/services/supabaseService.js';

dotenv.config();

process.env.TEST_SUITE_RUNNING = 'true';

interface TestResult {
  scenario: string;
  prompt: string;
  latencyMs: number;
  success: boolean;
  tripId?: string;
  stopCount?: number;
  activitiesCount?: number;
  error?: string;
}

const SCENARIOS = [
  {
    name: 'Scenario 1: Multi-city fixed budget',
    prompt: '5 days in Tokyo and Kyoto on a $2000 budget',
    startDate: '2026-09-01'
  },
  {
    name: 'Scenario 2: Backpacking',
    prompt: '10 days backpacking Thailand, shoestring budget',
    startDate: '2026-10-15'
  },
  {
    name: 'Scenario 3: Weekend getaway',
    prompt: '3 days in Paris, luxury romantic style',
    startDate: '2026-11-20'
  },
  {
    name: 'Scenario 4: Vague prompt',
    prompt: 'A 4-day culinary trip in Italy',
    startDate: undefined
  }
];

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('✈️  GLOBETROTTER AI ENDPOINTS & LATENCY TEST SUITE');
  console.log('===============================================================\n');

  const results: TestResult[] = [];

  for (let i = 0; i < SCENARIOS.length; i++) {
    const sc = SCENARIOS[i];
    console.log(`[Test ${i + 1}/${SCENARIOS.length}] ${sc.name}`);
    console.log(`> Prompt: "${sc.prompt}"`);

    const startTime = Date.now();
    try {
      // 1. Generate Itinerary via Gemini
      const plan = await generateItineraryWithAI(sc.prompt, sc.startDate);

      // 2. Insert directly into Supabase (or relational mock fallback)
      const dbResult = await insertFullItinerary(plan, `test-user-${i + 1}`, sc.startDate);

      const latencyMs = Date.now() - startTime;
      const totalActivities = dbResult.stops.reduce((acc, s) => acc + (s.activities?.length || 0), 0);

      console.log(`  ✅ Success! Trip ID: ${dbResult.trip_id}`);
      console.log(`  ⏱️  Latency: ${latencyMs} ms (Target < 5000 ms: ${latencyMs < 5000 ? 'PASSED ⚡' : 'WARN 🐢'})`);
      console.log(`  📍 Stops: ${dbResult.stops.length} cities | 🎡 Total Activities: ${totalActivities}`);
      console.log(`  🏙️  Cities created/matched: ${dbResult.cities_created}`);
      console.log('---------------------------------------------------------------');

      results.push({
        scenario: sc.name,
        prompt: sc.prompt,
        latencyMs,
        success: true,
        tripId: dbResult.trip_id,
        stopCount: dbResult.stops.length,
        activitiesCount: totalActivities
      });
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      console.error(`  ❌ Failed: ${(err as Error).message}`);
      results.push({
        scenario: sc.name,
        prompt: sc.prompt,
        latencyMs,
        success: false,
        error: (err as Error).message
      });
    }
  }

  // Test Endpoint 2: Smart Activity Recommendation
  console.log('\n[Test 5/7] Smart Activity Recommendation Endpoint');
  try {
    const recStart = Date.now();
    const recs = await recommendActivitiesWithAI('Kyoto', 'budget');
    const recLatency = Date.now() - recStart;
    console.log(`  ✅ Returned ${recs.recommendations.length} recommendations in ${recLatency} ms`);
    console.log(`  Sample 1: "${recs.recommendations[0]?.name}" (${recs.recommendations[0]?.reason})`);
  } catch (e) {
    console.error(`  ❌ Recommendation endpoint test failed: ${(e as Error).message}`);
  }

  // Test Endpoint 3: Budget Estimator
  console.log('\n[Test 6/7] Budget Estimator Endpoint');
  try {
    const bStart = Date.now();
    const budget = await estimateBudgetWithAI('Paris', 3, 'luxury');
    const bLatency = Date.now() - bStart;
    console.log(`  ✅ Estimated daily average: $${budget.daily_average} ${budget.currency} in ${bLatency} ms`);
    console.log(`  Breakdown: Accom: $${budget.breakdown.accommodation}, Food: $${budget.breakdown.food}, Activities: $${budget.breakdown.activities}, Transport: $${budget.breakdown.transport}`);
  } catch (e) {
    console.error(`  ❌ Budget estimator test failed: ${(e as Error).message}`);
  }

  // Test Endpoint 4: Admin Insight Engine
  console.log('\n[Test 7/7] Admin Insight Engine Endpoint');
  try {
    const aStart = Date.now();
    const recent = await fetchRecentTripsSummary(5);
    const insight = await generateAdminInsightWithAI(recent);
    const aLatency = Date.now() - aStart;
    console.log(`  ✅ Insight generated in ${aLatency} ms:`);
    console.log(`  💡 "${insight.insight}"`);
  } catch (e) {
    console.error(`  ❌ Admin insight test failed: ${(e as Error).message}`);
  }

  // Final Summary Table
  console.log('\n===============================================================');
  console.log('📊 TEST SUITE SUMMARY RESULT');
  console.log('===============================================================');
  console.table(
    results.map((r) => ({
      Scenario: r.scenario,
      'Latency (ms)': r.latencyMs,
      'Target < 5s': r.latencyMs < 5000 ? 'PASS' : 'WARN',
      Stops: r.stopCount || 0,
      Activities: r.activitiesCount || 0,
      Status: r.success ? 'PASSED' : 'FAILED'
    }))
  );
  console.log('===============================================================\n');
}

runTestSuite();
