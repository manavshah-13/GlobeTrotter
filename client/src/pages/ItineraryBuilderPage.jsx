import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function ItineraryBuilderPage() {
  const [stops, setStops] = useState([
    { id: 1, city: 'Tokyo', duration: '4 Days', highlights: 'Shibuya Crossing, Senso-ji Temple, Shinjuku Food Tour', status: 'Confirmed' },
    { id: 2, city: 'Kanazawa', duration: '2 Days', highlights: 'Kenroku-en Garden, Chaya District, Geisha House', status: 'Planning' },
    { id: 3, city: 'Kyoto', duration: '4 Days', highlights: 'Fushimi Inari Shrine, Arashiyama Bamboo Grove, Kinkaku-ji', status: 'Confirmed' },
    { id: 4, city: 'Osaka', duration: '2 Days', highlights: 'Dotonbori Street Food, Osaka Castle, Universal Studios', status: 'Draft' }
  ]);

  const addStop = () => {
    const newStop = {
      id: Date.now(),
      city: 'Nara',
      duration: '1 Day',
      highlights: 'Deer Park, Todai-ji Great Buddha Temple',
      status: 'Draft'
    };
    setStops([...stops, newStop]);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Itinerary Builder" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Itinerary Builder</h1>
              <p className="font-body-md text-slate mt-1">Japan Expedition • Oct 12 - Oct 24, 2024 (12 Days)</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addStop}
                className="bg-horizon-amber text-ink-navy font-bold px-4 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add_location</span>
                <span>Add Waypoint</span>
              </button>
              <Link
                to="/itinerary"
                className="bg-route-teal text-white font-bold px-4 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
                <span>View Final Itinerary</span>
              </Link>
            </div>
          </div>

          {/* Timeline spine builder */}
          <div className="bg-paper border border-slate rounded-lg p-6 relative">
            <div className="relative pl-8 space-y-8">
              {/* Route dash spine line */}
              <div className="absolute left-3 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-route-teal opacity-60"></div>

              {stops.map((stop, idx) => (
                <div key={stop.id} className="relative flex items-start gap-4 group">
                  {/* Waypoint Dot */}
                  <div className="absolute -left-8 top-1.5 w-6 h-6 bg-paper border-2 border-route-teal rounded-full flex items-center justify-center font-data-mono-sm text-xs font-bold text-route-teal">
                    {idx + 1}
                  </div>

                  <div className="flex-grow bg-surface-container border border-slate rounded-lg p-4 group-hover:border-horizon-amber transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-headline-sm font-bold text-xl text-ink-navy">{stop.city}</h3>
                        <span className="px-2.5 py-0.5 bg-paper text-slate border border-slate text-xs font-data-mono rounded">
                          {stop.duration}
                        </span>
                      </div>
                      <span className={`text-xs font-data-mono px-2 py-0.5 rounded border ${
                        stop.status === 'Confirmed' ? 'bg-route-teal/10 text-route-teal border-route-teal/30' : 'bg-horizon-amber/10 text-horizon-amber border-horizon-amber/30'
                      }`}>
                        {stop.status}
                      </span>
                    </div>

                    <p className="text-sm font-body-md text-slate mb-3">{stop.highlights}</p>

                    <div className="flex gap-4 text-xs font-data-mono text-route-teal pt-2 border-t border-slate/30">
                      <button className="hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit</span> Edit Stop
                      </button>
                      <button className="hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">hotel</span> Stays & Hotels
                      </button>
                      <button className="hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">directions_transit</span> Transit Info
                      </button>
                    </div>
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
