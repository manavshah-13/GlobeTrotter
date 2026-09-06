import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useCurrency } from '../context/CurrencyContext';
import { getTripDetails, getTrips } from '../services/api';

export default function ItineraryViewPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');
  const { formatCurrency } = useCurrency();

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
  const activitiesTotal = stops.reduce((acc, st) => {
    return acc + (st.trip_activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
  }, 0);

  const startMs = trip?.start_date ? new Date(trip.start_date).getTime() : Date.now();
  const endMs = trip?.end_date ? new Date(trip.end_date).getTime() : Date.now() + 86400000 * 4;
  const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) || (stops.length * 2) || 4);

  const transitTotal = stops.length > 0 ? (stops.length > 1 ? stops.length * 120 : 60) : 0;
  const lodgingTotal = stops.length > 0 ? daysCount * 110 : 0;
  const foodTotal = stops.length > 0 ? daysCount * 45 : 0;
  const grandTotal = activitiesTotal + transitTotal + lodgingTotal + foodTotal;

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
                    {trip.start_date} → {trip.end_date} • {daysCount} Days • {stops.length} Stops • Total Est: {formatCurrency(grandTotal)}
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

                      // Determine max allowed days for this stop/trip
                      const stopDays = (stop.start_date && stop.end_date)
                        ? Math.max(1, Math.round((new Date(stop.end_date) - new Date(stop.start_date)) / (1000 * 60 * 60 * 24)) + 1)
                        : (trip?.start_date && trip?.end_date)
                        ? Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)))
                        : 7;

                      const tripTitleDaysMatch = (trip?.name || '').match(/(\d+)\s*-?\s*day/i);
                      const maxDays = tripTitleDaysMatch ? parseInt(tripTitleDaysMatch[1], 10) : Math.max(1, stopDays);

                      // Group activities by day_number with strict clamping to maxDays
                      const actsPerDay = Math.max(1, Math.ceil(activities.length / maxDays));
                      const groupedByDay = activities.reduce((acc, act, actIdx) => {
                        const fallbackDay = Math.floor(actIdx / actsPerDay) + 1;
                        const dayNum = Math.min(maxDays, Math.max(1, act.day_number || fallbackDay));
                        if (!acc[dayNum]) acc[dayNum] = [];
                        acc[dayNum].push(act);
                        return acc;
                      }, {});

                      const dayKeys = Object.keys(groupedByDay).sort((a, b) => Number(a) - Number(b));

                      return (
                        <div key={stop.id || sIdx} className="bg-paper border border-slate p-6 rounded-lg space-y-6 shadow-sm">
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
                          ) : dayKeys.length === 0 ? (
                            <div className="space-y-3 font-body-md text-sm">
                              {activities.map((act, aIdx) => (
                                <div key={act.id || aIdx} className="flex items-start justify-between p-3.5 bg-surface-container rounded-lg border border-slate/50">
                                  <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded bg-paper border border-slate flex items-center justify-center font-data-mono text-xs font-bold text-ink-navy mt-0.5">
                                      {aIdx + 1}
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-ink-navy text-sm">{act.custom_name}</h3>
                                      <div className="flex items-center gap-3 text-xs text-slate font-data-mono mt-0.5">
                                        <span className="text-horizon-amber uppercase font-bold">{act.category || 'Sightseeing'}</span>
                                        <span>•</span>
                                        <span>Time: {act.scheduled_time || '10:00'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-data-mono font-bold text-sm text-ink-navy bg-paper border border-slate px-2.5 py-1 rounded">
                                    {formatCurrency(Number(act.cost) || 0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            dayKeys.map((dayNum) => (
                              <div key={dayNum} className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-slate/40 pb-1">
                                  <span className="w-2.5 h-2.5 rounded-full bg-horizon-amber"></span>
                                  <h3 className="font-headline-sm font-bold text-sm text-ink-navy uppercase font-data-mono">
                                    Day {dayNum} Schedule
                                  </h3>
                                </div>

                                <div className="space-y-3 pl-3 border-l-2 border-horizon-amber/40">
                                  {groupedByDay[dayNum].map((act, aIdx) => (
                                    <div key={act.id || aIdx} className="flex items-start justify-between p-3.5 bg-surface-container rounded-lg border border-slate/50">
                                      <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded bg-paper border border-slate flex items-center justify-center font-data-mono text-xs font-bold text-ink-navy mt-0.5">
                                          {aIdx + 1}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-ink-navy text-sm">{act.custom_name}</h4>
                                          <div className="flex items-center gap-3 text-xs text-slate font-data-mono mt-0.5">
                                            <span className="text-horizon-amber uppercase font-bold">{act.category || 'Sightseeing'}</span>
                                            <span>•</span>
                                            <span>Time: {act.scheduled_time || '10:00'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <span className="font-data-mono font-bold text-sm text-ink-navy bg-paper border border-slate px-2.5 py-1 rounded">
                                        {formatCurrency(Number(act.cost) || 0)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Summary Sidebar */}
                <div className="space-y-6">
                  <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy border-b border-slate pb-3">Financial Overview</h3>

                    <div className="space-y-3 font-data-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate">Activities Total:</span>
                        <strong className="text-ink-navy">{formatCurrency(activitiesTotal)}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate">Transit & Transfers:</span>
                        <strong className="text-ink-navy">{formatCurrency(transitTotal)}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate">Lodging & Accommodations:</span>
                        <strong className="text-ink-navy">{formatCurrency(lodgingTotal)}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate">Estimated Meals:</span>
                        <strong className="text-ink-navy">{formatCurrency(foodTotal)}</strong>
                      </div>
                      <div className="pt-3 border-t border-slate flex justify-between items-center text-sm font-bold">
                        <span className="text-ink-navy">Grand Total:</span>
                        <span className="text-horizon-amber">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/budget?tripId=${trip.id}`}
                        className="block w-full text-center py-2.5 bg-surface-container border border-slate rounded font-headline-sm text-xs text-ink-navy font-bold hover:bg-surface-container-high transition-colors"
                      >
                        View Full Budget Breakdown →
                      </Link>
                    </div>
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
