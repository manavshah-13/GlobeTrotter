import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getTrips } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getTrips(user?.id);
        setTrips(data || []);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const latestTrip = trips[0];
  const stops = latestTrip?.stops || [];
  const totalActivities = stops.reduce((acc, st) => acc + (st.trip_activities?.length || 0), 0);
  const activitiesTotal = stops.reduce((acc, st) => acc + (st.trip_activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);

  const startMs = latestTrip?.start_date ? new Date(latestTrip.start_date).getTime() : Date.now();
  const endMs = latestTrip?.end_date ? new Date(latestTrip.end_date).getTime() : Date.now() + 86400000 * 4;
  const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) || (stops.length * 2) || 4);

  const transitTotal = stops.length > 0 ? (stops.length > 1 ? stops.length * 1500 : 800) : 0;
  const lodgingTotal = stops.length > 0 ? daysCount * 3000 : 0;
  const foodTotal = stops.length > 0 ? daysCount * 1000 : 0;
  const totalCost = activitiesTotal + transitTotal + lodgingTotal + foodTotal;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Command Dashboard" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
                Welcome back, {user?.name || 'Explorer'}
              </h1>
              <p className="font-body-md text-slate mt-1">
                {trips.length > 0
                  ? `You have ${trips.length} active expedition plans saved.`
                  : 'Ready to map out your next multi-city journey?'}
              </p>
            </div>

            <Link
              to="/plan"
              className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Plan New Trip</span>
            </Link>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
            <div className="bg-paper border border-slate p-5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                <span className="material-symbols-outlined text-sm">flight_takeoff</span>
                <span>TOTAL EXPEDITIONS</span>
              </div>
              <div className="font-headline-lg text-3xl font-bold text-ink-navy">{trips.length}</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>ACTIVE WAYPOINTS</span>
              </div>
              <div className="font-headline-lg text-3xl font-bold text-ink-navy">{stops.length}</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span>EST. LATEST BUDGET</span>
              </div>
              <div className="font-headline-lg text-3xl font-bold text-horizon-amber">
                ₹{totalCost.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Featured / Active Trip Card */}
          {latestTrip ? (
            <div className="bg-paper border border-slate rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal font-data-mono-sm text-xs font-bold rounded border border-route-teal/30">
                    FEATURED ITINERARY
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                  <div className="font-data-mono text-xs text-slate">WAYPOINT STOPS</div>
                  <div className="font-bold text-ink-navy text-lg">{stops.length}</div>
                </div>
                <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                  <div className="font-data-mono text-xs text-slate">ACTIVITIES</div>
                  <div className="font-bold text-ink-navy text-lg">{totalActivities}</div>
                </div>
                <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                  <div className="font-data-mono text-xs text-slate">DURATION</div>
                  <div className="font-bold text-ink-navy text-lg">{daysCount} Days</div>
                </div>
                <div className="bg-surface-container p-3 rounded border border-slate/60 text-center">
                  <div className="font-data-mono text-xs text-slate">EST. TOTAL</div>
                  <div className="font-bold text-horizon-amber text-lg">₹{totalCost.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to={`/builder?tripId=${latestTrip.id}`}
                  className="bg-horizon-amber text-ink-navy font-bold px-5 py-2 rounded text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit in Builder</span>
                </Link>

                <Link
                  to={`/itinerary?tripId=${latestTrip.id}`}
                  className="bg-paper border border-slate text-ink-navy font-bold px-5 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>View Itinerary</span>
                </Link>

                <Link
                  to={`/budget?tripId=${latestTrip.id}`}
                  className="bg-paper border border-slate text-ink-navy font-bold px-5 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  <span>Budget Breakdown</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-paper border border-slate rounded-lg p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-slate">
                <span className="material-symbols-outlined text-3xl">map</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-ink-navy">No Expeditions Planned Yet</h3>
              <p className="font-body-md text-sm text-slate max-w-md mx-auto">
                Use the AI travel assistant to build a complete multi-city itinerary in seconds.
              </p>
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 bg-horizon-amber text-ink-navy font-bold px-6 py-3 rounded text-sm hover:opacity-90"
              >
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Plan Your First Expedition</span>
              </Link>
            </div>
          )}

          {/* Recommended Destinations Grid */}
          <div className="space-y-4">
            <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-2">
              Recommended Destinations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              <div className="bg-paper border border-slate rounded-lg overflow-hidden shadow-sm group">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1609946727292-c94318c5e638?auto=format&fit=crop&w=600&q=80"
                    alt="Ujjain"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-paper/90 backdrop-blur-sm border border-slate px-2 py-0.5 rounded font-data-mono text-[10px] font-bold text-ink-navy">
                    HERITAGE
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-headline-sm font-bold text-base text-ink-navy">Ujjain, Madhya Pradesh</h3>
                  <p className="font-body-md text-xs text-slate line-clamp-2">
                    Ancient spiritual city on Shipra river famous for Mahakaleshwar temple & heritage ghats.
                  </p>
                  <div className="flex justify-between items-center pt-2 font-data-mono text-xs">
                    <span className="text-route-teal font-bold">Est: ₹6,500 / 4 Days</span>
                    <Link to="/plan" className="text-ink-navy font-bold underline">Plan →</Link>
                  </div>
                </div>
              </div>

              <div className="bg-paper border border-slate rounded-lg overflow-hidden shadow-sm group">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80"
                    alt="Kashmir"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-paper/90 backdrop-blur-sm border border-slate px-2 py-0.5 rounded font-data-mono text-[10px] font-bold text-ink-navy">
                    NATURE
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-headline-sm font-bold text-base text-ink-navy">Srinagar & Gulmarg, Kashmir</h3>
                  <p className="font-body-md text-xs text-slate line-clamp-2">
                    Pristine Dal Lake shikara rides, Mughal Gardens, and alpine gondola snow peaks.
                  </p>
                  <div className="flex justify-between items-center pt-2 font-data-mono text-xs">
                    <span className="text-route-teal font-bold">Est: ₹18,500 / 5 Days</span>
                    <Link to="/plan" className="text-ink-navy font-bold underline">Plan →</Link>
                  </div>
                </div>
              </div>

              <div className="bg-paper border border-slate rounded-lg overflow-hidden shadow-sm group">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80"
                    alt="Tokyo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-paper/90 backdrop-blur-sm border border-slate px-2 py-0.5 rounded font-data-mono text-[10px] font-bold text-ink-navy">
                    MODERN & CULTURE
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-headline-sm font-bold text-base text-ink-navy">Tokyo & Kyoto, Japan</h3>
                  <p className="font-body-md text-xs text-slate line-clamp-2">
                    Neon cityscapes, ancient shrines, bullet trains, and world-class culinary experiences.
                  </p>
                  <div className="flex justify-between items-center pt-2 font-data-mono text-xs">
                    <span className="text-route-teal font-bold">Est: ₹45,000 / 7 Days</span>
                    <Link to="/plan" className="text-ink-navy font-bold underline">Plan →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
