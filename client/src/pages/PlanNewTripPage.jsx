import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { createTrip, generateItinerary } from '../services/api';

const AI_SUGGESTIONS = [
  "7-day food and culture adventure in Tokyo and Kyoto with traditional tea ceremonies",
  "10-day scenic hiking retreat across the Swiss Alps (Zurich, Interlaken, Zermatt)",
  "5-day Mediterranean coastal road trip through Naples, Positano, and Capri",
  "8-day historical and culinary exploration of Rome, Florence, and Venice"
];

export default function PlanNewTripPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState('ai'); // 'ai' | 'manual'
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  // AI Form State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStartDate, setAiStartDate] = useState('');
  const [aiStyle, setAiStyle] = useState('balanced');

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [manualDestinations, setManualDestinations] = useState('');
  const [manualBudget, setManualBudget] = useState('50000');
  const [manualStyle, setManualStyle] = useState('adventure');
  const [manualDescription, setManualDescription] = useState('');

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      setError('Please enter a travel prompt for the AI planner.');
      return;
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

    // Date Validation
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

      <main className="flex-grow p-margin-page max-w-4xl mx-auto w-full space-y-stack-lg py-8">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-ink-navy hover:text-horizon-amber flex items-center gap-1 font-medium text-sm">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-paper border border-slate rounded-lg p-2 flex gap-2 shadow-sm">
          <button
            type="button"
            onClick={() => { setMode('ai'); setError(''); }}
            className={`flex-1 py-3 px-4 rounded font-headline-sm text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'ai'
                ? 'bg-horizon-amber text-ink-navy shadow'
                : 'text-slate hover:text-ink-navy hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>AI Itinerary Generator (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('manual'); setError(''); }}
            className={`flex-1 py-3 px-4 rounded font-headline-sm text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'manual'
                ? 'bg-ink-navy text-white shadow'
                : 'text-slate hover:text-ink-navy hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            <span>Manual Trip Setup</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-alert-coral/10 border border-alert-coral rounded-lg text-alert-coral font-data-mono text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* AI GENERATOR FORM */}
        {mode === 'ai' && (
          <div className="bg-paper border border-slate rounded-lg p-8 relative shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded mb-2">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  GEMINI 2.5 FLASH ITINERARY ENGINE
                </div>
                <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Generate Multi-City Expedition</h1>
                <p className="font-body-md text-slate mt-1">Describe your dream vacation in plain English. AI synthesizes optimal waypoints, activities, and budget.</p>
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
              <form onSubmit={handleAiSubmit} className="space-y-6">
                <div>
                  <label className="block font-headline-sm font-semibold text-ink-navy mb-2">
                    What kind of journey would you like to take?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. 7-day culinary tour in Tokyo and Kyoto, focusing on historic temples and street markets..."
                    className="w-full bg-paper border border-slate rounded-lg p-4 font-body-md text-sm focus:outline-none focus:border-horizon-amber"
                  />
                </div>

                {/* Quick Prompts */}
                <div>
                  <div className="font-data-mono-sm text-xs text-slate mb-2">Or pick a curated prompt template:</div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Estimated Start Date</label>
                    <input
                      type="date"
                      required
                      value={aiStartDate}
                      onChange={(e) => setAiStartDate(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div>
                    <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Travel Style</label>
                    <select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    >
                      <option value="balanced">Balanced Exploration</option>
                      <option value="luxury">Luxury & Fine Dining</option>
                      <option value="budget">Backpacker / Budget-Friendly</option>
                      <option value="adventure">Outdoor & High Adventure</option>
                      <option value="culinary">Culinary & Wine Focus</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 border border-slate rounded text-ink-navy hover:bg-surface-container font-medium text-sm"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-horizon-amber text-ink-navy font-bold rounded hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    <span>Generate AI Itinerary (~6s)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MANUAL FORM */}
        {mode === 'manual' && (
          <div className="bg-paper border border-slate rounded-lg p-8 relative shadow-sm space-y-6">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary mb-1">Manual Trip Setup</h1>
              <p className="font-body-md text-slate">Specify your trip title, calendar dates, and primary destination cities.</p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Trip Title</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  placeholder="e.g. Summer in Southern Italy"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  />
                </div>
                <div>
                  <label className="block font-headline-sm font-semibold text-ink-navy mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={manualEndDate}
                    onChange={(e) => setManualEndDate(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Primary Destinations / Waypoints</label>
                <input
                  type="text"
                  required
                  value={manualDestinations}
                  onChange={(e) => setManualDestinations(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  placeholder="e.g. Tokyo, Kyoto, Osaka"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Estimated Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={manualBudget}
                    onChange={(e) => setManualBudget(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  />
                </div>

                <div>
                  <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Travel Style</label>
                  <select
                    value={manualStyle}
                    onChange={(e) => setManualStyle(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                  >
                    <option value="balanced">Balanced Exploration</option>
                    <option value="luxury">Luxury & Fine Dining</option>
                    <option value="budget">Backpacker / Budget</option>
                    <option value="adventure">Outdoor & Adventure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Trip Overview / Description</label>
                <textarea
                  rows={3}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  className="w-full bg-paper border border-slate rounded p-3 font-body-md text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="Brief summary of this trip..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-slate rounded text-ink-navy hover:bg-surface-container font-medium text-sm"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-ink-navy text-white font-bold rounded hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Trip...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Itinerary Builder</span>
                      <span className="material-symbols-outlined text-lg">route</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
