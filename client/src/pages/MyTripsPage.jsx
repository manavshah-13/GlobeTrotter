import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

const TRIPS = [
  {
    id: 'japan-2024',
    title: 'Japan Expedition',
    dates: 'OCT 12 - OCT 24, 2024',
    code: 'TYO-KYO',
    status: 'Upcoming',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    stops: 'Tokyo, Kanazawa, Kyoto',
    budget: '$3,450'
  },
  {
    id: 'swiss-2025',
    title: 'Swiss Alps Hiking',
    dates: 'JUN 10 - JUN 22, 2025',
    code: 'ZRH-ZMR',
    status: 'Planning',
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
    stops: 'Zurich, Lucerne, Interlaken',
    budget: '$4,200'
  },
  {
    id: 'italy-2023',
    title: 'Amalfi Coast Drive',
    dates: 'MAY 14 - MAY 22, 2023',
    code: 'NAP-POS',
    status: 'Completed',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    stops: 'Naples, Positano, Capri',
    budget: '$2,900'
  }
];

export default function MyTripsPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="My Trips" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex justify-between items-center bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">My Trips</h1>
              <p className="font-body-md text-slate mt-1">Manage your active, upcoming, and archived itineraries.</p>
            </div>
            <Link
              to="/plan"
              className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              <span>New Trip</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {TRIPS.map((trip) => (
              <div key={trip.id} className="bg-paper border border-slate rounded-lg overflow-hidden flex flex-col group hover:border-horizon-amber transition-all shadow-sm">
                <div className="h-44 relative overflow-hidden bg-surface-container">
                  <img src={trip.img} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-3 py-1 rounded border border-slate font-data-mono-sm text-xs font-bold text-ink-navy">
                    {trip.code}
                  </div>
                  <span className={`absolute top-3 right-3 text-xs font-data-mono px-2 py-0.5 rounded border ${
                    trip.status === 'Upcoming' ? 'bg-route-teal text-white border-route-teal' : 'bg-surface-container text-ink-navy border-slate'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-headline-sm font-bold text-xl text-ink-navy">{trip.title}</h3>
                    <p className="font-data-mono text-xs text-slate mt-1">{trip.dates}</p>
                    <p className="font-body-md text-sm text-ink-navy mt-2">Stops: {trip.stops}</p>
                  </div>

                  <div className="pt-3 border-t border-slate flex justify-between items-center text-xs font-data-mono">
                    <span className="text-slate">Est. Budget: <strong className="text-ink-navy">{trip.budget}</strong></span>
                    <Link to="/itinerary" className="text-route-teal hover:underline font-bold flex items-center gap-1">
                      View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
