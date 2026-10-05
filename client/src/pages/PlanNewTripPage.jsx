import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  createTrip,
  generateItinerary,
  getTravelTimingApi,
  getComprehensiveBudgetApi,
  askAIAssistantApi
} from '../services/api';

const AI_SUGGESTIONS = [
  "7-day food and culture adventure in Tokyo and Kyoto with traditional tea ceremonies",
  "5-day relaxing coastal trip across North and South Goa from Ahmedabad",
  "10-day scenic hiking retreat across the Swiss Alps (Zurich, Interlaken, Zermatt)",
  "7-day scenic nature retreat in Srinagar and Gulmarg Kashmir",
  "8-day historical and culinary exploration of Rome, Florence, and Venice"
];

export default function PlanNewTripPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [mode, setMode] = useState('ai'); // 'ai' | 'manual'
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  // AI Form State
  const [aiPrompt, setAiPrompt] = useState(searchParams.get('prompt') || '');
  const [aiStartDate, setAiStartDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [aiStyle, setAiStyle] = useState(
    Array.isArray(user?.travel_style) ? user.travel_style[0]?.toLowerCase() || 'balanced' : 'balanced'
  );

  // Travel Intelligence Widgets
  const [activeIntelTab, setActiveIntelTab] = useState(''); // '' | 'timing' | 'budget'
  const [intelLoading, setIntelLoading] = useState(false);
  const [timingData, setTimingData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [intelQuery, setIntelQuery] = useState('');

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [manualDestinations, setManualDestinations] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  const [assistantResponse, setAssistantResponse] = useState(null);

  // Extract primary destination from prompt without hardcoding or defaulting to 'Goa'
  const getDestinationFromPrompt = (text) => {
    if (!text) return '';
    const fromToMatch = text.match(/from\s+[a-zA-Z\s]+?\s+to\s+([a-zA-Z\s]+?)(?:\s+(?:for|in|with|\d|\?|$)|$|\?)/i);
    if (fromToMatch) return fromToMatch[1].trim();
    const match = text.match(/(?:in|to|across|visiting|visit|about|explore)\s+([a-zA-Z\s]+?)(?:\s+(?:from|for|with|and|\d|\?|$)|$|\?)/i);
    if (match) return match[1].trim();
    const words = text.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
    if (words.length > 0 && words.length <= 3) return words.join(' ');
    return '';
  };

  const handleFetchTiming = async () => {
    const dest = intelQuery.trim() || getDestinationFromPrompt(aiPrompt);
    if (!dest) {
      setError('Please specify a destination city in your prompt or search box.');
      return;
    }
    setIntelLoading(true);
    setError('');
    try {
      const res = await getTravelTimingApi(dest);
      setTimingData(res);
      setActiveIntelTab('timing');
    } catch (err) {
      setError('Could not load travel timing: ' + err.message);
    } finally {
      setIntelLoading(false);
    }
  };

  const handleFetchBudget = async () => {
    const dest = intelQuery.trim() || getDestinationFromPrompt(aiPrompt);
    if (!dest) {
      setError('Please specify a destination city in your prompt or search box.');
      return;
    }
    setIntelLoading(true);
    setError('');
    try {
      const res = await getComprehensiveBudgetApi({
        origin: user?.city || 'Ahmedabad',
        destination: dest,
        days: 5,
        travelers: 1,
        travel_style: aiStyle
      });
      setBudgetData(res);
      setActiveIntelTab('budget');
    } catch (err) {
      setError('Could not load budget estimate: ' + err.message);
    } finally {
      setIntelLoading(false);
    }
  };

  const getAssistantLoadingText = (prompt) => {
    const p = (prompt || '').toLowerCase();
    if (/\b(flight|train|bus|travel from|get there|reach)\b/i.test(p)) return 'Checking transportation routes & schedules...';
    if (/\b(cost|budget|price|how much|expense)\b/i.test(p)) return 'Calculating trip budget & benchmark fares...';
    if (/\b(when|best time|month|season|weather)\b/i.test(p)) return 'Analyzing seasonal climate & crowd patterns...';
    if (/\b(places|attractions|things to do|visit|see)\b/i.test(p)) return 'Finding destination highlights & places to visit...';
    if (/\b(advice|visa|safety|know before)\b/i.test(p)) return 'Retrieving visa, safety, and cultural guidelines...';
    return 'Analyzing your question with travel intelligence...';
  };

  const handleAskAssistant = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!aiPrompt.trim()) {
      setError('Please enter a travel question or destination for the assistant.');
      return;
    }
    setIntelLoading(true);
    setError('');
    try {
      const res = await askAIAssistantApi({
        question: aiPrompt.trim(),
        context: {
          origin: user?.city || 'Ahmedabad',
          travel_style: aiStyle
        }
      });
      setAssistantResponse(res);
      setActiveIntelTab('assistant');
    } catch (err) {
      setError("I couldn't retrieve current travel information right now. Please verify your connection or try specifying a destination.");
    } finally {
      setIntelLoading(false);
    }
  };


  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      setError('Please enter a travel prompt for the AI planner.');
      return;
    }

    // Intent routing: If user entered an informational question, answer it directly!
    const trimmed = aiPrompt.trim();
    const isQuestion = /\?$/i.test(trimmed) ||
      /^(tell me about|what should i know|what is the best time|how do i travel|what places should i visit|how much would)/i.test(trimmed);
    const isExplicitItinerary = /\b(plan\s+a\s+\d+|plan\s+a\s+trip|itinerary|day-by-day|schedule|days?\s+trip)\b/i.test(trimmed);

    if (isQuestion && !isExplicitItinerary) {
      return handleAskAssistant(e);
    }

    setError('');
    setLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await generateItinerary({
        prompt: `${aiPrompt.trim()} (Travel style: ${aiStyle})`,
        user_id: user?.id || 'traveler-123',
        start_date: aiStartDate
      });

      clearInterval(stepInterval);
      const createdTripId = response.trip_id || response.trip?.id;
      navigate(`/builder?tripId=${createdTripId || ''}`);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(manualEndDate) < new Date(manualStartDate)) {
      setError('Trip End Date cannot be before the Start Date.');
      return;
    }

    setLoading(true);

    try {
      const response = await createTrip({
        user_id: user?.id || 'traveler-123',
        name: manualTitle.trim(),
        description: manualDescription.trim() || `Exploring ${manualDestinations}`,
        start_date: manualStartDate,
        end_date: manualEndDate,
        is_public: true,
        cover_photo_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      });

      const tripId = response.id || `trip-${Date.now()}`;
      navigate(`/builder?tripId=${tripId}`);
    } catch (err) {
      setError(err.message || 'Failed to create trip. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      <TopAppBar title="Plan a New Trip" />

      <main className="flex-grow p-margin-page max-w-4xl mx-auto w-full space-y-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-ink-navy hover:text-horizon-amber flex items-center gap-1 font-medium text-xs sm:text-sm">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Dashboard</span>
          </Link>

          <Link
            to={`/transport?destination=${encodeURIComponent(getDestinationFromPrompt(aiPrompt) || 'Delhi')}`}
            className="text-xs font-bold text-route-teal font-data-mono hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">commute</span>
            <span>Search Flights & Trains for this Route →</span>
          </Link>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-paper border border-slate rounded-lg p-1.5 flex gap-2 shadow-xs">
          <button
            type="button"
            onClick={() => { setMode('ai'); setError(''); }}
            className={`flex-1 py-2.5 px-4 rounded font-headline-sm text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'ai'
                ? 'bg-horizon-amber text-ink-navy shadow-xs'
                : 'text-slate hover:text-ink-navy hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>AI Itinerary Generator (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('manual'); setError(''); }}
            className={`flex-1 py-2.5 px-4 rounded font-headline-sm text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'manual'
                ? 'bg-ink-navy text-paper shadow-xs'
                : 'text-slate hover:text-ink-navy hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>Manual Trip Setup</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral text-xs font-data-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================
            AI GENERATOR FORM
            ======================================================== */}
        {mode === 'ai' && (
          <div className="bg-paper border border-slate rounded-lg p-6 sm:p-8 relative shadow-xs space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded mb-2">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>GEMINI 3.6 FLASH ITINERARY ENGINE</span>
                </div>
                <h1 className="font-headline-lg text-2xl font-bold text-primary">Generate Multi-City Expedition</h1>
                <p className="font-body-md text-slate text-xs sm:text-sm mt-1">
                  Describe your dream vacation in plain English. AI synthesizes optimal waypoints, authentic daily activities, and localized pricing.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 border-4 border-horizon-amber border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-1">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy">
                    {loadingStep === 1 && "Connecting to Gemini AI Engine..."}
                    {loadingStep === 2 && "Synthesizing optimal city waypoints & stops..."}
                    {loadingStep === 3 && "Curating authentic local activities & scheduling..."}
                    {loadingStep >= 4 && "Finalizing relational schema & route timeline..."}
                  </h3>
                  <p className="font-data-mono text-xs text-slate">Estimated generation time: 5–8 seconds</p>
                </div>
                <div className="w-64 bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-horizon-amber h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, loadingStep * 25)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAiSubmit} className="space-y-5">
                <div>
                  <label className="block font-headline-sm text-xs sm:text-sm font-semibold text-ink-navy mb-2">
                    What kind of journey would you like to take?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. 5-day budget trip to Goa from Ahmedabad, focusing on historic churches, sunset boats, and beach shacks..."
                    className="w-full bg-paper border border-slate rounded-lg p-3 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  />
                </div>

                {/* Quick Prompts */}
                <div>
                  <div className="font-data-mono-sm text-[11px] text-slate mb-1.5">Or choose a curated prompt blueprint:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {AI_SUGGESTIONS.map((sugg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAiPrompt(sugg)}
                        className="text-left p-2.5 bg-surface-container border border-slate/60 rounded text-xs font-body-md text-ink-navy hover:border-horizon-amber hover:bg-surface-container-high transition-all flex items-start gap-2"
                      >
                        <span className="material-symbols-outlined text-sm text-horizon-amber flex-shrink-0 mt-0.5">travel_explore</span>
                        <span className="line-clamp-2">{sugg}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-navy mb-1.5">Estimated Start Date</label>
                    <input
                      type="date"
                      required
                      value={aiStartDate}
                      onChange={(e) => setAiStartDate(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-navy mb-1.5">Travel Style</label>
                    <select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    >
                      <option value="balanced">Balanced Exploration</option>
                      <option value="luxury">Luxury & Fine Dining</option>
                      <option value="budget">Backpacker / Budget-Friendly</option>
                      <option value="adventure">Outdoor & High Adventure</option>
                      <option value="culinary">Culinary & Cultural Focus</option>
                      <option value="relaxed">Relaxed & Leisure</option>
                    </select>
                  </div>
                </div>

                {/* Pre-Trip AI Intelligence Buttons */}
                <div className="bg-surface-container p-4 rounded-lg border border-slate/60 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-xs font-bold text-ink-navy">
                      Pre-Trip Intelligence for "{getDestinationFromPrompt(aiPrompt) || 'Target City'}"
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAskAssistant}
                        disabled={intelLoading}
                        className="px-3 py-1 bg-ink-navy text-paper rounded text-xs font-data-mono hover:bg-opacity-90 transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm text-horizon-amber">smart_toy</span>
                        <span>Ask Travel Assistant</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchTiming}
                        disabled={intelLoading}
                        className="px-3 py-1 bg-paper border border-slate rounded text-xs font-data-mono text-route-teal hover:border-route-teal transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        <span>Check Best Time to Visit</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchBudget}
                        disabled={intelLoading}
                        className="px-3 py-1 bg-paper border border-slate rounded text-xs font-data-mono text-horizon-amber hover:border-horizon-amber transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span>Itemized Budget Breakdown</span>
                      </button>
                    </div>
                  </div>

                  {intelLoading && (
                    <div className="p-3.5 text-center text-xs font-data-mono text-slate flex items-center justify-center gap-2.5 bg-paper rounded border border-slate/60 shadow-2xs">
                      <div className="w-4 h-4 border-2 border-horizon-amber border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold text-ink-navy">{getAssistantLoadingText(aiPrompt)}</span>
                    </div>
                  )}

                  {/* General AI Assistant Result Box */}
                  {activeIntelTab === 'assistant' && assistantResponse && (
                    <div className="bg-paper p-5 rounded-lg border-2 border-horizon-amber space-y-4 text-xs shadow-xs">
                      {/* Polished Human-Readable Header */}
                      <div className="flex flex-wrap justify-between items-center border-b border-slate/60 pb-3 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-ink-navy text-paper font-bold rounded text-[11px] font-data-mono">
                            <span className="material-symbols-outlined text-xs text-horizon-amber">smart_toy</span>
                            <span>{assistantResponse.display_badge || 'Travel Intelligence'}</span>
                          </span>

                          {assistantResponse.destination && (
                            <h3 className="font-bold text-ink-navy text-sm sm:text-base">
                              {assistantResponse.destination}
                              {assistantResponse.entities?.country ? `, ${assistantResponse.entities.country}` : ''}
                            </h3>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {assistantResponse.is_live ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-data-mono font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Live Data
                            </span>
                          ) : assistantResponse.is_estimate ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-data-mono">
                              Sample Estimate
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-data-mono">
                              Curated Guide
                            </span>
                          )}

                          <span className="text-[10px] font-data-mono text-slate/80">
                            {assistantResponse.grounding_source}
                          </span>
                        </div>
                      </div>

                      <div className="text-ink-navy font-body-md whitespace-pre-line leading-relaxed text-xs sm:text-sm bg-surface-container/40 p-4 rounded-lg border border-slate/40">
                        {assistantResponse.answer}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate/40">
                        <button
                          type="button"
                          onClick={() => {
                            if (assistantResponse.destination) {
                              setAiPrompt(`Plan a 4-day trip to ${assistantResponse.destination}`);
                            }
                            handleAiSubmit(new Event('submit'));
                          }}
                          className="px-4 py-1.5 bg-route-teal text-paper font-bold text-xs rounded hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                          <span>Generate Full Day-by-Day Itinerary for this</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Travel Timing Result Box */}
                  {activeIntelTab === 'timing' && timingData && (
                    <div className="bg-paper p-4 rounded-lg border border-route-teal space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate/60 pb-2">
                        <span className="font-bold text-ink-navy text-sm">
                          Seasonal Climatology: {timingData.destination}
                        </span>
                        <span className="text-[10px] font-data-mono text-slate">{timingData.data_reliability}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded">
                          <span className="font-bold text-emerald-800 block">Best Overall Period</span>
                          <span className="text-ink-navy font-semibold">{timingData.best_overall_period}</span>
                        </div>
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded">
                          <span className="font-bold text-blue-800 block">Best Budget Period</span>
                          <span className="text-ink-navy font-semibold">{timingData.best_budget_period}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                          <span className="font-bold text-amber-800 block">Best Weather</span>
                          <span className="text-ink-navy font-semibold">{timingData.best_weather_period}</span>
                        </div>
                      </div>

                      {timingData.periods_to_avoid && (
                        <div className="p-2.5 bg-alert-coral/10 border border-alert-coral/30 rounded text-alert-coral">
                          <span className="font-bold">Periods to Avoid:</span> {timingData.periods_to_avoid} — {timingData.avoid_reason}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Itemized Budget Result Box */}
                  {activeIntelTab === 'budget' && budgetData && (
                    <div className="bg-paper p-4 rounded-lg border border-horizon-amber space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate/60 pb-2">
                        <span className="font-bold text-ink-navy text-sm">
                          Itemized Cost Breakdown ({budgetData.days} Days • {budgetData.travelers} Pax)
                        </span>
                        <span className="text-horizon-amber font-bold text-sm">
                          Est. Total: {formatCurrency(budgetData.total_min)} – {formatCurrency(budgetData.total_max)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">FLIGHTS / TRANSIT</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.flights_transit?.min_cost)} - {formatCurrency(budgetData.breakdown?.flights_transit?.max_cost)}
                          </span>
                        </div>
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">LODGING ({budgetData.days - 1} Nights)</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.accommodation?.min_cost)} - {formatCurrency(budgetData.breakdown?.accommodation?.max_cost)}
                          </span>
                        </div>
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">DINING & FOOD</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.food_dining?.min_cost)} - {formatCurrency(budgetData.breakdown?.food_dining?.max_cost)}
                          </span>
                        </div>
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">LOCAL TRANSIT</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.local_transport?.min_cost)} - {formatCurrency(budgetData.breakdown?.local_transport?.max_cost)}
                          </span>
                        </div>
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">ACTIVITIES & ENTRY</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.activities_tours?.min_cost)} - {formatCurrency(budgetData.breakdown?.activities_tours?.max_cost)}
                          </span>
                        </div>
                        <div className="p-2 bg-surface-container rounded border border-slate/60">
                          <span className="text-[10px] text-slate block font-data-mono">OVERLAND OPTION</span>
                          <span className="font-bold text-ink-navy">
                            {formatCurrency(budgetData.breakdown?.train_bus_alternative?.min_cost || 0)} (Train/Bus)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 border border-slate rounded text-ink-navy hover:bg-surface-container font-medium text-xs sm:text-sm"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-horizon-amber text-ink-navy font-bold rounded hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 text-xs sm:text-sm shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    <span>Generate AI Itinerary (~6s)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MANUAL FORM */}
        {mode === 'manual' && (
          <div className="bg-paper border border-slate rounded-lg p-6 sm:p-8 relative shadow-xs space-y-6">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-primary mb-1">Manual Trip Setup</h1>
              <p className="font-body-md text-slate text-xs sm:text-sm">Specify your trip title, calendar dates, and primary destination cities.</p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">Trip Title</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  placeholder="e.g. Summer in Southern Italy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1.5">End Date</label>
                  <input
                    type="date"
                    required
                    value={manualEndDate}
                    onChange={(e) => setManualEndDate(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">Destination City / Region</label>
                <input
                  type="text"
                  required
                  value={manualDestinations}
                  onChange={(e) => setManualDestinations(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  placeholder="e.g. Rome, Florence, Naples"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1.5">Description / Trip Notes</label>
                <textarea
                  rows={2}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                  placeholder="Notes about travel companions, flight numbers, or key bookings..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 border border-slate rounded text-ink-navy hover:bg-surface-container font-medium text-xs sm:text-sm"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-ink-navy text-paper font-bold rounded hover:bg-opacity-90 transition-all text-xs sm:text-sm shadow-2xs"
                >
                  <span>Create Trip & Open Builder</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
