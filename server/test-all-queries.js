// test-all-queries.js
// End-to-end integration test against running server at http://localhost:5000/api/ai/ask

async function postQuery(question, history = [], context = { origin: 'Ahmedabad', travel_style: 'balanced' }) {
  const resp = await fetch('http://localhost:5000/api/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, conversation_history: history, context })
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }
  return await resp.json();
}

async function runAllIntegrationTests() {
  console.log('==================================================================');
  console.log('🚀 GLOBETROTTER LIVE ENDPOINT VALIDATION (http://localhost:5000/api/ai/ask)');
  console.log('==================================================================\n');

  // 1. Destination Overview
  console.log('--- 1. Destination Overview: "Tell me about Paris" ---');
  const r1 = await postQuery('Tell me about Paris');
  console.log(`Intent: ${r1.intent} | Dest: ${r1.destination} | Badge: ${r1.display_badge}`);
  console.log(`Source: ${r1.data_source} | is_live: ${r1.is_live} | Confidence: ${r1.confidence}`);
  console.log(`Answer:\n${r1.answer.slice(0, 300)}...\n`);

  // 2. Travel Advice
  console.log('--- 2. Travel Advice: "What should I know before visiting Bali?" ---');
  const r2 = await postQuery('What should I know before visiting Bali?');
  console.log(`Intent: ${r2.intent} | Dest: ${r2.destination} | Badge: ${r2.display_badge}`);
  console.log(`Answer:\n${r2.answer.slice(0, 300)}...\n`);

  // 3. Cost Estimate (India to Tokyo)
  console.log('--- 3. Cost Estimate: "How much would a 5-day trip to Tokyo cost from India?" ---');
  const r3 = await postQuery('How much would a 5-day trip to Tokyo cost from India?', [], { origin: 'India' });
  console.log(`Intent: ${r3.intent} | Dest: ${r3.destination} | Origin: ${r3.origin}`);
  console.log(`Display Badge: ${r3.display_badge} | Converted Currency: ${r3.data?.converted_currency}`);
  console.log(`Answer:\n${r3.answer.slice(0, 380)}...\n`);

  // 4. Timing
  console.log('--- 4. Timing: "What is the best time to visit Switzerland?" ---');
  const r4 = await postQuery('What is the best time to visit Switzerland?');
  console.log(`Intent: ${r4.intent} | Dest: ${r4.destination} | Badge: ${r4.display_badge}`);
  console.log(`Answer:\n${r4.answer.slice(0, 300)}...\n`);

  // 5. Attractions
  console.log('--- 5. Attractions: "What places should I visit in Kyoto?" ---');
  const r5 = await postQuery('What places should I visit in Kyoto?');
  console.log(`Intent: ${r5.intent} | Dest: ${r5.destination} | Badge: ${r5.display_badge}`);
  console.log(`Answer:\n${r5.answer.slice(0, 300)}...\n`);

  // 6. Transportation
  console.log('--- 6. Transportation: "How do I travel from Ahmedabad to Goa?" ---');
  const r6 = await postQuery('How do I travel from Ahmedabad to Goa?');
  console.log(`Intent: ${r6.intent} | Dest: ${r6.destination} | Origin: ${r6.origin}`);
  console.log(`is_live: ${r6.is_live} (Must be false for illustrative data)`);
  console.log(`Source: ${r6.data_source} | Badge: ${r6.display_badge}`);
  console.log(`Answer:\n${r6.answer.slice(0, 350)}...\n`);

  // 7. Relative Date Transportation
  console.log('--- 7. Relative Date: "Find a flight from Ahmedabad to Goa tomorrow." ---');
  const r7 = await postQuery('Find a flight from Ahmedabad to Goa tomorrow.');
  console.log(`Resolved Date: ${r7.entities?.startDate} | is_live: ${r7.is_live}`);
  console.log(`Answer:\n${r7.answer.slice(0, 300)}...\n`);

  // 8. Multi-Turn Conversation Memory
  console.log('--- 8. Multi-Turn Conversation Memory Flow ---');
  let history = [];
  const seq = [
    'I want to visit Japan.',
    'How much would it cost?',
    'What about trains?',
    'What is the best month?',
    'What should I see there?',
    'What about Mumbai?'
  ];

  for (let i = 0; i < seq.length; i++) {
    const q = seq[i];
    const res = await postQuery(q, history, { origin: 'India' });
    console.log(`[Turn ${i + 1}] "${q}"`);
    console.log(`   -> Intent: ${res.intent} | Dest: ${res.destination} | Origin: ${res.origin || 'India'}`);
    history.push({ role: 'user', content: q, destination: res.destination, origin: res.origin, intent: res.intent });
    history.push({ role: 'assistant', content: res.answer.slice(0, 100), destination: res.destination, intent: res.intent });
  }

  // 9. Unknown Destinations (No Fake Catalog)
  console.log('\n--- 9. Unknown Destination Handling (Tbilisi, Albania, Patagonia) ---');
  const rTbilisi = await postQuery('Tell me about Tbilisi');
  console.log(`[Tbilisi] Intent: ${rTbilisi.intent} | Dest: ${rTbilisi.destination} | Grounding: ${rTbilisi.grounding_source}`);
  console.log(`Preview: ${rTbilisi.answer.slice(0, 250)}...\n`);

  const rAlbania = await postQuery('What should I do in Albania?');
  console.log(`[Albania] Intent: ${rAlbania.intent} | Dest: ${rAlbania.destination} | Grounding: ${rAlbania.grounding_source}`);

  // 10. Ambiguous Query Without Destination
  console.log('\n--- 10. Ambiguous Query Without Destination ---');
  const rAmb = await postQuery('How much does it cost?', []);
  console.log(`[Clarification Request] Needs clarification: ${rAmb.entities?.needsClarification}`);
  console.log(`Message: ${rAmb.answer}`);

  console.log('\n==================================================================');
  console.log('✅ ALL LIVE INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('==================================================================\n');
}

runAllIntegrationTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
