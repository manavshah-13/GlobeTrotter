import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTrips, addStop } from '../services/api';

const CITIES = [
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', code: 'TYO', rating: '4.9', bestSeason: 'Oct - Nov, Mar - Apr', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80', desc: 'Futuristic skyscrapers, historic temples, and world-class gastronomy.' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', code: 'UKY', rating: '4.9', bestSeason: 'Autumn & Spring', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80', desc: 'Traditional wooden houses, Shinto shrines, and bamboo groves.' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', code: 'ZRH', rating: '4.8', bestSeason: 'Jun - Sep, Dec - Feb', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80', desc: 'Lakeside elegance, alpine views, and historic Old Town.' },
  { id: 'positano', name: 'Positano', country: 'Italy', code: 'PSO', rating: '4.9', bestSeason: 'May - Sep', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=500&q=80', desc: 'Cliffside colorful villas, Mediterranean waters, and coastal drives.' }
];

export default function CitySearchPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [trips, setTrips] = useState([]);
  const [addedCity, setAddedCity] = useState(null);

  useEffect(() => {
    getTrips().then(data => setTrips(data || [])).catch(() => {});
  }, []);

  const handleAddToTrip = async (city) => {
    const activeTrip = trips[0];
    if (!activeTrip) {
      navigate('/plan');
      return;
    }

    try {
      await addStop({
        trip_id: activeTrip.id,
        city_name: city.name,
        country: city.country,
        start_date: activeTrip.start_date,
        end_date: activeTrip.end_date,
        order_index: (activeTrip.stops || []).length
      });

      setAddedCity(city.name);
      setTimeout(() => setAddedCity(null), 3000);
    } catch (err) {
      alert(`Could not add stop: ${err.message}`);
    }
  };

  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="City Search" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-2">City & Destination Search</h1>
            <p className="font-body-md text-slate mb-6">Explore top global travel hubs and urban destinations.</p>

            {addedCity && (
              <div className="mb-4 p-3 bg-route-teal/10 border border-route-teal text-route-teal font-data-mono text-xs rounded">
                ✓ Added {addedCity} to your active trip!
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities by name or country (e.g. Tokyo, Switzerland, Italy)..."
                className="w-full bg-paper border border-slate rounded-lg pl-12 pr-4 py-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
              />
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate">location_city</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {filtered.map(city => (
              <div key={city.id} className="bg-paper border border-slate rounded-lg overflow-hidden flex flex-col sm:flex-row hover:border-horizon-amber transition-all shadow-sm">
                <div className="w-full sm:w-1/2 h-48 sm:h-auto relative bg-surface-container">
                  <img src={city.img} alt={city.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-2.5 py-0.5 rounded border border-slate font-data-mono-sm text-xs font-bold text-ink-navy">
                    {city.code}
                  </span>
                </div>

                <div className="p-5 w-full sm:w-1/2 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline-sm font-bold text-xl text-ink-navy">{city.name}</h3>
                      <span className="text-xs font-data-mono text-slate">⭐ {city.rating}</span>
                    </div>
                    <p className="text-xs font-data-mono text-route-teal mb-2">{city.country}</p>
                    <p className="font-body-md text-xs text-slate">{city.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate text-xs font-data-mono flex justify-between items-center">
                    <span className="text-slate">Best: {city.bestSeason}</span>
                    <button
                      onClick={() => handleAddToTrip(city)}
                      className="bg-horizon-amber text-ink-navy px-3 py-1.5 rounded font-bold hover:bg-opacity-90 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add to Trip</span>
                    </button>
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
