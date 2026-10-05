/**
 * Comprehensive Automated Regression Test Suite for GlobeTrotter AI Travel Assistant
 * Validates entity extraction, intent classification, multi-turn memory, date handling,
 * unknown destinations, currency conversions, and transportation disclaimers.
 */

import { classifyTravelIntentAndEntities, resolveRelativeDates, ConversationTurn } from '../services/intentClassifier.js';
import { handleAIAssistantQuestion } from '../services/aiAssistantService.js';
import { getDestinationProfile } from '../services/destinationCatalog.js';
import { searchTransportationService, getComprehensiveBudget } from '../services/travelService.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`, details || '');
    failed++;
  }
}

async function runRegressionSuite() {
  console.log('\n==================================================================');
  console.log('🧪 RUNNING GLOBETROTTER AI TRAVEL ASSISTANT REGRESSION SUITE');
  console.log('==================================================================\n');

  // -------------------------------------------------------------
  // TEST GROUP 1: Entity Extraction Precision
  // -------------------------------------------------------------
  console.log('--- Group 1: Entity Extraction Precision ---');
  {
    const r1 = classifyTravelIntentAndEntities('How much would a 5-day trip to Tokyo cost from India?');
    assert(r1.destination === 'Tokyo', 'Tokyo extracted as destination', r1);
    assert(r1.origin === 'India', 'India extracted as origin', r1);
    assert(r1.duration === 5, 'Duration is 5 days', r1);
    assert(r1.intent === 'COST_ESTIMATE', 'Intent is COST_ESTIMATE', r1);

    const r2 = classifyTravelIntentAndEntities('How do I travel from Ahmedabad to Goa?');
    assert(r2.destination === 'Goa', 'Goa extracted as destination', r2);
    assert(r2.origin === 'Ahmedabad', 'Ahmedabad extracted as origin', r2);
    assert(r2.intent === 'TRANSPORTATION', 'Intent is TRANSPORTATION', r2);

    const r3 = classifyTravelIntentAndEntities('What should I know before visiting Bali?');
    assert(r3.destination === 'Bali', 'Bali extracted as destination', r3);
    assert(r3.intent === 'TRAVEL_ADVICE', 'Intent is TRAVEL_ADVICE', r3);

    const r4 = classifyTravelIntentAndEntities('What places should I visit in Kyoto?');
    assert(r4.destination === 'Kyoto', 'Kyoto extracted as destination', r4);
    assert(r4.intent === 'DESTINATION_ACTIVITIES', 'Intent is DESTINATION_ACTIVITIES', r4);

    const r5 = classifyTravelIntentAndEntities('What is the best time to visit Switzerland?');
    assert(r5.destination === 'Switzerland', 'Switzerland extracted as destination', r5);
    assert(r5.intent === 'BEST_TIME_TO_VISIT', 'Intent is BEST_TIME_TO_VISIT', r5);
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: Edge-Case Intent Classification
  // -------------------------------------------------------------
  console.log('\n--- Group 2: Edge-Case Intent Classification ---');
  {
    const t1 = classifyTravelIntentAndEntities('Paris?');
    assert(t1.intent === 'DESTINATION_OVERVIEW', '"Paris?" -> DESTINATION_OVERVIEW', t1.intent);

    const t2 = classifyTravelIntentAndEntities('Paris travel guide');
    assert(t2.intent === 'DESTINATION_OVERVIEW', '"Paris travel guide" -> DESTINATION_OVERVIEW', t2.intent);

    const t3 = classifyTravelIntentAndEntities('Things to know about Paris');
    assert(t3.intent === 'TRAVEL_ADVICE', '"Things to know about Paris" -> TRAVEL_ADVICE', t3.intent);

    const t4 = classifyTravelIntentAndEntities('Places in Paris');
    assert(t4.intent === 'DESTINATION_ACTIVITIES', '"Places in Paris" -> DESTINATION_ACTIVITIES', t4.intent);

    const t5 = classifyTravelIntentAndEntities('How long should I stay in Paris?');
    assert(t5.intent === 'TRAVEL_ADVICE', '"How long should I stay in Paris?" -> TRAVEL_ADVICE (not ITINERARY)', t5.intent);

    const t6 = classifyTravelIntentAndEntities('Paris in December');
    assert(t6.intent === 'BEST_TIME_TO_VISIT', '"Paris in December" -> BEST_TIME_TO_VISIT', t6.intent);

    const t7 = classifyTravelIntentAndEntities('Is Paris expensive?');
    assert(t7.intent === 'COST_ESTIMATE', '"Is Paris expensive?" -> COST_ESTIMATE', t7.intent);

    const t8 = classifyTravelIntentAndEntities('Can I go to Paris in winter?');
    assert(t8.intent === 'BEST_TIME_TO_VISIT', '"Can I go to Paris in winter?" -> BEST_TIME_TO_VISIT', t8.intent);

    const t9 = classifyTravelIntentAndEntities('What should I eat in Paris?');
    assert(t9.intent === 'FOOD', '"What should I eat in Paris?" -> FOOD', t9.intent);

    const t10 = classifyTravelIntentAndEntities('Where should I stay in Paris?');
    assert(t10.intent === 'ACCOMMODATION', '"Where should I stay in Paris?" -> ACCOMMODATION', t10.intent);

    const t11 = classifyTravelIntentAndEntities('Flights from Ahmedabad to Paris');
    assert(t11.intent === 'TRANSPORTATION', '"Flights from Ahmedabad to Paris" -> TRANSPORTATION', t11.intent);

    const t12 = classifyTravelIntentAndEntities('Plan a 5-day trip to Paris');
    assert(t12.intent === 'ITINERARY', '"Plan a 5-day trip to Paris" -> ITINERARY', t12.intent);
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: Multi-Turn Conversation Memory
  // -------------------------------------------------------------
  console.log('\n--- Group 3: Multi-Turn Conversation Memory ---');
  {
    const history: ConversationTurn[] = [];

    // Turn 1: "I want to visit Japan."
    const turn1 = classifyTravelIntentAndEntities('I want to visit Japan.', history);
    assert(turn1.destination === 'Japan', 'Turn 1 recognizes Japan', turn1);
    history.push({ role: 'user', content: 'I want to visit Japan.', destination: turn1.destination });

    // Turn 2: "How much would it cost?"
    const turn2 = classifyTravelIntentAndEntities('How much would it cost?', history);
    assert(turn2.destination === 'Japan', 'Turn 2 inherits destination Japan', turn2);
    assert(turn2.intent === 'COST_ESTIMATE', 'Turn 2 detects COST_ESTIMATE', turn2);
    history.push({ role: 'user', content: 'How much would it cost?', destination: turn2.destination, intent: turn2.intent });

    // Turn 3: "What about trains?"
    const turn3 = classifyTravelIntentAndEntities('What about trains?', history);
    assert(turn3.destination === 'Japan', 'Turn 3 inherits destination Japan', turn3);
    assert(turn3.intent === 'TRANSPORTATION', 'Turn 3 detects TRANSPORTATION', turn3);
    history.push({ role: 'user', content: 'What about trains?', destination: turn3.destination, intent: turn3.intent });

    // Turn 4: "What is the best month?"
    const turn4 = classifyTravelIntentAndEntities('What is the best month?', history);
    assert(turn4.destination === 'Japan', 'Turn 4 inherits destination Japan', turn4);
    assert(turn4.intent === 'BEST_TIME_TO_VISIT', 'Turn 4 detects BEST_TIME_TO_VISIT', turn4);
    history.push({ role: 'user', content: 'What is the best month?', destination: turn4.destination, intent: turn4.intent });

    // Turn 5: "What should I see there?"
    const turn5 = classifyTravelIntentAndEntities('What should I see there?', history);
    assert(turn5.destination === 'Japan', 'Turn 5 inherits destination Japan', turn5);
    assert(turn5.intent === 'DESTINATION_ACTIVITIES', 'Turn 5 detects DESTINATION_ACTIVITIES', turn5);
    history.push({ role: 'user', content: 'What should I see there?', destination: turn5.destination, intent: turn5.intent });

    // Turn 6: "What about Mumbai?" -> Context updates to Mumbai!
    const turn6 = classifyTravelIntentAndEntities('What about Mumbai?', history);
    assert(turn6.destination === 'Mumbai', 'Turn 6 updates destination to Mumbai', turn6);
    assert(turn6.destination !== 'Japan', 'Turn 6 does not retain Japan when new place introduced', turn6);
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: Ambiguous Queries & Destination Clarification
  // -------------------------------------------------------------
  console.log('\n--- Group 4: Ambiguous Queries & Destination Clarification ---');
  {
    // "How much does it cost?" with empty history must request clarification
    const amb1 = classifyTravelIntentAndEntities('How much does it cost?', []);
    assert(amb1.needsClarification === true, 'Ambiguous cost query needs clarification', amb1);
    assert(amb1.destination === undefined, 'Ambiguous query does not hallucinate destination', amb1);

    // "How do I get there?" with previous Goa resolves to Goa
    const amb2 = classifyTravelIntentAndEntities('How do I get there?', [
      { role: 'user', content: 'Tell me about Goa', destination: 'Goa' }
    ]);
    assert(amb2.destination === 'Goa', 'Resolved "there" to Goa from history', amb2);
    assert(amb2.intent === 'TRANSPORTATION', 'Intent is TRANSPORTATION', amb2);
  }

  // -------------------------------------------------------------
  // TEST GROUP 5: No Hardcoded Default Destination (Goa Elimination)
  // -------------------------------------------------------------
  console.log('\n--- Group 5: No Hardcoded Destination ---');
  {
    const genericQuery = classifyTravelIntentAndEntities('Where should I go for a relaxing vacation?');
    assert(genericQuery.destination === undefined || genericQuery.destination !== 'Goa', 'Generic query does not default to Goa', genericQuery.destination);
  }

  // -------------------------------------------------------------
  // TEST GROUP 6: Deterministic Date Handling
  // -------------------------------------------------------------
  console.log('\n--- Group 6: Deterministic Date Handling ---');
  {
    const refDate = new Date('2026-09-29T10:00:00Z');
    const tomorrowRes = resolveRelativeDates('Find a flight from Ahmedabad to Goa tomorrow', refDate);
    assert(tomorrowRes.startDate === '2026-09-30', 'Tomorrow resolved to 2026-09-30', tomorrowRes);
    assert(tomorrowRes.isDateExplicit === true, 'Tomorrow marked as explicit date', tomorrowRes);

    const monthRes = resolveRelativeDates('How much will Tokyo cost next December?', refDate);
    assert(monthRes.startDate?.includes('-12-01') === true, 'December resolved to December 1st', monthRes);
    assert(monthRes.isDateExplicit === true, 'Month marked as explicit date', monthRes);

    const noDateRes = resolveRelativeDates('How much does Tokyo cost?', refDate);
    assert(noDateRes.isDateExplicit === false, 'Absence of date flagged as non-explicit', noDateRes);
    assert(typeof noDateRes.dateAssumptionNote === 'string', 'Assumption note attached for missing date', noDateRes);
  }

  // -------------------------------------------------------------
  // TEST GROUP 7: Unknown Destination Handling (No Fake Catalog)
  // -------------------------------------------------------------
  console.log('\n--- Group 7: Unknown Destination Handling ---');
  {
    const pTbilisi = getDestinationProfile('Tbilisi');
    assert(pTbilisi === null, 'Tbilisi correctly recognized as not in local catalog', pTbilisi);

    const pAlbania = getDestinationProfile('Albania');
    assert(pAlbania === null, 'Albania correctly recognized as not in local catalog', pAlbania);

    const pPatagonia = getDestinationProfile('Patagonia');
    assert(pPatagonia === null, 'Patagonia correctly recognized as not in local catalog', pPatagonia);

    // Known destinations must be found
    const pParis = getDestinationProfile('Paris');
    assert(pParis !== null && pParis.cityName === 'Paris', 'Paris catalog profile loaded', pParis?.cityName);
    assert(pParis?.catalogMetadata?.sourceType === 'curated_catalog', 'Paris has curated catalog metadata', pParis?.catalogMetadata);
  }

  // -------------------------------------------------------------
  // TEST GROUP 8: Deterministic Calculations & Currency Consistency
  // -------------------------------------------------------------
  console.log('\n--- Group 8: Deterministic Budget & Currency ---');
  {
    const budgetIndia = await getComprehensiveBudget({
      origin: 'India',
      destination: 'Tokyo',
      days: 5,
      travelers: 1,
      travel_style: 'balanced'
    });

    assert(budgetIndia.currency === 'USD', 'Base international currency is USD', budgetIndia.currency);
    assert(budgetIndia.converted_currency === 'INR', 'Converted currency for India origin is INR', budgetIndia.converted_currency);
    assert(typeof budgetIndia.converted_total_avg === 'number' && budgetIndia.converted_total_avg > 0, 'INR total avg calculated', budgetIndia.converted_total_avg);
    assert(budgetIndia.converted_total_avg === Math.round(budgetIndia.total_avg * 84), 'Conversion uses deterministic 84 INR rate', {
      total_avg: budgetIndia.total_avg,
      converted_avg: budgetIndia.converted_total_avg
    });
  }

  // -------------------------------------------------------------
  // TEST GROUP 9: Transportation Grounding & Disclaimer Verification
  // -------------------------------------------------------------
  console.log('\n--- Group 9: Transportation Grounding & Disclaimers ---');
  {
    const transit = searchTransportationService({
      origin: 'Ahmedabad',
      destination: 'Goa',
      passengers: 1
    });

    assert(transit.is_live === false, 'Transportation is flagged is_live: false', transit.is_live);
    assert(typeof transit.booking_note === 'string' && transit.booking_note.includes('illustrative'), 'Transportation includes illustrative booking note', transit.booking_note);
    assert(transit.flights.length > 0, 'Flights returned for Ahmedabad to Goa', transit.flights.length);
    assert(transit.trains.length > 0, 'Trains returned for Ahmedabad to Goa', transit.trains.length);
    assert(transit.buses.length > 0, 'Buses returned for Ahmedabad to Goa', transit.buses.length);
  }

  console.log('\n==================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('==================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
