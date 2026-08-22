import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function ItineraryViewPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Itinerary View" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Header Card */}
          <div className="bg-paper border border-slate p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30">CONFIRMED ITINERARY</span>
                <span className="text-xs font-data-mono text-slate">ID: GT-JAP-2024</span>
              </div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary mt-1">Autumn in Japan Expedition</h1>
              <p className="font-data-mono text-sm text-slate">Oct 12, 2024 - Oct 24, 2024 • 12 Days • 3 Cities</p>
            </div>

            <div className="flex gap-3">
              <Link to="/shared" className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded hover:bg-surface-container flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share Link</span>
              </Link>
              <Link to="/builder" className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded hover:bg-opacity-90 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Itinerary</span>
              </Link>
            </div>
          </div>

          {/* Detailed Day-by-Day Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-route-teal">today</span>
                  Day 1 - Arrival in Tokyo (Shinjuku)
                </h2>
                <div className="space-y-3 font-body-md text-sm">
                  <div className="flex items-start gap-3 p-3 bg-surface-container rounded border border-slate/50">
                    <span className="font-data-mono text-xs font-bold text-route-teal w-16">15:00</span>
                    <div>
                      <div className="font-bold text-ink-navy">Check-in at Hotel Gracery Shinjuku</div>
                      <div className="text-xs text-slate">Shinjuku 1-19-1, Tokyo</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-surface-container rounded border border-slate/50">
                    <span className="font-data-mono text-xs font-bold text-route-teal w-16">18:00</span>
                    <div>
                      <div className="font-bold text-ink-navy">Omoide Yokocho Food & Yakitori Tour</div>
                      <div className="text-xs text-slate">LocalIzakaya guide reserved</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-route-teal">today</span>
                  Day 2 - Cultural Highlights of Asakusa & Ueno
                </h2>
                <div className="space-y-3 font-body-md text-sm">
                  <div className="flex items-start gap-3 p-3 bg-surface-container rounded border border-slate/50">
                    <span className="font-data-mono text-xs font-bold text-route-teal w-16">09:00</span>
                    <div>
                      <div className="font-bold text-ink-navy">Senso-ji Temple & Nakamise Shopping</div>
                      <div className="text-xs text-slate">Early morning visit to avoid crowds</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-surface-container rounded border border-slate/50">
                    <span className="font-data-mono text-xs font-bold text-route-teal w-16">13:30</span>
                    <div>
                      <div className="font-bold text-ink-navy">Ueno Park & Tokyo National Museum</div>
                      <div className="text-xs text-slate">Exhibits on Edo period culture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Overview Panel */}
            <div className="space-y-6">
              <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Trip Summary</h3>
                <div className="space-y-2 text-sm font-data-mono">
                  <div className="flex justify-between text-slate">
                    <span>Flights:</span>
                    <span className="text-ink-navy font-bold">$1,200</span>
                  </div>
                  <div className="flex justify-between text-slate">
                    <span>Hotels (11 Nights):</span>
                    <span className="text-ink-navy font-bold">$1,450</span>
                  </div>
                  <div className="flex justify-between text-slate">
                    <span>Activities:</span>
                    <span className="text-ink-navy font-bold">$400</span>
                  </div>
                  <div className="pt-2 border-t border-slate flex justify-between font-bold text-ink-navy text-base">
                    <span>Total Est:</span>
                    <span className="text-horizon-amber">$3,050</span>
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
        </main>
      </div>
    </div>
  );
}
