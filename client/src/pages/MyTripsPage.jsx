import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

const TRIP_CATEGORIES = [
  {
    category: 'Ongoing',
    badge: 'ACTIVE NOW',
    badgeColor: 'bg-route-teal text-white border-route-teal',
    trips: [
      {
        id: 'japan-ongoing',
        title: 'Autumn in Japan: Tokyo & Kyoto Expedition',
        overview: 'Short Overview of the Trip: Currently exploring Shinjuku and preparing for Shinkansen transit to Kanazawa.',
        dates: 'OCT 12 - OCT 24, 2024',
        code: 'TYO-KYO',
        stops: 'Tokyo, Kanazawa, Kyoto',
        budget: '$3,450'
      }
    ]
  },
  {
    category: 'Upcoming',
    badge: 'CONFIRMED',
    badgeColor: 'bg-horizon-amber text-ink-navy border-horizon-amber',
    trips: [
      {
        id: 'swiss-upcoming',
        title: 'Swiss Alps Hiking & Glacier Trek',
        overview: 'Short Overview of the Trip: Multi-day mountain hut trek starting in Zurich, passing through Lucerne and Zermatt.',
        dates: 'JUN 10 - JUN 22, 2025',
        code: 'ZRH-ZMR',
        stops: 'Zurich, Lucerne, Interlaken, Zermatt',
        budget: '$4,200'
      }
    ]
  },
  {
    category: 'Completed',
    badge: 'ARCHIVED',
    badgeColor: 'bg-surface-container text-slate border-slate',
    trips: [
      {
        id: 'amalfi-completed',
        title: 'Amalfi Coast Coastal Drive & Island Tour',
        overview: 'Short Overview of the Trip: Completed 8-day Mediterranean coastal road trip from Naples to Positano and Capri.',
        dates: 'MAY 14 - MAY 22, 2023',
        code: 'NAP-POS',
        stops: 'Naples, Positano, Capri',
        budget: '$2,900'
      }
    ]
  }
];

export default function MyTripsPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="User Trip Listing (Screen 6)" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">User Trip Listing</h1>
              <p className="font-body-md text-slate mt-1">Categorized overview of ongoing, upcoming, and completed expeditions.</p>
            </div>
            <Link
              to="/plan"
              className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Create a New Trip</span>
            </Link>
          </div>

          {/* Categorized Sections matching Screen 6 Wireframe */}
          <div className="space-y-8">
            {TRIP_CATEGORIES.map((catGroup) => (
              <div key={catGroup.category} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate pb-2">
                  <h2 className="font-headline-md text-2xl font-bold text-ink-navy">{catGroup.category}</h2>
                  <span className={`text-xs font-data-mono px-2.5 py-0.5 rounded border font-bold ${catGroup.badgeColor}`}>
                    {catGroup.badge}
                  </span>
                </div>

                <div className="space-y-4">
                  {catGroup.trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-paper border border-slate rounded-lg p-6 hover:border-horizon-amber transition-all shadow-sm relative space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-data-mono-sm text-xs font-bold text-ink-navy bg-surface-container border border-slate px-2.5 py-1 rounded">
                            {trip.code}
                          </span>
                          <h3 className="font-headline-sm text-xl font-bold text-ink-navy">{trip.title}</h3>
                        </div>
                        <span className="font-data-mono text-xs text-slate">{trip.dates}</span>
                      </div>

                      {/* Wireframe Banner Box: Short Overview of the Trip */}
                      <div className="p-4 bg-surface-container border border-slate/60 rounded-lg">
                        <p className="font-body-md text-sm text-ink-navy font-medium">{trip.overview}</p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-data-mono border-t border-slate/40">
                        <span className="text-slate">Destinations: <strong className="text-ink-navy">{trip.stops}</strong> • Est: <strong className="text-ink-navy">{trip.budget}</strong></span>
                        <div className="flex gap-3">
                          <Link to="/itinerary" className="text-route-teal hover:underline font-bold flex items-center gap-1">
                            <span>Open Details</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
