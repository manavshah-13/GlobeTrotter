import React from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function TripCalendarPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Trip Calendar" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex justify-between items-center bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Trip Calendar & Timeline</h1>
              <p className="font-body-md text-slate mt-1">October 2024 • Japan Expedition</p>
            </div>
            <div className="flex gap-2 font-data-mono text-xs">
              <span className="px-3 py-1 bg-route-teal text-white rounded">Tokyo (Oct 12-16)</span>
              <span className="px-3 py-1 bg-horizon-amber text-ink-navy rounded">Kanazawa (Oct 16-18)</span>
              <span className="px-3 py-1 bg-primary text-white rounded">Kyoto (Oct 18-24)</span>
            </div>
          </div>

          <div className="bg-paper border border-slate rounded-lg p-6">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center font-headline-sm font-bold text-sm text-ink-navy">
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
                const isTrip = d >= 12 && d <= 24;
                const isTokyo = d >= 12 && d <= 16;
                const isKanazawa = d >= 16 && d <= 18;
                const isKyoto = d >= 18 && d <= 24;

                return (
                  <div
                    key={d}
                    className={`h-24 border rounded p-2 flex flex-col justify-between font-data-mono text-xs ${
                      isTrip ? 'border-route-teal bg-surface-container' : 'border-slate/40 bg-paper text-slate'
                    }`}
                  >
                    <span className="font-bold">{d}</span>
                    {isTokyo && (
                      <span className="bg-route-teal/20 text-route-teal text-[10px] p-1 rounded font-bold truncate">
                        Tokyo
                      </span>
                    )}
                    {isKanazawa && (
                      <span className="bg-horizon-amber/20 text-horizon-amber text-[10px] p-1 rounded font-bold truncate">
                        Kanazawa
                      </span>
                    )}
                    {isKyoto && (
                      <span className="bg-primary/20 text-primary text-[10px] p-1 rounded font-bold truncate">
                        Kyoto
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
