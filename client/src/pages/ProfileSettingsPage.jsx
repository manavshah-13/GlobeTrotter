import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ProfileSettingsPage() {
  const { user, logout } = useAuth();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.name || 'Jane Traveler');
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

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Profile & Settings" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-4xl w-full mx-auto space-y-stack-lg">
          <div className="bg-paper border border-slate rounded-lg p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate pb-4">
              <div>
                <h1 className="font-headline-lg text-2xl font-bold text-primary">Traveler Profile & Preferences</h1>
                <p className="font-body-md text-sm text-slate mt-0.5">Manage your personal account settings and travel preferences.</p>
              </div>

              {saved && (
                <div className="p-2 px-3 bg-route-teal/10 border border-route-teal rounded text-route-teal text-xs font-data-mono flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Settings Saved!</span>
                </div>
              )}
            </div>

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
                  className="w-full bg-paper border border-slate rounded px-4 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber cursor-pointer"
                >
                  {supportedCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol} - {c.name})
                    </option>
                  ))}
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
                      onClick={() => handleRemoveDestination(i)}
                      className="text-slate hover:text-alert-coral ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddDestination} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Rome, Italy or Lisbon, Portugal"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="flex-grow bg-paper border border-slate rounded px-4 py-2 text-xs font-data-mono focus:outline-none focus:border-horizon-amber"
                />
                <button
                  type="submit"
                  className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container"
                >
                  + Add Destination
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate flex justify-between items-center">
              <button
                onClick={handleSave}
                className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded text-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Profile Changes</span>
              </button>

              <button
                onClick={handleSignOut}
                className="text-alert-coral hover:underline font-data-mono text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm text-alert-coral">logout</span>
                <span>Sign Out from Device</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
