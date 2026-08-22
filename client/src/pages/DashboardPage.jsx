import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getTrips } from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await getTrips(user?.id);
        setTrips(data || []);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user?.id]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const latestTrip = trips[0];
  const stops = latestTrip?.stops || [];
  const totalActivities = stops.reduce((acc, st) => acc + (st.trip_activities?.length || 0), 0);
  const totalCost = stops.reduce((acc, st) => acc + (st.trip_activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Dashboard" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
                Welcome back, {user?.name || 'Traveler'}
              </h1>
              <p className="font-body-md text-slate mt-1">
                {trips.length > 0
                  ? `You have ${trips.length} expedition${trips.length > 1 ? 's' : ''} organized.`
                  : 'Start planning your next global expedition.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/plan"
                className="bg-horizon-amber text-ink-navy font-bold px-5 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Plan New Trip</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-paper border border-slate text-alert-coral font-bold px-4 py-2.5 rounded hover:bg-alert-coral/10 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-base text-alert-coral">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <Link to={latestTrip ? `/builder?tripId=${latestTrip.id}` : '/builder'} className="bg-paper border border-slate p-5 rounded-lg hover:border-horizon-amber transition-all group">
              <div className="w-10 h-10 rounded-full bg-route-teal/10 flex items-center justify-center text-route-teal mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">route</span>
              </div>
              <h3 className="font-headline-sm font-bold text-ink-navy">Itinerary Builder</h3>
              <p className="font-caption text-xs text-slate mt-1">Build route timeline & stops</p>
            </Link>

            <Link to="/city-search" className="bg-paper border border-slate p-5 rounded-lg hover:border-horizon-amber transition-all group">
              <div className="w-10 h-10 rounded-full bg-horizon-amber/10 flex items-center justify-center text-horizon-amber mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">location_city</span>
              </div>
              <h3 className="font-headline-sm font-bold text-ink-navy">City Explorer</h3>
              <p className="font-caption text-xs text-slate mt-1">Find top urban destinations</p>
            </Link>

            <Link to="/activity-search" className="bg-paper border border-slate p-5 rounded-lg hover:border-horizon-amber transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">local_activity</span>
              </div>
              <h3 className="font-headline-sm font-bold text-ink-navy">Activity Finder</h3>
              <p className="font-caption text-xs text-slate mt-1">Tours, food & cultural spots</p>
            </Link>

            <Link to="/budget" className="bg-paper border border-slate p-5 rounded-lg hover:border-horizon-amber transition-all group">
              <div className="w-10 h-10 rounded-full bg-alert-coral/10 flex items-center justify-center text-alert-coral mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <h3 className="font-headline-sm font-bold text-ink-navy">Budget Tracker</h3>
              <p className="font-caption text-xs text-slate mt-1">Expenses & financial breakdown</p>
            </Link>
          </div>

          {/* Hero Upcoming Trip Card */}
          {latestTrip ? (
            <div className="bg-paper border border-slate rounded-lg p-6 relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-route-teal">flight_takeoff</span>
                  <span className="font-data-mono-sm text-xs font-bold text-route-teal uppercase tracking-wider">PRIMARY EXPEDITION</span>
                </div>
                <span className="font-data-mono text-xs text-slate">ACTIVE • {latestTrip.id}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                  <h2 className="font-headline-lg text-2xl font-bold text-ink-navy">{latestTrip.name}</h2>
                  <p className="font-data-mono text-sm text-slate mt-1">{latestTrip.start_date} → {latestTrip.end_date}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">
                      {stops.length} Cities / Stops
                    </span>
                    <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">
                      {totalActivities} Activities
                    </span>
                    <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">
                      Activities Est: ${totalCost}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                  <Link
                    to={`/itinerary?tripId=${latestTrip.id}`}
                    className="bg-primary text-white text-center px-4 py-2.5 rounded font-medium text-sm hover:bg-opacity-90 transition-all"
                  >
                    View Itinerary
                  </Link>
                  <Link
                    to={`/builder?tripId=${latestTrip.id}`}
                    className="bg-paper border border-slate text-ink-navy text-center px-4 py-2.5 rounded font-medium text-sm hover:bg-surface-container transition-all"
                  >
                    Edit in Builder
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-paper border border-slate rounded-lg p-8 text-center space-y-3">
              <h3 className="font-headline-sm text-lg font-bold text-ink-navy">No Trips Created Yet</h3>
              <p className="text-slate font-body-md text-sm">Generate an itinerary using AI or configure your own manually.</p>
              <Link to="/plan" className="inline-block bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs">
                Plan a Trip Now
              </Link>
            </div>
          )}

          {/* Stats & Quick Links Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">TOTAL TRIPS PLANNED</div>
              <div className="font-headline-lg text-4xl font-bold text-ink-navy">{trips.length}</div>
              <Link to="/trips" className="text-xs text-route-teal hover:underline mt-2 inline-block">
                View all in My Trips →
              </Link>
            </div>

            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">PLANNED WAYPOINTS</div>
              <div className="font-headline-lg text-4xl font-bold text-horizon-amber">
                {trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0)}
              </div>
              <div className="text-xs text-slate mt-2">Active city stops</div>
            </div>

            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">COMMUNITY & SHARED</div>
              <div className="font-headline-lg text-4xl font-bold text-route-teal">
                {latestTrip ? '1 Active' : '0'}
              </div>
              <Link to={latestTrip ? `/shared?tripId=${latestTrip.id}` : '/shared'} className="text-xs text-horizon-amber hover:underline mt-2 inline-block">
                View Shared Link →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
