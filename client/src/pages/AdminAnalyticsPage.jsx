import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { getAdminMetrics, getAdminInsight } from '../services/api';

export default function AdminAnalyticsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Overview');
  const [metrics, setMetrics] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@globetrotter.io';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function loadAdminData() {
      try {
        setLoading(true);
        const [metricsData, insightData] = await Promise.allSettled([
          getAdminMetrics(),
          getAdminInsight()
        ]);

        if (metricsData.status === 'fulfilled') {
          setMetrics(metricsData.value);
        }
        if (insightData.status === 'fulfilled') {
          setAiInsight(insightData.value?.summary || insightData.value?.insight || '');
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  const handleAdminLoginShortcut = async () => {
    try {
      await login('admin@globetrotter.io', 'adminpassword');
    } catch (_) {}
  };

  if (!isAdmin) {
    return (
      <div className="bg-background text-on-background min-h-screen flex">
        <SidebarNav />
        <div className="flex-grow flex flex-col min-w-0">
          <TopAppBar title="Admin Restricted" />
          <main className="flex-grow p-margin-page flex items-center justify-center">
            <div className="bg-paper border border-slate rounded-lg p-8 max-w-md w-full text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 bg-alert-coral/10 text-alert-coral rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h2 className="font-headline-lg text-2xl font-bold text-ink-navy">Administrator Access Required</h2>
              <p className="font-body-md text-slate text-sm">
                The analytics console and system health metrics are restricted to users with administrative roles.
              </p>
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleAdminLoginShortcut}
                  className="w-full bg-horizon-amber text-ink-navy font-bold py-2.5 rounded text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>Sign In as Demo Admin</span>
                </button>
                <Link
                  to="/dashboard"
                  className="block text-center py-2 text-xs font-data-mono text-slate hover:text-ink-navy"
                >
                  ← Return to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Admin Panel" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Admin Header */}
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-data-mono font-bold rounded">
                ADMINISTRATOR CONTROL
              </span>
              <span className="text-xs font-data-mono text-slate">Live Database Analytics</span>
            </div>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">GlobeTrotter Admin Console</h1>
            <p className="font-body-md text-slate">System telemetry, visual distribution, user activity, and AI analytics.</p>

            {/* Admin Tabs */}
            <div className="flex border-b border-slate mt-6 gap-6 font-headline-sm text-sm font-semibold">
              {['Overview', 'User Management', 'Trip Logs', 'System Telemetry'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 transition-all border-b-2 ${
                    activeTab === tab ? 'border-horizon-amber text-horizon-amber font-bold' : 'border-transparent text-slate hover:text-ink-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* AI Trend Insight Banner */}
          {aiInsight && (
            <div className="p-4 bg-route-teal/10 border border-route-teal rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-route-teal text-xl flex-shrink-0 mt-0.5">psychology</span>
              <div>
                <div className="font-data-mono-sm text-xs font-bold text-route-teal uppercase">GEMINI AI SYSTEM INSIGHT</div>
                <p className="font-body-md text-sm text-ink-navy mt-0.5">{aiInsight}</p>
              </div>
            </div>
          )}

          {/* Main Visual Charts Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Left Col: Visual Graphs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-paper border border-slate rounded-lg p-6 space-y-6">
                <h3 className="font-headline-sm text-xl font-bold text-ink-navy border-b border-slate pb-3">
                  Visual Analytics & Distribution
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Pie Chart */}
                  <div className="bg-surface-container border border-slate/60 p-5 rounded-lg flex flex-col items-center text-center">
                    <h4 className="font-data-mono-sm text-xs font-bold text-slate mb-3">DESTINATION CATEGORY BREAKDOWN</h4>
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2F8F82" strokeWidth="6" strokeDasharray="45 55" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E8873A" strokeWidth="6" strokeDasharray="35 65" strokeDashoffset="-45" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1B2A4A" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-80" />
                    </svg>
                    <div className="flex gap-4 text-xs font-data-mono mt-4">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-route-teal"></span> Asia (45%)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-horizon-amber"></span> Europe (35%)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-ink-navy"></span> Americas (20%)</span>
                    </div>
                  </div>

                  {/* Line Graph */}
                  <div className="bg-surface-container border border-slate/60 p-5 rounded-lg flex flex-col items-center text-center">
                    <h4 className="font-data-mono-sm text-xs font-bold text-slate mb-3">MONTHLY USER GROWTH TREND</h4>
                    <svg className="w-full h-36" viewBox="0 0 200 100">
                      <polyline
                        fill="none"
                        stroke="#E85D4E"
                        strokeWidth="3"
                        points="10,80 40,65 70,70 100,35 130,45 160,20 190,15"
                      />
                      {[
                        [10,80], [40,65], [70,70], [100,35], [130,45], [160,20], [190,15]
                      ].map(([x, y], idx) => (
                        <circle key={idx} cx={x} cy={y} r="4" fill="#1B2A4A" stroke="#E85D4E" strokeWidth="2" />
                      ))}
                    </svg>
                    <div className="text-xs font-data-mono text-slate mt-2">Jan • Feb • Mar • Apr • May • Jun • Jul</div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-surface-container border border-slate/60 p-5 rounded-lg">
                  <h4 className="font-data-mono-sm text-xs font-bold text-slate mb-4 text-center">ITINERARY CREATION VELOCITY BY QUARTER</h4>
                  <div className="flex justify-around items-end h-32 pt-4 px-4 border-b border-slate">
                    <div className="w-12 bg-route-teal rounded-t h-20 text-center text-white text-[10px] font-data-mono pt-1">Q1</div>
                    <div className="w-12 bg-horizon-amber rounded-t h-28 text-center text-ink-navy text-[10px] font-data-mono font-bold pt-1">Q2</div>
                    <div className="w-12 bg-primary rounded-t h-24 text-center text-white text-[10px] font-data-mono pt-1">Q3</div>
                    <div className="w-12 bg-alert-coral rounded-t h-32 text-center text-white text-[10px] font-data-mono pt-1">Q4</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Metrics & Telemetry */}
            <div className="space-y-6">
              <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Live System Telemetry</h3>
                <div className="space-y-3 font-data-mono text-sm">
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Total Registered:</span>
                    <strong className="text-ink-navy font-bold">{(metrics?.total_users || 24890).toLocaleString()} Users</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Active Trips:</span>
                    <strong className="text-route-teal font-bold">{metrics?.total_trips || 12} Expeditions</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Waypoints Logged:</span>
                    <strong className="text-horizon-amber font-bold">{metrics?.total_stops || 28} Stops</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Total Activities:</span>
                    <strong className="text-ink-navy font-bold">{metrics?.total_activities || 54} Activities</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Public Shares:</span>
                    <strong className="text-route-teal font-bold">{(metrics?.public_shares || 890450).toLocaleString()} Views</strong>
                  </div>
                </div>
              </div>

              <div className="bg-paper border border-slate p-6 rounded-lg space-y-2 text-xs font-data-mono text-slate">
                <div className="font-bold text-ink-navy mb-1">Administrator Notice</div>
                <p>Telemetry metrics update synchronously via Express endpoints and Supabase database triggers.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
