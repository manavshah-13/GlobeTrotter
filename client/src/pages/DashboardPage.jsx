import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Dashboard" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Welcome back, Traveler</h1>
              <p className="font-body-md text-slate mt-1">You have 1 upcoming expedition to Japan in 14 days.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/plan"
                className="bg-horizon-amber text-ink-navy font-bold px-5 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
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
            <Link to="/builder" className="bg-paper border border-slate p-5 rounded-lg hover:border-horizon-amber transition-all group">
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
          <div className="bg-paper border border-slate rounded-lg p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-route-teal">flight_takeoff</span>
                <span className="font-data-mono-sm text-xs font-bold text-route-teal uppercase tracking-wider">UPCOMING EXPEDITION</span>
              </div>
              <span className="font-data-mono text-xs text-slate">CONFIRMED • GT-8842</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <h2 className="font-headline-lg text-2xl font-bold text-ink-navy">Autumn in Japan: Tokyo & Kyoto</h2>
                <p className="font-data-mono text-sm text-slate mt-1">OCT 12, 2024 - OCT 24, 2024 (12 DAYS)</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">3 Cities</span>
                  <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">14 Activities</span>
                  <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-data-mono text-ink-navy border border-slate">Budget $3,450</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link
                  to="/itinerary"
                  className="bg-primary text-white text-center px-4 py-2.5 rounded font-medium text-sm hover:bg-opacity-90 transition-all"
                >
                  View Itinerary
                </Link>
                <Link
                  to="/calendar"
                  className="bg-paper border border-slate text-ink-navy text-center px-4 py-2.5 rounded font-medium text-sm hover:bg-surface-container transition-all"
                >
                  Calendar Timeline
                </Link>
              </div>
            </div>
          </div>

          {/* Stats & Quick Links Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">TOTAL TRIPS PLANNED</div>
              <div className="font-headline-lg text-4xl font-bold text-ink-navy">12</div>
              <div className="text-xs text-route-teal mt-2">↑ 3 new this quarter</div>
            </div>

            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">COUNTRIES VISITED</div>
              <div className="font-headline-lg text-4xl font-bold text-horizon-amber">18</div>
              <div className="text-xs text-slate mt-2">Targeting 25 by end of year</div>
            </div>

            <div className="bg-paper border border-slate p-6 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">SHARED ITINERARIES</div>
              <div className="font-headline-lg text-4xl font-bold text-route-teal">8</div>
              <Link to="/shared" className="text-xs text-horizon-amber hover:underline mt-2 inline-block">
                View Shared Link →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
