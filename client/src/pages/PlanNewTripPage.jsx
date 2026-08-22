import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';

export default function PlanNewTripPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/builder');
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

        <div className="bg-paper border border-slate rounded-lg p-8 relative shadow-sm">
          <h1 className="font-headline-lg text-3xl font-bold text-primary mb-2">Plan a New Expedition</h1>
          <p className="font-body-md text-slate mb-8">Set your primary destination, travel dates, and budget tier.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Trip Title</label>
              <input
                type="text"
                required
                defaultValue="Swiss Alps Hiking Retreat"
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
                  defaultValue="2025-06-10"
                  className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                />
              </div>
              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">End Date</label>
                <input
                  type="date"
                  required
                  defaultValue="2025-06-22"
                  className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Primary Destinations / Cities</label>
              <input
                type="text"
                required
                defaultValue="Zurich, Lucerne, Interlaken, Zermatt"
                className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                placeholder="e.g. Tokyo, Kyoto, Osaka"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Estimated Budget ($ USD)</label>
                <input
                  type="number"
                  defaultValue="4200"
                  className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm"
                />
              </div>

              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy mb-2">Travel Style</label>
                <select className="w-full bg-paper border border-slate rounded px-4 py-3 font-data-mono focus:outline-none focus:border-horizon-amber text-sm">
                  <option value="balanced">Balanced Exploration</option>
                  <option value="luxury">Luxury & Fine Dining</option>
                  <option value="budget">Backpacker / Budget</option>
                  <option value="adventure">Outdoor & Adventure</option>
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
                className="px-8 py-3 bg-horizon-amber text-ink-navy font-bold rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span>Launch Itinerary Builder</span>
                <span className="material-symbols-outlined text-lg">route</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
