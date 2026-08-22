import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips } from '../services/api';

export default function BudgetBreakdownPage() {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let id = tripIdParam;
        if (!id) {
          const trips = await getTrips();
          if (trips && trips.length > 0) id = trips[0].id;
        }
        if (id) {
          const data = await getTripDetails(id);
          setTrip(data);
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripIdParam]);

  const stops = trip?.stops || [];
  const activities = stops.flatMap(s => (s.trip_activities || []).map(a => ({ ...a, cityName: s.city_name || s.cities?.name })));
  
  const activitiesTotal = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
  const transitTotal = 750;
  const lodgingTotal = Math.max(1, stops.length) * 180;
  const foodTotal = Math.max(1, stops.length * 2) * 55;
  const grandTotal = activitiesTotal + transitTotal + lodgingTotal + foodTotal;
  const totalAllocation = Math.max(grandTotal + 400, 3500);
  const remaining = totalAllocation - grandTotal;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Budget Breakdown" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Budget & Cost Breakdown</h1>
              <p className="font-body-md text-slate mt-1">
                {trip?.name || 'Trip Expedition'} • Total Allocation: ${totalAllocation.toLocaleString()}
              </p>
            </div>

            <div className="bg-surface-container border border-slate p-4 rounded-lg flex items-center gap-6">
              <div>
                <div className="font-data-mono-sm text-xs text-slate">TOTAL EXPENSES</div>
                <div className="font-headline-lg text-2xl font-bold text-horizon-amber">${grandTotal.toLocaleString()}</div>
              </div>
              <div className="h-8 w-px bg-slate"></div>
              <div>
                <div className="font-data-mono-sm text-xs text-slate">REMAINING</div>
                <div className="font-headline-lg text-2xl font-bold text-route-teal">${remaining.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs mb-1">
                <span className="material-symbols-outlined text-sm">flight</span>
                <span>TRANSIT & FLIGHTS</span>
              </div>
              <div className="font-headline-lg text-xl font-bold text-ink-navy">${transitTotal}</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs mb-1">
                <span className="material-symbols-outlined text-sm">hotel</span>
                <span>LODGING ({stops.length} CITIES)</span>
              </div>
              <div className="font-headline-lg text-xl font-bold text-ink-navy">${lodgingTotal}</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs mb-1">
                <span className="material-symbols-outlined text-sm">local_activity</span>
                <span>ACTIVITIES ({activities.length})</span>
              </div>
              <div className="font-headline-lg text-xl font-bold text-ink-navy">${activitiesTotal}</div>
            </div>

            <div className="bg-paper border border-slate p-5 rounded-lg">
              <div className="flex items-center gap-2 text-slate font-data-mono-sm text-xs mb-1">
                <span className="material-symbols-outlined text-sm">restaurant</span>
                <span>MEALS & DINING</span>
              </div>
              <div className="font-headline-lg text-xl font-bold text-ink-navy">${foodTotal}</div>
            </div>
          </div>

          <div className="bg-paper border border-slate rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate pb-3">
              <h2 className="font-headline-md text-xl font-bold text-ink-navy">Itemized Expense Log</h2>
              {trip && (
                <Link to={`/builder?tripId=${trip.id}`} className="text-xs text-route-teal font-bold hover:underline">
                  + Add Activities in Builder
                </Link>
              )}
            </div>

            <div className="space-y-3 font-data-mono text-sm">
              {/* Base category expenses */}
              <div className="flex items-center justify-between p-4 bg-surface-container border border-slate/60 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-route-teal p-2 bg-paper rounded border border-slate text-lg">flight</span>
                  <div>
                    <div className="font-bold text-ink-navy">Flights & Multi-City Rail Passes</div>
                    <div className="text-xs text-slate">Transit</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ink-navy text-base">${transitTotal}</div>
                  <span className="text-xs text-route-teal bg-route-teal/10 px-2 py-0.5 rounded border border-route-teal/30">Estimated</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container border border-slate/60 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-route-teal p-2 bg-paper rounded border border-slate text-lg">hotel</span>
                  <div>
                    <div className="font-bold text-ink-navy">Accommodations & Hotels ({stops.length} Stays)</div>
                    <div className="text-xs text-slate">Lodging</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ink-navy text-base">${lodgingTotal}</div>
                  <span className="text-xs text-route-teal bg-route-teal/10 px-2 py-0.5 rounded border border-route-teal/30">Estimated</span>
                </div>
              </div>

              {/* Dynamic Activities */}
              {activities.map((act, i) => (
                <div key={act.id || i} className="flex items-center justify-between p-4 bg-surface-container border border-slate/60 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-horizon-amber p-2 bg-paper rounded border border-slate text-lg">local_activity</span>
                    <div>
                      <div className="font-bold text-ink-navy">{act.custom_name}</div>
                      <div className="text-xs text-slate">{act.cityName ? `${act.cityName} • ` : ''}{act.category || 'Activity'}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-ink-navy text-base">${act.cost ?? 0}</div>
                    <span className="text-xs text-horizon-amber bg-horizon-amber/10 px-2 py-0.5 rounded border border-horizon-amber/30">Planned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
