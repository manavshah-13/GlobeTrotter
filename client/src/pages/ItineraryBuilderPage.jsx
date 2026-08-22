import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips, addStop, removeStop, assignActivity, removeActivity, reorderStopsApi, updateTrip } from '../services/api';

export default function ItineraryBuilderPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(null); // { stopId }
  const [savingItem, setSavingItem] = useState(false);

  // Stop Modal Form State
  const [newStopCity, setNewStopCity] = useState('');
  const [newStopCountry, setNewStopCountry] = useState('');
  const [newStopStart, setNewStopStart] = useState('');
  const [newStopEnd, setNewStopEnd] = useState('');

  // Activity Modal Form State
  const [newActName, setNewActName] = useState('');
  const [newActCategory, setNewActCategory] = useState('Sightseeing');
  const [newActCost, setNewActCost] = useState('35');
  const [newActTime, setNewActTime] = useState('10:00');

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError('');
      let currentTripId = tripIdParam;

      if (!currentTripId) {
        const trips = await getTrips();
        if (trips && trips.length > 0) {
          currentTripId = trips[0].id;
        }
      }

      if (currentTripId) {
        const details = await getTripDetails(currentTripId);
        setTrip(details);
      } else {
        setError('No active trip found. Please plan a trip first.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load itinerary details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripIdParam]);

  const handleTogglePrivacy = async () => {
    if (!trip) return;
    const nextPublic = !trip.is_public;
    setTrip(prev => ({ ...prev, is_public: nextPublic }));
    try {
      await updateTrip(trip.id, { is_public: nextPublic });
    } catch (_) {}
  };

  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    if (!newStopCity.trim() || !trip) return;

    setSavingItem(true);
    try {
      await addStop({
        trip_id: trip.id,
        city_name: newStopCity.trim(),
        country: newStopCountry.trim() || 'Global',
        start_date: newStopStart || trip.start_date,
        end_date: newStopEnd || trip.end_date,
        order_index: (trip.stops || []).length
      });

      setShowStopModal(false);
      setNewStopCity('');
      setNewStopCountry('');
      setNewStopStart('');
      setNewStopEnd('');
      await loadTrip();
    } catch (err) {
      alert(`Error adding stop: ${err.message}`);
    } finally {
      setSavingItem(false);
    }
  };

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    if (!newActName.trim() || !showActivityModal) return;

    setSavingItem(true);
    try {
      await assignActivity({
        stop_id: showActivityModal.stopId,
        custom_name: newActName.trim(),
        category: newActCategory,
        cost: Number(newActCost) || 0,
        scheduled_time: newActTime || '10:00'
      });

      setShowActivityModal(null);
      setNewActName('');
      setNewActCost('35');
      await loadTrip();
    } catch (err) {
      alert(`Error adding activity: ${err.message}`);
    } finally {
      setSavingItem(false);
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (!trip || !trip.stops) return;
    const newStops = [...trip.stops];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIdx];
    newStops[targetIdx] = temp;

    setTrip({ ...trip, stops: newStops });

    const stopOrders = newStops.map((s, i) => ({ id: s.id, order_index: i }));
    try {
      await reorderStopsApi(trip.id, stopOrders);
    } catch (_) {}
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to remove this stop and all its activities?')) return;
    try {
      await removeStop(stopId);
      await loadTrip();
    } catch (err) {
      alert(`Error removing stop: ${err.message}`);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await removeActivity(activityId);
      await loadTrip();
    } catch (err) {
      alert(`Error removing activity: ${err.message}`);
    }
  };

  const stops = trip?.stops || [];
  const totalCost = stops.reduce((acc, stop) => {
    const actTotal = (stop.trip_activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    return acc + actTotal;
  }, 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Itinerary Builder" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Header Card */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30">
                  LIVE BUILDER
                </span>
                <button
                  onClick={handleTogglePrivacy}
                  className={`px-2.5 py-0.5 text-xs font-data-mono font-bold rounded border transition-colors flex items-center gap-1 ${
                    trip?.is_public
                      ? 'bg-route-teal/10 text-route-teal border-route-teal/30'
                      : 'bg-surface-container text-slate border-slate'
                  }`}
                  title="Toggle Public / Private visibility"
                >
                  <span className="material-symbols-outlined text-xs">{trip?.is_public ? 'public' : 'lock'}</span>
                  <span>{trip?.is_public ? 'PUBLIC' : 'PRIVATE'}</span>
                </button>
              </div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
                {trip?.name || 'Itinerary Builder'}
              </h1>
              <p className="font-data-mono text-xs text-slate mt-1">
                {trip ? `${trip.start_date} → ${trip.end_date} • ${stops.length} Stops • Est. Activities Total: $${totalCost}` : 'Organize your route, cities, and scheduled activities.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowStopModal(true)}
                className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-route-teal">add_location_alt</span>
                <span>Add Stop</span>
              </button>

              <Link
                to={trip ? `/itinerary?tripId=${trip.id}` : '/itinerary'}
                className="bg-route-teal text-white font-bold px-4 py-2 rounded hover:bg-opacity-90 transition-all flex items-center gap-1.5 text-xs"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>View Final</span>
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
                      <div className="flex flex-col items-center group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-paper border-2 border-route-teal flex items-center justify-center font-data-mono font-bold text-xs text-route-teal shadow-sm group-hover:bg-route-teal group-hover:text-white transition-all">
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

          {error && (
            <div className="p-4 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral font-data-mono text-xs flex items-center justify-between">
              <span>{error}</span>
              <Link to="/plan" className="underline font-bold">Create New Trip →</Link>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-route-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-data-mono text-xs text-slate">Loading itinerary stops & activities...</p>
            </div>
          ) : stops.length === 0 ? (
            <div className="bg-paper border border-slate rounded-lg p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-slate">
                <span className="material-symbols-outlined text-3xl">route</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-ink-navy">No Waypoint Stops Added Yet</h3>
              <p className="font-body-md text-sm text-slate max-w-md mx-auto">
                Begin constructing your travel sequence by adding destination cities or stops along your journey.
              </p>
              <button
                onClick={() => setShowStopModal(true)}
                className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded text-sm hover:opacity-90 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add First Stop</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {stops.map((stop, idx) => {
                const activities = stop.trip_activities || [];
                const stopName = stop.city_name || stop.cities?.name || `Stop ${idx + 1}`;
                const stopCountry = stop.country || stop.cities?.country || '';

                return (
                  <div key={stop.id || idx} className="bg-paper border border-slate rounded-lg p-6 relative space-y-4 shadow-sm hover:border-slate/80 transition-all">
                    {/* Header with Reorder Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-ink-navy text-white flex items-center justify-center font-data-mono font-bold text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-headline-sm text-lg font-bold text-ink-navy flex items-center gap-2">
                            <span>{stopName}</span>
                            {stopCountry && <span className="text-xs font-data-mono text-slate font-normal">({stopCountry})</span>}
                          </h3>
                          <p className="font-data-mono text-xs text-route-teal">
                            {stop.start_date} {stop.end_date && stop.end_date !== stop.start_date ? `→ ${stop.end_date}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Move Up / Move Down */}
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, -1)}
                          className="p-1 border border-slate rounded text-slate hover:text-ink-navy disabled:opacity-30"
                          title="Move stop earlier"
                        >
                          <span className="material-symbols-outlined text-base">arrow_upward</span>
                        </button>
                        <button
                          disabled={idx === stops.length - 1}
                          onClick={() => handleMoveStop(idx, 1)}
                          className="p-1 border border-slate rounded text-slate hover:text-ink-navy disabled:opacity-30"
                          title="Move stop later"
                        >
                          <span className="material-symbols-outlined text-base">arrow_downward</span>
                        </button>

                        <button
                          onClick={() => setShowActivityModal({ stopId: stop.id })}
                          className="px-3 py-1.5 bg-surface-container border border-slate text-xs font-bold text-ink-navy rounded hover:bg-surface-container-high flex items-center gap-1 ml-2"
                        >
                          <span className="material-symbols-outlined text-sm text-horizon-amber">add</span>
                          <span>Add Activity</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="p-1.5 text-slate hover:text-alert-coral hover:bg-alert-coral/10 rounded transition-colors"
                          title="Remove this stop"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Activities List */}
                    <div>
                      <div className="font-data-mono-sm text-xs font-bold text-slate mb-2 flex items-center justify-between">
                        <span>ACTIVITIES ({activities.length})</span>
                        <span className="text-ink-navy font-bold">
                          Stop Total: ${activities.reduce((s, a) => s + (Number(a.cost) || 0), 0)}
                        </span>
                      </div>

                      {activities.length === 0 ? (
                        <div className="p-4 bg-surface-container border border-dashed border-slate/60 rounded text-center text-xs font-data-mono text-slate">
                          No activities added for {stopName} yet. Click "Add Activity" above.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activities.map((act, aIdx) => (
                            <div
                              key={act.id || aIdx}
                              className="p-3 bg-surface-container border border-slate/60 rounded-lg flex justify-between items-start group"
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-paper rounded border border-slate text-[10px] font-data-mono text-route-teal uppercase">
                                    {act.category || 'Sightseeing'}
                                  </span>
                                  {act.scheduled_time && (
                                    <span className="text-[11px] font-data-mono text-slate">{act.scheduled_time}</span>
                                  )}
                                </div>
                                <div className="font-bold text-sm text-ink-navy mt-1 truncate">
                                  {act.custom_name}
                                </div>
                                {act.description && (
                                  <p className="text-xs text-slate mt-0.5 line-clamp-1">{act.description}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="font-data-mono font-bold text-xs text-ink-navy">
                                  ${act.cost ?? 0}
                                </span>
                                <button
                                  onClick={() => handleDeleteActivity(act.id)}
                                  className="text-slate hover:text-alert-coral opacity-60 hover:opacity-100 transition-opacity"
                                  title="Remove activity"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowStopModal(true)}
                  className="bg-horizon-amber text-ink-navy font-headline-sm text-sm font-bold px-6 py-3 rounded border border-ink-navy shadow-[2px_2px_0px_0px_#1B2A4A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  <span>Add Another Stop / Waypoint</span>
                </button>
              </div>
            </div>
          )}

          {/* ADD STOP MODAL */}
          {showStopModal && (
            <div className="fixed inset-0 bg-ink-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-paper border border-slate rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate pb-2">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Add Waypoint Stop</h3>
                  <button onClick={() => setShowStopModal(false)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddStopSubmit} className="space-y-4">
                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">City / Location Name *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={newStopCity}
                      onChange={(e) => setNewStopCity(e.target.value)}
                      placeholder="e.g. Osaka, Interlaken, Kyoto"
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Country</label>
                    <input
                      type="text"
                      value={newStopCountry}
                      onChange={(e) => setNewStopCountry(e.target.value)}
                      placeholder="e.g. Japan, Switzerland, Italy"
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Arrival Date</label>
                      <input
                        type="date"
                        value={newStopStart}
                        onChange={(e) => setNewStopStart(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      />
                    </div>
                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Departure Date</label>
                      <input
                        type="date"
                        value={newStopEnd}
                        onChange={(e) => setNewStopEnd(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowStopModal(false)}
                      className="px-4 py-2 border border-slate rounded text-xs text-slate hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingItem}
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90 disabled:opacity-50"
                    >
                      {savingItem ? 'Adding Stop...' : 'Add Stop'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADD ACTIVITY MODAL */}
          {showActivityModal && (
            <div className="fixed inset-0 bg-ink-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-paper border border-slate rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate pb-2">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Add Activity to Stop</h3>
                  <button onClick={() => setShowActivityModal(null)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddActivitySubmit} className="space-y-4">
                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Activity Name *</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={newActName}
                      onChange={(e) => setNewActName(e.target.value)}
                      placeholder="e.g. Tsukiji Outer Market Tasting Tour"
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Category</label>
                      <select
                        value={newActCategory}
                        onChange={(e) => setNewActCategory(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      >
                        <option value="Culinary">Culinary / Food</option>
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Culture">Culture & History</option>
                        <option value="Adventure">Outdoor & Adventure</option>
                        <option value="Nightlife">Nightlife</option>
                        <option value="Relaxation">Relaxation / Spa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Cost ($ USD)</label>
                      <input
                        type="number"
                        value={newActCost}
                        onChange={(e) => setNewActCost(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Time Slot / Time</label>
                    <input
                      type="text"
                      value={newActTime}
                      onChange={(e) => setNewActTime(e.target.value)}
                      placeholder="e.g. 10:00 AM or Morning"
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowActivityModal(null)}
                      className="px-4 py-2 border border-slate rounded text-xs text-slate hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingItem}
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90 disabled:opacity-50"
                    >
                      {savingItem ? 'Saving...' : 'Add Activity'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
