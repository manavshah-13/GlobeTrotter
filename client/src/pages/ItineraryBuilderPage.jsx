import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useCurrency } from '../context/CurrencyContext';
import { getTripDetails, getTrips, addStop, removeStop, assignActivity, removeActivity, updateTrip, reorderStopsApi } from '../services/api';

export default function ItineraryBuilderPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');
  const { formatCurrency, currencySymbol } = useCurrency();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showStopModal, setShowStopModal] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [addingStop, setAddingStop] = useState(false);

  const [showActivityModal, setShowActivityModal] = useState(null); // { stopId }
  const [actName, setActName] = useState('');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actCost, setActCost] = useState('');
  const [actTime, setActTime] = useState('10:00');
  const [actDesc, setActDesc] = useState('');
  const [addingAct, setAddingAct] = useState(false);

  const loadTrip = async () => {
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
        setError('No trip found. Please create a trip first.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load trip.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripIdParam]);

  const handleTogglePrivacy = async () => {
    if (!trip) return;
    const newStatus = !trip.is_public;
    setTrip({ ...trip, is_public: newStatus });
    try {
      await updateTrip(trip.id, { is_public: newStatus });
    } catch (_) {}
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!newCityName.trim() || !trip) return;

    setAddingStop(true);
    try {
      await addStop({
        trip_id: trip.id,
        city_name: newCityName.trim(),
        country: newCountry.trim() || 'International',
        order_index: trip.stops?.length || 0
      });

      setNewCityName('');
      setNewCountry('');
      setShowStopModal(false);
      await loadTrip();
    } catch (err) {
      alert(`Error adding stop: ${err.message}`);
    } finally {
      setAddingStop(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!actName.trim() || !showActivityModal?.stopId) return;

    setAddingAct(true);
    try {
      await assignActivity({
        stop_id: showActivityModal.stopId,
        custom_name: actName.trim(),
        category: actCategory.toLowerCase(),
        cost: Number(actCost) || 0,
        scheduled_time: actTime,
        description: actDesc.trim()
      });

      setActName('');
      setActCost('');
      setActDesc('');
      setShowActivityModal(null);
      await loadTrip();
    } catch (err) {
      alert(`Error adding activity: ${err.message}`);
    } finally {
      setAddingAct(false);
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
  const activitiesTotal = stops.reduce((acc, stop) => {
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
                {trip ? `${trip.start_date} → ${trip.end_date} • ${stops.length} Stops • Est. Activities Total: ${formatCurrency(activitiesTotal)}` : 'Organize your route, cities, and scheduled activities.'}
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

                // Determine max allowed days for this stop/trip
                const stopDays = (stop.start_date && stop.end_date)
                  ? Math.max(1, Math.round((new Date(stop.end_date) - new Date(stop.start_date)) / (1000 * 60 * 60 * 24)) + 1)
                  : (trip?.start_date && trip?.end_date)
                  ? Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)))
                  : 7;

                const tripTitleDaysMatch = (trip?.name || '').match(/(\d+)\s*-?\s*day/i);
                const maxDays = tripTitleDaysMatch ? parseInt(tripTitleDaysMatch[1], 10) : Math.max(1, stopDays);

                // Group activities by Day number with strict clamping to maxDays
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

                    {/* Activities List grouped by Day */}
                    <div>
                      <div className="font-data-mono-sm text-xs font-bold text-slate mb-3 flex items-center justify-between">
                        <span>ACTIVITIES ({activities.length})</span>
                        <span className="text-ink-navy font-bold">
                          Stop Total: {formatCurrency(activities.reduce((s, a) => s + (Number(a.cost) || 0), 0))}
                        </span>
                      </div>

                      {activities.length === 0 ? (
                        <div className="p-4 bg-surface-container border border-dashed border-slate/60 rounded text-center text-xs font-data-mono text-slate">
                          No activities added for {stopName} yet. Click "Add Activity" above.
                        </div>
                      ) : dayKeys.length === 0 ? (
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
                                  {formatCurrency(Number(act.cost) || 0)}
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
                      ) : (
                        <div className="space-y-4">
                          {dayKeys.map((dayNum) => (
                            <div key={dayNum} className="space-y-2">
                              <div className="flex items-center gap-2 border-b border-slate/40 pb-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-horizon-amber"></span>
                                <span className="font-headline-sm font-bold text-xs text-ink-navy uppercase font-data-mono">
                                  Day {dayNum} Schedule
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l-2 border-horizon-amber/40">
                                {groupedByDay[dayNum].map((act, aIdx) => (
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
                                        {formatCurrency(Number(act.cost) || 0)}
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
            <div className="fixed inset-0 bg-ink-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-paper border border-slate rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate pb-3">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy flex items-center gap-2">
                    <span className="material-symbols-outlined text-route-teal">add_location</span>
                    <span>Add New Stop / Waypoint</span>
                  </h3>
                  <button onClick={() => setShowStopModal(false)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddStop} className="space-y-4">
                  <div>
                    <label className="block text-xs font-data-mono font-bold text-slate mb-1">CITY / DESTINATION NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ujjain, Kyoto, Paris"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-data-mono font-bold text-slate mb-1">COUNTRY (OPTIONAL)</label>
                    <input
                      type="text"
                      placeholder="e.g. India, Japan, France"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowStopModal(false)}
                      className="px-4 py-2 border border-slate text-slate rounded text-xs font-bold hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingStop}
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {addingStop && <div className="w-3 h-3 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>}
                      <span>Add Stop + Auto AI Activities</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADD ACTIVITY MODAL */}
          {showActivityModal && (
            <div className="fixed inset-0 bg-ink-navy/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-paper border border-slate rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate pb-3">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy flex items-center gap-2">
                    <span className="material-symbols-outlined text-horizon-amber">local_activity</span>
                    <span>Add Custom Activity</span>
                  </h3>
                  <button onClick={() => setShowActivityModal(null)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddActivity} className="space-y-4">
                  <div>
                    <label className="block text-xs font-data-mono font-bold text-slate mb-1">ACTIVITY TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahakaleshwar Temple Visit"
                      value={actName}
                      onChange={(e) => setActName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-data-mono font-bold text-slate mb-1">CATEGORY</label>
                      <select
                        value={actCategory}
                        onChange={(e) => setActCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy"
                      >
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Food">Food</option>
                        <option value="Culture">Culture</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Relaxation">Relaxation</option>
                        <option value="Nightlife">Nightlife</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-data-mono font-bold text-slate mb-1">COST ({currencySymbol})</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="25"
                        value={actCost}
                        onChange={(e) => setActCost(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy font-data-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-data-mono font-bold text-slate mb-1">SCHEDULED TIME</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:30 AM"
                      value={actTime}
                      onChange={(e) => setActTime(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy font-data-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-data-mono font-bold text-slate mb-1">DESCRIPTION (OPTIONAL)</label>
                    <textarea
                      rows={2}
                      placeholder="Brief notes about this activity..."
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-slate rounded text-sm font-body-md focus:border-horizon-amber outline-none text-ink-navy"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowActivityModal(null)}
                      className="px-4 py-2 border border-slate text-slate rounded text-xs font-bold hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingAct}
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {addingAct && <div className="w-3 h-3 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>}
                      <span>Save Activity</span>
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
