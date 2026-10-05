import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { getTrips } from '../services/api';

const CURATED_SUGGESTIONS = [
  {
    name: 'Varanasi & Ujjain',
    country: 'India',
    tags: ['Cultural', 'History', 'Temples'],
    days: 5,
    budgetUsd: 380,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    description: 'Explore the ancient Jyotirlinga shrines, holy ghats, and morning riverboat ceremonies.',
    prompt: '5-day cultural and temple heritage journey in Varanasi and Ujjain'
  },
  {
    name: 'Goa Coastal Loop',
    country: 'India',
    tags: ['Relaxed', 'Beaches', 'Food'],
    days: 6,
    budgetUsd: 460,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    description: 'Colonial Latin quarters in Panaji, secluded southern coves, and beachside dining.',
    prompt: '6-day relaxing coastal trip across North and South Goa'
  },
  {
    name: 'Kashmir Valley & Gulmarg',
    country: 'India',
    tags: ['Nature', 'Mountains', 'Adventure'],
    days: 7,
    budgetUsd: 580,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    description: 'Dal Lake wooden houseboats, scenic Gulmarg gondolas, and alpine meadows.',
    prompt: '7-day scenic nature retreat in Srinagar and Gulmarg Kashmir'
  },
  {
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    tags: ['Cultural', 'Food', 'Luxury'],
    days: 9,
    budgetUsd: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'Fast Shinkansen bullet train connections, ancient shrines, and Michelin gastronomy.',
    prompt: '9-day cultural and culinary adventure across Tokyo and Kyoto'
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getTrips(user?.id);
        setTrips(data || []);
      } catch (_) {
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const hasTrips = trips.length > 0;
  const latestTrip = trips[0];
  const stops = latestTrip?.stops || [];
  const totalActivities = stops.reduce((acc, st) => acc + (st.trip_activities?.length || 0), 0);
  const activitiesTotal = stops.reduce((acc, st) => acc + (st.trip_activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);

  const startMs = latestTrip?.start_date ? new Date(latestTrip.start_date).getTime() : Date.now();
  const endMs = latestTrip?.end_date ? new Date(latestTrip.end_date).getTime() : Date.now() + 86400000 * 4;
  const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) || (stops.length * 2) || 4);

  const transitTotal = stops.length > 0 ? (stops.length > 1 ? stops.length * 120 : 60) : 0;
  const lodgingTotal = stops.length > 0 ? daysCount * 110 : 0;
  const foodTotal = stops.length > 0 ? daysCount * 45 : 0;
  const totalCost = activitiesTotal + transitTotal + lodgingTotal + foodTotal;

  // Filter personalized suggestions based on user style preferences if available
  const userStyles = Array.isArray(user?.travel_style) ? user.travel_style : [user?.travel_style || 'Cultural'];
  const personalizedSuggestions = CURATED_SUGGESTIONS.filter(s =>
    s.tags.some(tag => userStyles.some(ustyle => ustyle.toLowerCase().includes(tag.toLowerCase())))
  );
  const displaySuggestions = personalizedSuggestions.length > 0 ? personalizedSuggestions : CURATED_SUGGESTIONS;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Command Dashboard" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-paper border border-slate p-6 rounded-lg shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-surface-container rounded-full text-[11px] font-data-mono text-slate border border-slate/60 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-route-teal"></span>
                <span>Base Location: {user?.city || 'Ahmedabad'}, {user?.country || 'India'}</span>
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary">
                Welcome back, {user?.name || 'Explorer'}
              </h1>
              <p className="font-body-md text-slate text-xs sm:text-sm mt-1">
                {hasTrips
                  ? `You have ${trips.length} active expedition plan(s) initialized.`
                  : 'Your personal travel command center is ready. Initialize your first expedition or search for transit.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/plan"
                className="bg-horizon-amber text-ink-navy font-bold px-5 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-xs shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Plan New Trip</span>
              </Link>
              <Link
                to="/transport"
                className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2.5 rounded hover:bg-surface-container transition-all flex items-center gap-1.5 text-xs shadow-2xs"
              >
                <span className="material-symbols-outlined text-route-teal text-sm">commute</span>
                <span>Book Transit</span>
              </Link>
            </div>
          </div>

          {/* ========================================================
              STATE A: NEW USER EMPTY STATE (HONEST & ACTIONABLE)
              ======================================================== */}
          {!loading && !hasTrips && (
            <div className="space-y-6">
              {/* Three Quick Start Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-paper border-2 border-slate rounded-lg p-6 flex flex-col justify-between hover:border-horizon-amber transition-all shadow-xs group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-horizon-amber/20 rounded-lg flex items-center justify-center text-ink-navy border border-horizon-amber/40">
                      <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy group-hover:text-horizon-amber transition-colors">
                      1. Synthesize an Itinerary
                    </h3>
                    <p className="font-body-md text-slate text-xs leading-relaxed">
                      Enter any natural language prompt (e.g. "5 days in Goa") to get a structured day-by-day plan with timings and estimated costs.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate/40">
                    <Link
                      to="/plan"
                      className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Plan Your First Trip</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-paper border-2 border-slate rounded-lg p-6 flex flex-col justify-between hover:border-route-teal transition-all shadow-xs group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-route-teal/20 rounded-lg flex items-center justify-center text-route-teal border border-route-teal/40">
                      <span className="material-symbols-outlined text-2xl">commute</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy group-hover:text-route-teal transition-colors">
                      2. Search Flights, Trains & Buses
                    </h3>
                    <p className="font-body-md text-slate text-xs leading-relaxed">
                      Compare verified schedules, train statuses (Vande Bharat, Rajdhani), and sleeper buses with direct provider reservation links.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate/40">
                    <Link
                      to="/transport"
                      className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-2xs"
                    >
                      <span>Search Transportation</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-paper border-2 border-slate rounded-lg p-6 flex flex-col justify-between hover:border-slate transition-all shadow-xs group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary border border-slate/60">
                      <span className="material-symbols-outlined text-2xl">travel_explore</span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy group-hover:text-primary transition-colors">
                      3. Destination Climatology
                    </h3>
                    <p className="font-body-md text-slate text-xs leading-relaxed">
                      Check seasonal weather, peak vs. shoulder periods, crowd levels, and periods to avoid before locking in your dates.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate/40">
                    <Link
                      to="/city-search"
                      className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-2xs"
                    >
                      <span>Explore Destinations</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Personalized Curated Corridors (Based on User's Persona) */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-slate pb-3">
                  <div>
                    <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase tracking-wider">
                      MATCHING YOUR PERSONA ({userStyles.join(', ')})
                    </span>
                    <h2 className="font-headline-md text-xl font-bold text-ink-navy">
                      Suggested Expeditions For You
                    </h2>
                  </div>
                  <span className="text-xs text-slate font-data-mono">1-click to auto-synthesize</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displaySuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-paper border border-slate rounded-lg overflow-hidden shadow-xs hover:border-horizon-amber transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-paper/90 backdrop-blur-xs border border-slate px-2 py-0.5 rounded font-data-mono text-[10px] font-bold text-ink-navy">
                            {item.days} DAYS
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.tags.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 bg-surface-container text-slate text-[10px] font-data-mono rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                          <h4 className="font-headline-sm text-base font-bold text-ink-navy">{item.name}</h4>
                          <p className="font-body-md text-xs text-slate leading-relaxed">{item.description}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex justify-between items-center border-t border-slate/40 mt-3 pt-3">
                        <span className="text-xs font-data-mono font-bold text-horizon-amber">
                          Est. {formatCurrency(item.budgetUsd)}
                        </span>
                        <Link
                          to={`/plan?prompt=${encodeURIComponent(item.prompt)}`}
                          className="bg-ink-navy text-paper font-bold px-3 py-1.5 rounded text-xs hover:bg-opacity-90 flex items-center gap-1 transition-all"
                        >
                          <span>Plan Itinerary</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE B: POPULATED DASHBOARD (FOR USERS WITH TRIPS)
              ======================================================== */}
          {hasTrips && (
            <div className="space-y-6">
              {/* Live Expedition Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                <div className="bg-paper border border-slate p-5 rounded-lg space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                    <span className="material-symbols-outlined text-sm text-horizon-amber">flight_takeoff</span>
                    <span>SAVED ITINERARIES</span>
                  </div>
                  <div className="font-headline-lg text-3xl font-bold text-ink-navy">{trips.length}</div>
                </div>

                <div className="bg-paper border border-slate p-5 rounded-lg space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                    <span className="material-symbols-outlined text-sm text-route-teal">location_on</span>
                    <span>ACTIVE DESTINATIONS</span>
                  </div>
                  <div className="font-headline-lg text-3xl font-bold text-ink-navy">{stops.length}</div>
                </div>

                <div className="bg-paper border border-slate p-5 rounded-lg space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                    <span className="material-symbols-outlined text-sm text-emerald-600">account_balance_wallet</span>
                    <span>ESTIMATED TRIP BUDGET</span>
                  </div>
                  <div className="font-headline-lg text-3xl font-bold text-horizon-amber">
                    {formatCurrency(totalCost)}
                  </div>
                </div>
              </div>

              {/* Latest Featured Itinerary Card */}
              {latestTrip && (
                <div className="bg-paper border-2 border-ink-navy rounded-lg p-6 space-y-4 shadow-[4px_4px_0px_0px_#1B2A4A]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal font-data-mono-sm text-xs font-bold rounded border border-route-teal/30">
                        LATEST EXPEDITION
                      </span>
                      <h2 className="font-headline-md text-xl font-bold text-ink-navy">{latestTrip.name}</h2>
                    </div>
                    <span className="font-data-mono text-xs text-slate">
                      {latestTrip.start_date} → {latestTrip.end_date}
                    </span>
                  </div>

                  <p className="font-body-md text-sm text-slate">
                    {latestTrip.description || 'Custom multi-city travel itinerary.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                      <div className="font-data-mono text-xs text-slate">WAYPOINT STOPS</div>
                      <div className="font-bold text-ink-navy text-lg">{stops.length}</div>
                    </div>
                    <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                      <div className="font-data-mono text-xs text-slate">CURATED ACTIVITIES</div>
                      <div className="font-bold text-ink-navy text-lg">{totalActivities}</div>
                    </div>
                    <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                      <div className="font-data-mono text-xs text-slate">TOTAL DURATION</div>
                      <div className="font-bold text-ink-navy text-lg">{daysCount} Days</div>
                    </div>
                    <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                      <div className="font-data-mono text-xs text-slate">BUDGET TOTAL</div>
                      <div className="font-bold text-horizon-amber text-lg">{formatCurrency(totalCost)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <Link
                      to={`/builder?tripId=${latestTrip.id}`}
                      className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Edit in Builder</span>
                    </Link>

                    <Link
                      to={`/itinerary?tripId=${latestTrip.id}`}
                      className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>View Itinerary</span>
                    </Link>

                    <Link
                      to={`/transport?destination=${encodeURIComponent(stops[0]?.city_name || latestTrip.name)}`}
                      className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-route-teal text-sm">commute</span>
                      <span>Find Flights/Trains</span>
                    </Link>

                    <Link
                      to={`/budget?tripId=${latestTrip.id}`}
                      className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                      <span>Budget Breakdown</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* All Saved Expeditions List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate pb-2">
                  <h2 className="font-headline-md text-xl font-bold text-ink-navy">
                    Your Saved Itineraries ({trips.length})
                  </h2>
                  <Link to="/trips" className="text-xs font-bold text-horizon-amber font-data-mono hover:underline">
                    View Full Directory →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map(trip => (
                    <div
                      key={trip.id}
                      className="bg-paper border border-slate rounded-lg overflow-hidden shadow-xs hover:border-horizon-amber transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-36 overflow-hidden relative">
                          <img
                            src={trip.cover_photo_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-paper/90 backdrop-blur-xs border border-slate px-2 py-0.5 rounded font-data-mono text-[10px] font-bold text-ink-navy">
                            {trip.stops?.length || 0} STOPS
                          </div>
                        </div>

                        <div className="p-4 space-y-1.5">
                          <h4 className="font-headline-sm text-base font-bold text-ink-navy truncate">{trip.name}</h4>
                          <p className="font-data-mono text-[11px] text-slate">{trip.start_date} → {trip.end_date}</p>
                          <p className="font-body-md text-xs text-slate line-clamp-2 mt-1">
                            {trip.description || 'Custom multi-city travel itinerary.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex justify-between items-center border-t border-slate/40 mt-3 pt-3">
                        <Link
                          to={`/builder?tripId=${trip.id}`}
                          className="text-xs font-bold text-ink-navy hover:text-horizon-amber flex items-center gap-1 font-data-mono"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Edit</span>
                        </Link>
                        <Link
                          to={`/itinerary?tripId=${trip.id}`}
                          className="bg-horizon-amber text-ink-navy font-bold px-3 py-1 rounded text-xs hover:opacity-90 flex items-center gap-1"
                        >
                          <span>Itinerary</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
