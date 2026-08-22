import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips } from '../services/api';

export default function SharedItineraryPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trip, setTrip] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let id = tripIdParam;
        if (!id) {
          const trips = await getTrips();
          if (trips && trips.length > 0) id = trips[0].id;
        }

        if (id) {
          const data = await getTripDetails(id);
          setTrip(data);
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripIdParam]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stops = trip?.stops || [];

  return (
    <div className="bg-paper font-body-md text-ink-navy min-h-screen flex flex-col">
      <TopAppBar title="Shared Public Itinerary" />

      <main className="flex-grow p-margin-page max-w-4xl mx-auto w-full py-8 space-y-stack-lg">
        <div className="bg-paper border border-slate p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30 mb-2">
              <span className="material-symbols-outlined text-sm">share</span> SHARED PUBLIC ITINERARY
            </div>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
              {trip?.name || 'Autumn in Japan: Tokyo & Kyoto'}
            </h1>
            <p className="font-data-mono text-sm text-slate mt-1">
              {trip ? `${trip.start_date} → ${trip.end_date} • ${stops.length} Cities` : 'Public view-only itinerary'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyShareLink}
              className="bg-horizon-amber text-ink-navy font-bold px-4 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
            <Link
              to="/signup"
              className="bg-primary text-white font-bold px-4 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-1.5 text-sm"
            >
              <span>Clone Trip</span>
              <span className="material-symbols-outlined text-base">file_copy</span>
            </Link>
          </div>
        </div>

        {/* Public Itinerary Highlights */}
        <div className="bg-paper border border-slate p-6 rounded-lg space-y-6">
          <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-3">Route Highlights & Stops</h2>

          {loading ? (
            <div className="py-8 text-center font-data-mono text-xs text-slate">Loading itinerary...</div>
          ) : stops.length === 0 ? (
            <p className="text-slate font-data-mono text-xs">No stops available for this trip.</p>
          ) : (
            <div className="space-y-4">
              {stops.map((stop, i) => {
                const cityName = stop.city_name || stop.cities?.name || `Stop ${i + 1}`;
                const acts = stop.trip_activities || [];

                return (
                  <div key={stop.id || i} className="p-4 bg-surface-container border border-slate rounded-lg space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-headline-sm font-bold text-lg text-ink-navy">
                        Stop {i + 1}: {cityName}
                      </h3>
                      <span className="font-data-mono text-xs text-route-teal font-bold">
                        {stop.start_date} {stop.end_date && stop.end_date !== stop.start_date ? `→ ${stop.end_date}` : ''}
                      </span>
                    </div>
                    {acts.length > 0 ? (
                      <p className="text-sm text-slate font-body-md">
                        {acts.map(a => a.custom_name).join(' • ')}
                      </p>
                    ) : (
                      <p className="text-xs text-slate font-data-mono italic">No activities listed.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
