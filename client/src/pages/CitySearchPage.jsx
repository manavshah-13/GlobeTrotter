import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useCurrency } from '../context/CurrencyContext';
import { getTrips, addStop, getTravelTimingApi, getComprehensiveBudgetApi } from '../services/api';

const CITIES = [
  { id: 'ujjain', name: 'Ujjain', country: 'India', code: 'UJN', rating: '4.9', bestSeason: 'Oct - Mar', img: 'https://images.unsplash.com/photo-1609946727292-c94318c5e638?auto=format&fit=crop&w=500&q=80', desc: 'Ancient Mahakaleshwar Jyotirlinga, holy Shipra river ghats, and rich Vedic heritage.' },
  { id: 'goa', name: 'Goa', country: 'India', code: 'GOI', rating: '4.8', bestSeason: 'Nov - Feb', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80', desc: 'Sunny beaches, Portuguese Latin architecture in Fontainhas, and lively nightlife.' },
  { id: 'srinagar', name: 'Srinagar & Gulmarg', country: 'India', code: 'SXR', rating: '4.9', bestSeason: 'Apr - Oct, Dec - Feb', img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80', desc: 'Dal Lake shikaras, snow-capped Himalayan peaks, and alpine Gondola rides.' },
  { id: 'varanasi', name: 'Varanasi', country: 'India', code: 'VNS', rating: '4.9', bestSeason: 'Oct - Mar', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=500&q=80', desc: 'Spiritual capital of India with historic ghats, silk weavers, and grand evening aarti.' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', code: 'TYO', rating: '4.9', bestSeason: 'Oct - Nov, Mar - Apr', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=80', desc: 'Futuristic skyscrapers, historic temples, and world-class gastronomy.' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', code: 'UKY', rating: '4.9', bestSeason: 'Autumn & Spring', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80', desc: 'Traditional wooden machiya houses, Shinto shrines, and serene bamboo groves.' },
  { id: 'rome', name: 'Rome', country: 'Italy', code: 'FCO', rating: '4.9', bestSeason: 'May - Jun, Sep - Oct', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80', desc: 'Ancient Roman Forum, Colosseum, Vatican history, and lively piazzas.' },
  { id: 'paris', name: 'Paris', country: 'France', code: 'CDG', rating: '4.8', bestSeason: 'Apr - Jun, Sep - Nov', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80', desc: 'Iconic art museums, haute cuisine, and romantic Seine boulevards.' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', code: 'ZRH', rating: '4.8', bestSeason: 'Jun - Sep, Dec - Feb', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80', desc: 'Lakeside elegance, alpine views, and historic Old Town.' }
];

export default function CitySearchPage() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const [search, setSearch] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [addedNotice, setAddedNotice] = useState('');

  // Climatology / Timing Modal State
  const [modalCity, setModalCity] = useState(null);
  const [timingInfo, setTimingInfo] = useState(null);
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    getTrips().then(data => {
      setTrips(data || []);
      if (data && data.length > 0) {
        setSelectedTripId(data[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleAddToTrip = async (city) => {
    if (trips.length === 0) {
      navigate(`/plan?prompt=Trip to ${city.name}, ${city.country}`);
      return;
    }

    const targetTrip = trips.find(t => t.id === selectedTripId) || trips[0];

    try {
      await addStop({
        trip_id: targetTrip.id,
        city_name: city.name,
        country: city.country,
        start_date: targetTrip.start_date,
        end_date: targetTrip.end_date,
        order_index: (targetTrip.stops || []).length
      });

      setAddedNotice(`✓ Added ${city.name} to "${targetTrip.name}"!`);
      setTimeout(() => setAddedNotice(''), 3500);
    } catch (err) {
      alert(`Could not add stop: ${err.message}`);
    }
  };

  const handleOpenTiming = async (city) => {
    setModalCity(city);
    setModalLoading(true);
    setTimingInfo(null);
    setBudgetInfo(null);
    try {
      const [timing, budget] = await Promise.all([
        getTravelTimingApi(city.name),
        getComprehensiveBudgetApi({ destination: city.name, days: 5 })
      ]);
      setTimingInfo(timing);
      setBudgetInfo(budget);
    } catch (_) {}
    finally {
      setModalLoading(false);
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
        <TopAppBar title="Destination & Climatology Intelligence" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-paper border border-slate p-6 rounded-lg space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="font-headline-lg text-2xl font-bold text-primary">Destination Discovery & Transit Portals</h1>
                <p className="font-body-md text-slate text-xs sm:text-sm mt-0.5">
                  Explore global corridors, check seasonal climatology, and book direct transit tickets.
                </p>
              </div>

              {trips.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-data-mono-sm text-xs text-slate">Add to Active Trip:</span>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="bg-paper border border-slate rounded px-3 py-1.5 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.stops?.length || 0} stops)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {addedNotice && (
              <div className="p-3 bg-route-teal/10 border border-route-teal text-route-teal font-data-mono text-xs rounded flex items-center justify-between">
                <span>{addedNotice}</span>
                <Link to={`/builder?tripId=${selectedTripId}`} className="underline font-bold">
                  Open Builder →
                </Link>
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations (e.g. Ujjain, Goa, Tokyo, Paris, Kashmir)..."
                className="w-full bg-paper border border-slate rounded-lg pl-11 pr-4 py-2.5 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate text-lg">
                location_city
              </span>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(city => (
              <div
                key={city.id}
                className="bg-paper border border-slate rounded-lg overflow-hidden flex flex-col justify-between hover:border-horizon-amber transition-all shadow-xs"
              >
                <div>
                  <div className="h-44 relative bg-surface-container overflow-hidden">
                    <img src={city.img} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2.5 left-2.5 bg-paper/90 backdrop-blur-xs px-2.5 py-0.5 rounded border border-slate font-data-mono text-xs font-bold text-ink-navy">
                      {city.code}
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-paper/90 backdrop-blur-xs px-2 py-0.5 rounded border border-slate font-data-mono text-[11px] font-bold text-ink-navy flex items-center gap-1">
                      ⭐ {city.rating}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-headline-sm font-bold text-lg text-ink-navy">{city.name}</h3>
                      <span className="text-xs font-data-mono text-route-teal font-semibold">{city.country}</span>
                    </div>
                    <p className="font-body-md text-xs text-slate leading-relaxed">{city.desc}</p>
                    <div className="text-[11px] text-slate font-data-mono pt-1">
                      Best Period: <span className="font-bold text-ink-navy">{city.bestSeason}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2 border-t border-slate/40 mt-2 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenTiming(city)}
                      className="text-route-teal font-bold font-data-mono hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>Timing Intel</span>
                    </button>

                    <Link
                      to={`/transport?destination=${encodeURIComponent(city.name)}`}
                      className="text-horizon-amber font-bold font-data-mono hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">commute</span>
                      <span>Transit Hub</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => handleAddToTrip(city)}
                    className="w-full bg-horizon-amber text-ink-navy py-2 rounded font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 text-xs shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">add_location</span>
                    <span>{trips.length > 0 ? 'Add Stop to Trip' : 'Start New Trip Here'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              DESTINATION CLIMATOLOGY & BUDGET MODAL
              ======================================================== */}
          {modalCity && (
            <div className="fixed inset-0 z-50 bg-ink-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-paper border-2 border-ink-navy rounded-lg p-6 max-w-xl w-full space-y-4 shadow-[6px_6px_0px_0px_#1B2A4A] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate pb-3">
                  <div>
                    <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase">
                      CLIMATOLOGY & BUDGET INTELLIGENCE
                    </span>
                    <h3 className="font-headline-sm text-xl font-bold text-ink-navy">
                      {modalCity.name}, {modalCity.country}
                    </h3>
                  </div>
                  <button
                    onClick={() => setModalCity(null)}
                    className="text-slate hover:text-ink-navy text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                {modalLoading ? (
                  <div className="py-8 text-center text-xs font-data-mono text-slate flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-horizon-amber border-t-transparent rounded-full animate-spin"></div>
                    <span>Querying verified meteorological models & pricing...</span>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    {timingInfo && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded">
                            <span className="font-bold text-emerald-800 block text-[11px]">Best Overall</span>
                            <span className="text-ink-navy font-semibold">{timingInfo.best_overall_period}</span>
                          </div>
                          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded">
                            <span className="font-bold text-blue-800 block text-[11px]">Best Budget</span>
                            <span className="text-ink-navy font-semibold">{timingInfo.best_budget_period}</span>
                          </div>
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                            <span className="font-bold text-amber-800 block text-[11px]">Best Weather</span>
                            <span className="text-ink-navy font-semibold">{timingInfo.best_weather_period}</span>
                          </div>
                        </div>

                        {timingInfo.periods_to_avoid && (
                          <div className="p-2.5 bg-alert-coral/10 border border-alert-coral/30 rounded text-alert-coral">
                            <span className="font-bold">Avoid:</span> {timingInfo.periods_to_avoid} — {timingInfo.avoid_reason}
                          </div>
                        )}
                      </div>
                    )}

                    {budgetInfo && (
                      <div className="p-3 bg-surface-container rounded-lg border border-slate/60 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-ink-navy">Itemized Cost Range (5 Days):</span>
                          <span className="font-bold text-horizon-amber font-data-mono">
                            {formatCurrency(budgetInfo.total_min)} – {formatCurrency(budgetInfo.total_max)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate">
                          Includes estimated roundtrip flights, 4 nights lodging, meals, local transit & activities.
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex gap-3">
                      <Link
                        to={`/transport?destination=${encodeURIComponent(modalCity.name)}`}
                        className="flex-1 bg-ink-navy text-paper font-bold py-2 rounded text-center text-xs hover:bg-opacity-90 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">commute</span>
                        <span>Find Flights / Trains</span>
                      </Link>

                      <button
                        onClick={() => {
                          const c = modalCity;
                          setModalCity(null);
                          handleAddToTrip(c);
                        }}
                        className="flex-1 bg-horizon-amber text-ink-navy font-bold py-2 rounded text-center text-xs hover:opacity-90 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add_location</span>
                        <span>Add to Itinerary</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
