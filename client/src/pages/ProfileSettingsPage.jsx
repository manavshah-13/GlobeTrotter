import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.name || 'Jane Traveler');
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  // Saved destinations bookmarks
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('globetrotter_saved_destinations');
    return saved ? JSON.parse(saved) : ['Tokyo, Japan', 'Kyoto, Japan', 'Zurich, Switzerland', 'Amalfi, Italy'];
  });
  const [newDest, setNewDest] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    localStorage.setItem('globetrotter_saved_destinations', JSON.stringify(destinations));
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddDestination = (e) => {
    e.preventDefault();
    if (!newDest.trim()) return;
    const updated = [...destinations, newDest.trim()];
    setDestinations(updated);
    localStorage.setItem('globetrotter_saved_destinations', JSON.stringify(updated));
    setNewDest('');
  };

  const handleRemoveDestination = (index) => {
    const updated = destinations.filter((_, i) => i !== index);
    setDestinations(updated);
    localStorage.setItem('globetrotter_saved_destinations', JSON.stringify(updated));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your GlobeTrotter account and clear all local data?')) {
      logout();
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Profile & Settings" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-4xl w-full mx-auto space-y-stack-lg py-6">
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-1">Profile & Settings</h1>
            <p className="font-body-md text-slate">Manage your user profile, currency preferences, saved destinations, and security.</p>
          </div>

          <form onSubmit={handleSave} className="bg-paper border border-slate p-6 rounded-lg space-y-6">
            {saved && (
              <div className="p-3 bg-route-teal/10 border border-route-teal text-route-teal font-data-mono text-xs rounded">
                ✓ Preferences and destinations updated successfully!
              </div>
            )}

            <div className="flex items-center gap-6 pb-6 border-b border-slate">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest border border-slate flex items-center justify-center font-headline-lg text-2xl font-bold text-primary">
                {user?.avatar || 'JT'}
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy">{displayName}</h3>
                <p className="font-data-mono text-xs text-slate">{user?.email || 'traveler@globetrotter.io'} • Member since 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy text-sm mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-4 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                />
              </div>

              <div>
                <label className="block font-headline-sm font-semibold text-ink-navy text-sm mb-2">Primary Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-4 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="JPY">JPY (¥ - Japanese Yen)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            {/* Saved Destinations Wishlist */}
            <div className="pt-4 border-t border-slate space-y-3">
              <h3 className="font-headline-sm text-base font-bold text-ink-navy flex items-center gap-2">
                <span className="material-symbols-outlined text-horizon-amber text-lg">bookmark</span>
                <span>Saved Destinations & Wishlist</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {destinations.map((dest, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container border border-slate rounded-full text-xs font-data-mono text-ink-navy"
                  >
                    <span>{dest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(i)}
                      className="text-slate hover:text-alert-coral ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  placeholder="Add destination bookmark (e.g. Reykjavik, Iceland)..."
                  className="flex-grow bg-paper border border-slate rounded px-3 py-1.5 font-data-mono text-xs focus:outline-none focus:border-horizon-amber"
                />
                <button
                  type="button"
                  onClick={handleAddDestination}
                  className="bg-surface-container border border-slate px-3 py-1.5 rounded text-xs font-data-mono font-bold text-ink-navy hover:bg-surface-container-high"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate">
              <h3 className="font-headline-sm text-base font-bold text-ink-navy">Notifications</h3>
              <label className="flex items-center gap-3 font-body-md text-sm text-ink-navy cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-horizon-amber rounded" />
                <span>Receive flight delay and gate change alerts</span>
              </label>
              <label className="flex items-center gap-3 font-body-md text-sm text-ink-navy cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-horizon-amber rounded" />
                <span>Weekly itinerary digest email</span>
              </label>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="text-alert-coral hover:underline text-xs font-data-mono"
              >
                Delete Account & Clear Data
              </button>

              <button
                type="submit"
                className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
