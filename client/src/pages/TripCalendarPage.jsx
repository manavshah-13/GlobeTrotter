import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTripDetails, getTrips } from '../services/api';

export default function TripCalendarPage() {
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
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const colors = [
    'bg-route-teal text-white border-route-teal',
    'bg-horizon-amber text-ink-navy border-horizon-amber',
    'bg-primary text-white border-primary',
    'bg-alert-coral text-white border-alert-coral'
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Trip Calendar" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Trip Calendar & Timeline</h1>
              <p className="font-body-md text-slate mt-1">
                {trip?.name || 'Active Expedition'} • {trip?.start_date} → {trip?.end_date}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 font-data-mono text-xs">
              {stops.map((s, idx) => (
                <span key={s.id || idx} className={`px-3 py-1 rounded font-bold ${colors[idx % colors.length]}`}>
                  {s.city_name || s.cities?.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-paper border border-slate rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center font-headline-sm font-bold text-xs md:text-sm text-ink-navy border-b border-slate pb-2">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map(d => {
                const assignedStop = stops[d % (stops.length || 1)];
                const isTripDay = d >= 8 && d <= (8 + Math.min(20, stops.length * 4));
                const stopName = assignedStop?.city_name || assignedStop?.cities?.name || 'Stop';

                return (
                  <div
                    key={d}
                    className={`min-h-[80px] md:h-24 border rounded p-2 flex flex-col justify-between font-data-mono text-xs transition-all ${
                      isTripDay ? 'border-route-teal bg-surface-container shadow-xs' : 'border-slate/40 bg-paper text-slate'
                    }`}
                  >
                    <span className="font-bold">{d}</span>
                    {isTripDay && (
                      <span className="bg-route-teal/15 text-route-teal border border-route-teal/30 text-[10px] p-1 rounded font-bold truncate">
                        {stopName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
