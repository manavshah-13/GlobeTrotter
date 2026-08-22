import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getTrips, deleteTrip } from '../services/api';

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTrips(user?.id);
      setTrips(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [user?.id]);

  const handleDelete = async (tripId, tripName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${tripName}"?`)) return;
    try {
      await deleteTrip(tripId);
      await loadTrips();
    } catch (err) {
      alert(`Error deleting trip: ${err.message}`);
    }
  };

  const now = new Date().toISOString().split('T')[0];

  const ongoingTrips = trips.filter(t => t.start_date <= now && t.end_date >= now);
  const upcomingTrips = trips.filter(t => t.start_date > now);
  const completedTrips = trips.filter(t => t.end_date < now);

  const categories = [
    {
      category: 'Ongoing',
      badge: 'ACTIVE NOW',
      badgeColor: 'bg-route-teal text-white border-route-teal',
      trips: ongoingTrips
    },
    {
      category: 'Upcoming',
      badge: 'CONFIRMED',
      badgeColor: 'bg-horizon-amber text-ink-navy border-horizon-amber',
      trips: upcomingTrips
    },
    {
      category: 'Completed',
      badge: 'ARCHIVED',
      badgeColor: 'bg-surface-container text-slate border-slate',
      trips: completedTrips
    }
  ].filter(cat => cat.trips.length > 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="My Expeditions" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">My Expeditions</h1>
              <p className="font-body-md text-slate mt-1">
                {trips.length} saved itineraries for {user?.name || 'Traveler'}.
              </p>
            </div>
            <Link
              to="/plan"
              className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Create a New Trip</span>
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral text-xs font-data-mono">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-horizon-amber border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-data-mono text-xs text-slate">Loading saved expeditions...</p>
            </div>
          ) : trips.length === 0 ? (
            /* Empty State */
            <div className="bg-paper border border-slate rounded-lg p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-slate">
                <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-ink-navy">No Trips Created Yet</h3>
              <p className="font-body-md text-sm text-slate max-w-md mx-auto">
                Ready to plan your next journey? Use the AI Itinerary Generator or manually build your dream itinerary.
              </p>
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 bg-horizon-amber text-ink-navy font-bold px-6 py-3 rounded text-sm hover:opacity-90 shadow"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Plan Your First Trip</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((catGroup) => (
                <div key={catGroup.category} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate pb-2">
                    <h2 className="font-headline-md text-xl font-bold text-ink-navy">{catGroup.category}</h2>
                    <span className={`text-xs font-data-mono px-2.5 py-0.5 rounded border font-bold ${catGroup.badgeColor}`}>
                      {catGroup.badge} ({catGroup.trips.length})
                    </span>
                  </div>

                  <div className="space-y-4">
                    {catGroup.trips.map((trip) => {
                      const stops = trip.stops || [];
                      const stopNames = stops.map(s => s.city_name || s.cities?.name).filter(Boolean).join(', ') || 'Various Destinations';
                      const totalCost = stops.reduce((acc, st) => acc + (st.trip_activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0), 0);

                      return (
                        <div
                          key={trip.id}
                          className="bg-paper border border-slate rounded-lg p-6 hover:border-horizon-amber transition-all shadow-sm relative space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-data-mono-sm text-xs font-bold text-ink-navy bg-surface-container border border-slate px-2.5 py-1 rounded">
                                {trip.name?.slice(0, 3).toUpperCase() || 'TRP'}
                              </span>
                              <h3 className="font-headline-sm text-xl font-bold text-ink-navy">{trip.name}</h3>
                            </div>
                            <span className="font-data-mono text-xs text-slate">
                              {trip.start_date} → {trip.end_date}
                            </span>
                          </div>

                          {/* Overview banner */}
                          <div className="p-3.5 bg-surface-container border border-slate/60 rounded-lg">
                            <p className="font-body-md text-sm text-ink-navy font-medium">
                              {trip.description || `Expedition spanning ${stops.length} stops including ${stopNames}.`}
                            </p>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-data-mono border-t border-slate/40">
                            <span className="text-slate">
                              Waypoints: <strong className="text-ink-navy">{stopNames}</strong> • {stops.length} Stops • Activities: <strong className="text-ink-navy">${totalCost}</strong>
                            </span>
                            
                            <div className="flex items-center gap-3">
                              <Link
                                to={`/builder?tripId=${trip.id}`}
                                className="text-ink-navy hover:text-horizon-amber font-bold flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Builder</span>
                              </Link>
                              <Link
                                to={`/itinerary?tripId=${trip.id}`}
                                className="text-route-teal hover:underline font-bold flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                <span>View Itinerary</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(trip.id, trip.name)}
                                className="text-alert-coral hover:bg-alert-coral/10 p-1 rounded transition-colors"
                                title="Delete trip"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
