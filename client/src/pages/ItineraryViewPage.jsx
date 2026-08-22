import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips } from '../services/api';

export default function ItineraryViewPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let id = tripIdParam;
        if (!id) {
          const trips = await getTrips();
          if (trips && trips.length > 0) {
            id = trips[0].id;
          }
        }

        if (id) {
          const data = await getTripDetails(id);
          setTrip(data);
        } else {
          setError('No trip found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load itinerary.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripIdParam]);

  const stops = trip?.stops || [];
  const totalActivitiesCost = stops.reduce((acc, st) => {
    return acc + (st.trip_activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
  }, 0);

  const estimatedStayCost = stops.length * 150;
  const estimatedFlightCost = 650;
  const grandTotal = totalActivitiesCost + estimatedStayCost + estimatedFlightCost;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Itinerary View" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-route-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-data-mono text-xs text-slate">Loading verified itinerary...</p>
            </div>
          ) : error || !trip ? (
            <div className="bg-paper border border-slate p-8 rounded-lg text-center space-y-3">
              <p className="text-alert-coral font-data-mono text-xs">{error || 'No itinerary found.'}</p>
              <Link to="/plan" className="inline-block bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs">
                Plan a New Trip
              </Link>
            </div>
          ) : (
            <>
              {/* Header Card */}
              <div className="bg-paper border border-slate p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30">
                      CONFIRMED ITINERARY
                    </span>
                    <span className="text-xs font-data-mono text-slate">ID: {trip.id}</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mt-1">
                    {trip.name}
                  </h1>
                  <p className="font-data-mono text-sm text-slate">
                    {trip.start_date} → {trip.end_date} • {stops.length} Cities / Stops
                  </p>
                  {trip.description && (
                    <p className="font-body-md text-xs text-slate mt-2 max-w-2xl">{trip.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/shared?tripId=${trip.id}`}
                    className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded hover:bg-surface-container flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    <span>Share Public Link</span>
                  </Link>
                  <Link
                    to={`/builder?tripId=${trip.id}`}
                    className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded hover:bg-opacity-90 flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    <span>Edit in Builder</span>
                  </Link>
                </div>
              </div>

              {/* Route-Line Visual Motif */}
              {stops.length > 0 && (
                <div className="bg-paper border border-slate p-6 rounded-lg overflow-x-auto">
                  <div className="font-data-mono-sm text-xs font-bold text-slate mb-4">EXPEDITION ROUTE TIMELINE</div>
                  <div className="flex items-center min-w-max px-4 py-2">
                    {stops.map((st, i) => {
                      const name = st.city_name || st.cities?.name || `Stop ${i + 1}`;
                      const isLast = i === stops.length - 1;

                      return (
                        <React.Fragment key={st.id || i}>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-paper border-2 border-route-teal flex items-center justify-center font-data-mono font-bold text-xs text-route-teal shadow-sm">
                              {i + 1}
                            </div>
                            <span className="font-headline-sm font-bold text-xs text-ink-navy mt-1.5 max-w-[100px] truncate text-center">
                              {name}
                            </span>
                            <span className="font-data-mono text-[10px] text-slate">{st.trip_activities?.length || 0} acts</span>
                          </div>

                          {!isLast && (
                            <div className="flex-grow mx-3 flex items-center min-w-[60px]">
                              <div className="w-full border-t-2 border-dashed border-route-teal relative">
                                <span className="material-symbols-outlined text-xs text-route-teal absolute -top-2 left-1/2 -translate-x-1/2">
                                  arrow_forward
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Schedule and Summary Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                <div className="lg:col-span-2 space-y-6">
                  {stops.length === 0 ? (
                    <div className="bg-paper border border-slate rounded-lg p-8 text-center text-slate font-data-mono text-xs">
                      No stops added to this trip yet. <Link to={`/builder?tripId=${trip.id}`} className="text-horizon-amber underline">Add stops in Builder</Link>
                    </div>
                  ) : (
                    stops.map((stop, sIdx) => {
                      const cityName = stop.city_name || stop.cities?.name || `Stop ${sIdx + 1}`;
                      const country = stop.country || stop.cities?.country || '';
                      const activities = stop.trip_activities || [];

                      return (
                        <div key={stop.id || sIdx} className="bg-paper border border-slate p-6 rounded-lg space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b border-slate pb-3">
                            <h2 className="font-headline-md text-lg font-bold text-ink-navy flex items-center gap-2">
                              <span className="material-symbols-outlined text-route-teal">location_on</span>
                              <span>Stop {sIdx + 1}: {cityName} {country ? `(${country})` : ''}</span>
                            </h2>
                            <span className="font-data-mono text-xs text-route-teal font-bold">
                              {stop.start_date} {stop.end_date && stop.end_date !== stop.start_date ? `→ ${stop.end_date}` : ''}
                            </span>
                          </div>

                          {activities.length === 0 ? (
                            <p className="text-xs font-data-mono text-slate italic p-2 bg-surface-container rounded">
                              No activities scheduled for this stop.
                            </p>
                          ) : (
                            <div className="space-y-3 font-body-md text-sm">
                              {activities.map((act, aIdx) => (
                                <div key={act.id || aIdx} className="flex items-start justify-between p-3.5 bg-surface-container rounded-lg border border-slate/50">
                                  <div className="flex items-start gap-3">
                                    <span className="font-data-mono text-xs font-bold text-route-teal w-14 flex-shrink-0 pt-0.5">
                                      {act.scheduled_time || '10:00'}
                                    </span>
                                    <div>
                                      <div className="font-bold text-ink-navy flex items-center gap-2">
                                        <span>{act.custom_name}</span>
                                        <span className="px-2 py-0.2 bg-paper border border-slate text-[10px] font-data-mono uppercase text-slate rounded">
                                          {act.category || 'Sightseeing'}
                                        </span>
                                      </div>
                                      {act.description && (
                                        <div className="text-xs text-slate mt-0.5">{act.description}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="font-data-mono font-bold text-xs text-ink-navy pl-2 flex-shrink-0">
                                    ₹{act.cost ?? 0}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Side Overview Panel */}
                <div className="space-y-6">
                  <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Trip Budget Summary</h3>
                    <div className="space-y-2 text-sm font-data-mono">
                      <div className="flex justify-between text-slate">
                        <span>Flights / Transit:</span>
                        <span className="text-ink-navy font-bold">₹{estimatedFlightCost}</span>
                      </div>
                      <div className="flex justify-between text-slate">
                        <span>Lodging ({stops.length} Cities):</span>
                        <span className="text-ink-navy font-bold">₹{estimatedStayCost}</span>
                      </div>
                      <div className="flex justify-between text-slate">
                        <span>Activities ({stops.reduce((s, st) => s + (st.trip_activities?.length || 0), 0)} Total):</span>
                        <span className="text-ink-navy font-bold">₹{totalActivitiesCost}</span>
                      </div>
                      <div className="pt-2 border-t border-slate flex justify-between font-bold text-ink-navy text-base">
                        <span>Estimated Total:</span>
                        <span className="text-horizon-amber">₹{grandTotal}</span>
                      </div>
                    </div>

                    <Link
                      to="/budget"
                      className="block w-full text-center bg-surface-container border border-slate py-2 rounded font-data-mono text-xs text-ink-navy hover:bg-surface-container-high"
                    >
                      View Full Budget Breakdown →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
