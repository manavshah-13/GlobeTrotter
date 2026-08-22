import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips } from '../services/api';

const STOP_COLOR_PALETTE = [
  { bg: 'bg-route-teal', text: 'text-white', border: 'border-route-teal', lightBg: 'bg-route-teal/15', lightText: 'text-route-teal' },
  { bg: 'bg-horizon-amber', text: 'text-ink-navy', border: 'border-horizon-amber', lightBg: 'bg-horizon-amber/20', lightText: 'text-horizon-amber' },
  { bg: 'bg-primary', text: 'text-white', border: 'border-primary', lightBg: 'bg-primary/15', lightText: 'text-primary' },
  { bg: 'bg-alert-coral', text: 'text-white', border: 'border-alert-coral', lightBg: 'bg-alert-coral/15', lightText: 'text-alert-coral' },
];

export default function TripCalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calendar Navigation (Year & Month: 0-indexed month)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  // 1. Load Trips List
  useEffect(() => {
    async function loadTripsList() {
      try {
        setLoading(true);
        const data = await getTrips();
        setTrips(data || []);

        let targetId = tripIdParam;
        if (!targetId && data && data.length > 0) {
          targetId = data[0].id;
        }

        if (targetId) {
          const tripDetail = await getTripDetails(targetId);
          setSelectedTrip(tripDetail);

          // Set calendar month/year based on trip start date
          if (tripDetail?.start_date) {
            const [y, m, d] = tripDetail.start_date.split('-').map(Number);
            if (y && m) {
              setCurrentYear(y);
              setCurrentMonth(m - 1);
              setSelectedDayDate(tripDetail.start_date);
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load calendar data.');
      } finally {
        setLoading(false);
      }
    }
    loadTripsList();
  }, [tripIdParam]);

  // Handle Trip Selection Change
  const handleSelectTrip = async (tripId) => {
    setSearchParams({ tripId });
    try {
      setLoading(true);
      const tripDetail = await getTripDetails(tripId);
      setSelectedTrip(tripDetail);

      if (tripDetail?.start_date) {
        const [y, m] = tripDetail.start_date.split('-').map(Number);
        if (y && m) {
          setCurrentYear(y);
          setCurrentMonth(m - 1);
          setSelectedDayDate(tripDetail.start_date);
        }
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const stops = selectedTrip?.stops || [];

  // Assign a consistent color scheme per stop
  const stopColorMap = {};
  stops.forEach((s, idx) => {
    stopColorMap[s.id] = STOP_COLOR_PALETTE[idx % STOP_COLOR_PALETTE.length];
  });

  // Calculate days in the current view month
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format ISO date string: YYYY-MM-DD
  const formatIsoDate = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Map each day of the month to its corresponding active stops & activities
  const getDayData = (day) => {
    const dateStr = formatIsoDate(currentYear, currentMonth, day);

    // Find stops that span this date
    const activeStops = stops.filter(s => {
      const start = s.start_date || selectedTrip?.start_date;
      const end = s.end_date || s.start_date || selectedTrip?.end_date;
      return dateStr >= start && dateStr <= end;
    });

    // Collect all activities across matching stops
    const dayActivities = activeStops.flatMap(s => s.trip_activities || []);

    return {
      dateStr,
      activeStops,
      dayActivities,
      isTripActive: activeStops.length > 0
    };
  };

  // Selected Day Details
  const selectedDayInfo = selectedDayDate ? (() => {
    const activeStops = stops.filter(s => {
      const start = s.start_date || selectedTrip?.start_date;
      const end = s.end_date || s.start_date || selectedTrip?.end_date;
      return selectedDayDate >= start && selectedDayDate <= end;
    });
    const activities = activeStops.flatMap(s => (s.trip_activities || []).map(a => ({
      ...a,
      stopName: s.city_name || s.cities?.name,
      stopColor: stopColorMap[s.id]
    })));

    return {
      date: selectedDayDate,
      activeStops,
      activities
    };
  })() : null;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Trip Calendar & Timeline" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Header Card with Trip Selector */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30">
                  REAL-TIME SYNC
                </span>
                <span className="font-data-mono text-xs text-slate">
                  {selectedTrip?.start_date} → {selectedTrip?.end_date}
                </span>
              </div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
                {selectedTrip?.name || 'Trip Calendar'}
              </h1>
              <p className="font-body-md text-slate text-xs mt-1">
                {stops.length} Waypoint Stops • {stops.reduce((acc, s) => acc + (s.trip_activities?.length || 0), 0)} Scheduled Activities
              </p>
            </div>

            {/* Trip Selector Dropdown */}
            {trips.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <label className="font-data-mono text-[10px] text-slate font-bold uppercase">Selected Trip</label>
                  <select
                    value={selectedTrip?.id || ''}
                    onChange={(e) => handleSelectTrip(e.target.value)}
                    className="bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.start_date || 'Dates TBD'})
                      </option>
                    ))}
                  </select>
                </div>

                <Link
                  to={selectedTrip ? `/builder?tripId=${selectedTrip.id}` : '/builder'}
                  className="mt-3.5 bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit in Builder</span>
                </Link>
              </div>
            )}
          </div>

          {/* Waypoints Legend */}
          {stops.length > 0 && (
            <div className="bg-paper border border-slate p-4 rounded-lg flex flex-wrap items-center gap-2">
              <span className="font-data-mono text-xs font-bold text-slate mr-2">Waypoints:</span>
              {stops.map((s, idx) => {
                const color = stopColorMap[s.id] || STOP_COLOR_PALETTE[0];
                const name = s.city_name || s.cities?.name || `Stop ${idx + 1}`;
                return (
                  <span
                    key={s.id || idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-data-mono font-bold ${color.bg} ${color.text}`}
                  >
                    <span>{name}</span>
                    <span className="text-[10px] opacity-80">({s.start_date} → {s.end_date})</span>
                  </span>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-route-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-data-mono text-xs text-slate">Synchronizing calendar dates and stops...</p>
            </div>
          ) : !selectedTrip ? (
            <div className="bg-paper border border-slate rounded-lg p-12 text-center space-y-3">
              <p className="text-slate font-data-mono text-xs">No trips found in your account.</p>
              <Link to="/plan" className="inline-block bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs">
                Plan a New Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Main Calendar View (2 Cols) */}
              <div className="lg:col-span-2 bg-paper border border-slate rounded-lg p-6 space-y-4 shadow-sm">
                {/* Month Selector Bar */}
                <div className="flex justify-between items-center border-b border-slate pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevMonth}
                      className="p-1.5 border border-slate rounded hover:bg-surface-container text-ink-navy"
                      title="Previous Month"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <h2 className="font-headline-md text-xl font-bold text-ink-navy">
                      {monthNames[currentMonth]} {currentYear}
                    </h2>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 border border-slate rounded hover:bg-surface-container text-ink-navy"
                      title="Next Month"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>

                  <span className="font-data-mono text-xs text-slate">
                    Click any day to inspect activities
                  </span>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-2 text-center font-headline-sm font-bold text-xs text-slate">
                  <div>SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells before month start */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[90px] border border-transparent bg-paper/40 rounded p-1 opacity-20"></div>
                  ))}

                  {/* Days of current month */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const { dateStr, activeStops, dayActivities, isTripActive } = getDayData(day);
                    const isSelected = selectedDayDate === dateStr;

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDayDate(dateStr)}
                        className={`min-h-[90px] md:h-28 border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-horizon-amber ring-2 ring-horizon-amber/50 bg-surface-container-high'
                            : isTripActive
                            ? 'border-route-teal bg-surface-container hover:border-route-teal/80'
                            : 'border-slate/40 bg-paper text-slate hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-data-mono text-xs font-bold ${isTripActive ? 'text-ink-navy' : 'text-slate'}`}>
                            {day}
                          </span>
                          {dayActivities.length > 0 && (
                            <span className="w-4 h-4 rounded-full bg-horizon-amber text-ink-navy text-[10px] font-bold flex items-center justify-center font-data-mono">
                              {dayActivities.length}
                            </span>
                          )}
                        </div>

                        {/* Stop Badges on this day */}
                        <div className="space-y-1 mt-1 overflow-hidden">
                          {activeStops.map((s, idx) => {
                            const color = stopColorMap[s.id] || STOP_COLOR_PALETTE[0];
                            const name = s.city_name || s.cities?.name || `Stop ${idx + 1}`;
                            return (
                              <div
                                key={s.id || idx}
                                className={`text-[10px] font-data-mono font-bold px-1.5 py-0.5 rounded truncate ${color.lightBg} ${color.lightText} border ${color.border}/30`}
                                title={`${name} (${s.start_date} → ${s.end_date})`}
                              >
                                {name}
                              </div>
                            );
                          })}

                          {/* Quick preview of first activity */}
                          {dayActivities.length > 0 && (
                            <div className="text-[9px] font-body-md text-slate truncate italic">
                              {dayActivities[0].custom_name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Inspector & Activity Timeline (Right Panel) */}
              <div className="bg-paper border border-slate rounded-lg p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-ink-navy">
                        {selectedDayInfo?.date ? `Schedule for ${selectedDayInfo.date}` : 'Select a Day'}
                      </h3>
                      <span className="font-data-mono text-xs text-route-teal">
                        {selectedDayInfo?.activeStops?.length > 0
                          ? `Stop: ${selectedDayInfo.activeStops.map(s => s.city_name || s.cities?.name).join(', ')}`
                          : 'No waypoints scheduled for this date'}
                      </span>
                    </div>
                  </div>

                  {selectedDayInfo?.activities && selectedDayInfo.activities.length > 0 ? (
                    <div className="space-y-3">
                      <div className="font-data-mono text-xs font-bold text-slate">
                        ACTIVITIES ({selectedDayInfo.activities.length})
                      </div>

                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {selectedDayInfo.activities.map((act, aIdx) => (
                          <div
                            key={act.id || aIdx}
                            className="p-3 bg-surface-container border border-slate/60 rounded-lg space-y-1"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-data-mono font-bold text-route-teal">
                                {act.scheduled_time || '10:00'}
                              </span>
                              <span className="font-data-mono font-bold text-ink-navy">
                                ₹{act.cost ?? 0}
                              </span>
                            </div>
                            <div className="font-bold text-sm text-ink-navy">
                              {act.custom_name}
                            </div>
                            {act.description && (
                              <p className="font-body-md text-xs text-slate line-clamp-2">{act.description}</p>
                            )}
                            <div className="pt-1 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-paper rounded border border-slate text-[10px] font-data-mono uppercase text-slate">
                                {act.category || 'Sightseeing'}
                              </span>
                              <span className="text-[10px] font-data-mono text-slate">
                                {act.stopName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate font-data-mono text-xs space-y-2">
                      <span className="material-symbols-outlined text-3xl text-slate/50">event_available</span>
                      <p>No activities scheduled on this date.</p>
                      <Link
                        to={`/builder?tripId=${selectedTrip?.id}`}
                        className="text-horizon-amber underline font-bold inline-block"
                      >
                        + Add Activities in Builder
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate text-xs font-data-mono flex justify-between items-center">
                  <span className="text-slate">Trip Total: {stops.length} Stops</span>
                  <Link
                    to={`/itinerary?tripId=${selectedTrip?.id}`}
                    className="text-route-teal font-bold hover:underline"
                  >
                    View Full Itinerary →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
