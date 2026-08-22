import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getTrips, deleteTrip, updateTrip } from '../services/api';

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Modal State
  const [editingTrip, setEditingTrip] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    setEditName(trip.name || '');
    setEditDesc(trip.description || '');
    setEditStart(trip.start_date || '');
    setEditEnd(trip.end_date || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTrip || !editName.trim()) return;

    setSavingEdit(true);
    try {
      await updateTrip(editingTrip.id, {
        name: editName.trim(),
        description: editDesc.trim(),
        start_date: editStart,
        end_date: editEnd
      });

      setEditingTrip(null);
      await loadTrips();
    } catch (err) {
      alert(`Error updating trip: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (tripId, tripName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${tripName}" and all associated waypoints and activities?`)) return;
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
                              Waypoints: <strong className="text-ink-navy">{stopNames}</strong> • {stops.length} Stops • Activities: <strong className="text-ink-navy">₹{totalCost}</strong>
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(trip)}
                                className="text-slate hover:text-ink-navy font-bold flex items-center gap-1 p-1"
                                title="Edit trip details"
                              >
                                <span className="material-symbols-outlined text-base">edit_note</span>
                                <span>Edit</span>
                              </button>
                              <Link
                                to={`/builder?tripId=${trip.id}`}
                                className="text-ink-navy hover:text-horizon-amber font-bold flex items-center gap-1 p-1"
                              >
                                <span className="material-symbols-outlined text-base">route</span>
                                <span>Builder</span>
                              </Link>
                              <Link
                                to={`/itinerary?tripId=${trip.id}`}
                                className="text-route-teal hover:underline font-bold flex items-center gap-1 p-1"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                                <span>Itinerary</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(trip.id, trip.name)}
                                className="text-alert-coral hover:bg-alert-coral/10 p-1.5 rounded transition-colors"
                                title="Delete trip"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
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

          {/* EDIT TRIP MODAL */}
          {editingTrip && (
            <div className="fixed inset-0 bg-ink-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-paper border border-slate rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate pb-2">
                  <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Edit Trip Expedition</h3>
                  <button onClick={() => setEditingTrip(null)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Trip Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div>
                    <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Description</label>
                    <textarea
                      rows="2"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">Start Date</label>
                      <input
                        type="date"
                        value={editStart}
                        onChange={(e) => setEditStart(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      />
                    </div>
                    <div>
                      <label className="block font-data-mono-sm text-xs text-ink-navy font-bold mb-1">End Date</label>
                      <input
                        type="date"
                        value={editEnd}
                        onChange={(e) => setEditEnd(e.target.value)}
                        className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTrip(null)}
                      className="px-4 py-2 border border-slate rounded text-xs text-slate hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90 disabled:opacity-50"
                    >
                      {savingEdit ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
