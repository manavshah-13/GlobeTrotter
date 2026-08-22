import React, { useState, useEffect } from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { getTrips, assignActivity, removeActivity, recommendActivities } from '../services/api';

const DEFAULT_ACTIVITIES = [
  { id: 'act-sample-1', title: 'Tsukiji Outer Market Food Tour', city: 'Tokyo', category: 'Culinary', rating: 4.9, price: 75, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80' },
  { id: 'act-sample-2', title: 'Fushimi Inari Early Morning Shrine Hike', city: 'Kyoto', category: 'Culture & Nature', rating: 4.9, price: 35, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80' },
  { id: 'act-sample-3', title: 'Kanazawa Gold Leaf Crafting Workshop', city: 'Kanazawa', category: 'Art & Craft', rating: 4.8, price: 45, img: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=500&q=80' },
  { id: 'act-sample-4', title: 'Dotonbori Street Food & Izakaya Crawl', city: 'Osaka', category: 'Nightlife', rating: 4.7, price: 60, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80' }
];

export default function ActivitySearchPage() {
  const [query, setQuery] = useState('');
  const [activitiesList, setActivitiesList] = useState(DEFAULT_ACTIVITIES);
  const [aiLoading, setAiLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [addedMap, setAddedMap] = useState({}); // { [actTitle]: assignedActivityId }
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    try {
      const data = await getTrips();
      setTrips(data || []);
      
      const map = {};
      (data || []).forEach(t => {
        (t.stops || []).forEach(s => {
          (s.trip_activities || []).forEach(a => {
            map[a.custom_name] = a.id;
          });
        });
      });
      setAddedMap(map);
    } catch (_) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAiRecommend = async (cityName = 'Tokyo') => {
    setAiLoading(true);
    try {
      const recs = await recommendActivities({ city_name: cityName, budget_level: 'moderate' });
      if (Array.isArray(recs)) {
        const formatted = recs.map((r, idx) => ({
          id: `ai-rec-${idx}-${Date.now()}`,
          title: r.name,
          city: cityName,
          category: r.category || 'Sightseeing',
          rating: 5.0,
          price: r.cost_usd || 40,
          img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=500&q=80',
          aiReason: r.recommendation_reason
        }));
        setActivitiesList([...formatted, ...DEFAULT_ACTIVITIES]);
      }
    } catch (e) {
      alert(`AI Recommendation error: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleActivity = async (act) => {
    const activeTrip = trips[0];
    const firstStop = activeTrip?.stops?.[0];

    if (!firstStop) {
      alert('Please add a stop in Itinerary Builder first.');
      return;
    }

    const existingAssignedId = addedMap[act.title];

    if (existingAssignedId) {
      // Remove
      try {
        await removeActivity(existingAssignedId);
        setAddedMap(prev => {
          const next = { ...prev };
          delete next[act.title];
          return next;
        });
        setNotice(`Removed "${act.title}" from ${firstStop.city_name || 'your trip'}`);
        setTimeout(() => setNotice(''), 3000);
      } catch (e) {
        alert(`Could not remove activity: ${e.message}`);
      }
    } else {
      // Add
      try {
        const result = await assignActivity({
          stop_id: firstStop.id,
          custom_name: act.title,
          category: act.category,
          cost: act.price,
          scheduled_time: '14:00'
        });

        const createdId = result.id || `act-${Date.now()}`;
        setAddedMap(prev => ({ ...prev, [act.title]: createdId }));
        setNotice(`Added "${act.title}" to ${firstStop.city_name || 'your trip'}!`);
        setTimeout(() => setNotice(''), 3000);
      } catch (e) {
        alert(`Could not add activity: ${e.message}`);
      }
    }
  };

  const filtered = activitiesList.filter(a =>
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
          <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Explore Activities & Tours</h1>
                <p className="font-body-md text-slate">Discover curated experiences and add/remove them with live state tracking.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() => handleAiRecommend('Tokyo')}
                  className="bg-route-teal text-white font-bold px-4 py-2 rounded text-xs hover:bg-opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>{aiLoading ? 'Asking Gemini AI...' : 'AI Recommend (Tokyo)'}</span>
                </button>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() => handleAiRecommend('Kyoto')}
                  className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>AI Recommend (Kyoto)</span>
                </button>
              </div>
            </div>

            {notice && (
              <div className="p-3 bg-route-teal/10 border border-route-teal text-route-teal font-data-mono text-xs rounded">
                ✓ {notice}
              </div>
            )}

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
            {filtered.map(act => {
              const isAdded = !!addedMap[act.title];

              return (
                <div key={act.id} className={`bg-paper border rounded-lg overflow-hidden flex flex-col transition-all shadow-sm ${isAdded ? 'border-route-teal ring-1 ring-route-teal/40' : 'border-slate hover:border-horizon-amber'}`}>
                  <div className="h-40 relative bg-surface-container">
                    <img src={act.img} alt={act.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-2.5 py-0.5 rounded border border-slate text-xs font-data-mono text-ink-navy">
                      {act.city}
                    </span>
                    {isAdded && (
                      <span className="absolute top-3 right-3 bg-route-teal text-white text-[11px] font-data-mono font-bold px-2 py-0.5 rounded shadow">
                        ADDED ✓
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs font-data-mono text-route-teal">{act.category}</span>
                      <h3 className="font-headline-sm font-bold text-base text-ink-navy mt-1">{act.title}</h3>
                      {act.aiReason && (
                        <p className="text-xs font-body-md text-slate mt-1 italic line-clamp-2">"{act.aiReason}"</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs font-data-mono pt-3 border-t border-slate">
                      <span className="font-bold text-ink-navy text-sm">${act.price}</span>
                      <button
                        onClick={() => handleToggleActivity(act)}
                        className={`px-3 py-1.5 rounded font-bold transition-all flex items-center gap-1 ${
                          isAdded
                            ? 'bg-surface-container border border-alert-coral/40 text-alert-coral hover:bg-alert-coral/10'
                            : 'bg-horizon-amber text-ink-navy hover:opacity-90'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isAdded ? 'remove_circle' : 'add'}
                        </span>
                        <span>{isAdded ? 'Remove' : 'Add to Stop'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
