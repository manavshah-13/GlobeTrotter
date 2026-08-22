import React, { useState } from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

const ACTIVITIES = [
  { id: 1, title: 'Tsukiji Outer Market Food Tour', city: 'Tokyo', category: 'Culinary', rating: 4.9, price: '$75', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80' },
  { id: 2, title: 'Fushimi Inari Early Morning Shrine Hike', city: 'Kyoto', category: 'Culture & Nature', rating: 4.9, price: '$35', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80' },
  { id: 3, title: 'Kanazawa Gold Leaf Crafting Workshop', city: 'Kanazawa', category: 'Art & Craft', rating: 4.8, price: '$45', img: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=500&q=80' },
  { id: 4, title: 'Dotonbori Street Food & Izakaya Crawl', city: 'Osaka', category: 'Nightlife', rating: 4.7, price: '$60', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80' }
];

export default function ActivitySearchPage() {
  const [query, setQuery] = useState('');

  const filtered = ACTIVITIES.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.city.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Activity Search" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <h1 className="font-headline-lg text-3xl font-bold text-primary mb-2">Explore Activities & Tours</h1>
            <p className="font-body-md text-slate mb-6">Discover curated experiences across major world destinations.</p>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activities, food tours, outdoor adventures..."
                className="w-full bg-paper border border-slate rounded-lg pl-12 pr-4 py-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
              />
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate">search</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {filtered.map(act => (
              <div key={act.id} className="bg-paper border border-slate rounded-lg overflow-hidden flex flex-col hover:border-horizon-amber transition-all">
                <div className="h-40 relative">
                  <img src={act.img} alt={act.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-2.5 py-0.5 rounded border border-slate text-xs font-data-mono text-ink-navy">
                    {act.city}
                  </span>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-data-mono text-route-teal">{act.category}</span>
                    <h3 className="font-headline-sm font-bold text-base text-ink-navy mt-1">{act.title}</h3>
                  </div>
                  <div className="flex justify-between items-center text-xs font-data-mono pt-3 border-t border-slate">
                    <span className="text-slate">⭐ {act.rating}</span>
                    <span className="font-bold text-ink-navy text-sm">{act.price}</span>
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
