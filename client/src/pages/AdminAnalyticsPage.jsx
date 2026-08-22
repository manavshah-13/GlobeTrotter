import React from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function AdminAnalyticsPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Admin Analytics" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-data-mono font-bold rounded">SYSTEM DASHBOARD</span>
              <span className="text-xs font-data-mono text-slate">GlobeTrotter v2.1 Analytics</span>
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-primary">Admin & System Analytics</h1>
            <p className="font-body-md text-slate">Platform traffic, itinerary creation velocity, popular destinations, and server metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">TOTAL USERS</div>
              <div className="font-headline-lg text-3xl font-bold text-ink-navy">24,890</div>
              <div className="text-xs text-route-teal mt-1">↑ +14% vs last month</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">ACTIVE ITINERARIES</div>
              <div className="font-headline-lg text-3xl font-bold text-horizon-amber">142,300</div>
              <div className="text-xs text-route-teal mt-1">↑ +8% creation rate</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">SHARED ITINERARY VIEWS</div>
              <div className="font-headline-lg text-3xl font-bold text-route-teal">890,450</div>
              <div className="text-xs text-slate mt-1">Avg 6.2 views per link</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="font-data-mono-sm text-xs text-slate mb-1">SYSTEM UPTIME</div>
              <div className="font-headline-lg text-3xl font-bold text-primary">99.98%</div>
              <div className="text-xs text-slate mt-1">Latency 42ms</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
              <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Top Destinations (This Month)</h3>
              <div className="space-y-3 font-data-mono text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate">
                  <span>1. Tokyo, Japan</span>
                  <span className="font-bold text-horizon-amber">14,200 Trips</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate">
                  <span>2. Zurich, Switzerland</span>
                  <span className="font-bold text-horizon-amber">9,800 Trips</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate">
                  <span>3. Amalfi Coast, Italy</span>
                  <span className="font-bold text-horizon-amber">8,450 Trips</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4. Kyoto, Japan</span>
                  <span className="font-bold text-horizon-amber">7,900 Trips</span>
                </div>
              </div>
            </div>

            <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
              <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Recent User Signups</h3>
              <div className="space-y-3 font-data-mono text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate">
                  <div>
                    <div className="font-bold text-ink-navy">Sarah Jenkins</div>
                    <div className="text-xs text-slate">sarah.j@example.com</div>
                  </div>
                  <span className="text-xs text-route-teal">Just now</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate">
                  <div>
                    <div className="font-bold text-ink-navy">Marcus Vance</div>
                    <div className="text-xs text-slate">mvance@example.com</div>
                  </div>
                  <span className="text-xs text-slate">12 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
