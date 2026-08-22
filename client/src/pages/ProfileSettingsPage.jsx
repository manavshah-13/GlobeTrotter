import React, { useState } from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || 'Jane Traveler');
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Profile & Settings" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-4xl w-full mx-auto space-y-stack-lg py-6">
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-1">Profile & Settings</h1>
            <p className="font-body-md text-slate">Manage your user profile, currency preferences, and notification defaults.</p>
          </div>

          <form onSubmit={handleSave} className="bg-paper border border-slate p-6 rounded-lg space-y-6">
            {saved && (
              <div className="p-3 bg-route-teal/10 border border-route-teal text-route-teal font-data-mono text-xs rounded">
                ✓ Preferences updated successfully!
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

            <div className="pt-4 flex justify-end">
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
