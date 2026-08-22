import React, { useState } from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Admin Panel Screen (Screen 12)" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Admin Header */}
          <div className="bg-paper border border-slate p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-data-mono font-bold rounded">ADMINISTRATOR CONTROL</span>
              <span className="text-xs font-data-mono text-slate">Screen 12 Wireframe View</span>
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-primary">GlobeTrotter Admin Panel</h1>
            <p className="font-body-md text-slate">System health, visual analytics, user activity, and destination metrics.</p>

            {/* Admin Tabs matching Screen 12 */}
            <div className="flex border-b border-slate mt-6 gap-6 font-headline-sm text-sm font-semibold">
              {['Overview', 'User Management', 'Trip Logs', 'System Analytics'].map(tab => (
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

          {/* Main Visual Charts Canvas matching Screen 12 Wireframe */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Left Col: Visual Graphs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-paper border border-slate rounded-lg p-6 space-y-6">
                <h3 className="font-headline-sm text-xl font-bold text-ink-navy border-b border-slate pb-3">Visual Analytics & Distribution</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Pie Chart Representation matching Screen 12 */}
                  <div className="bg-surface-container border border-slate/60 p-5 rounded-lg flex flex-col items-center text-center">
                    <h4 className="font-data-mono-sm text-xs font-bold text-slate mb-3">DESTINATION CATEGORY BREAKDOWN</h4>
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                      {/* Circle Segments */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2F8F82" strokeWidth="6" strokeDasharray="45 55" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E8873A" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="-45" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1B2A4A" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-75" />
                    </svg>
                    <div className="flex gap-4 text-xs font-data-mono mt-4">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-route-teal"></span> Asia (45%)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-horizon-amber"></span> Europe (30%)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-ink-navy"></span> Americas (25%)</span>
                    </div>
                  </div>

                  {/* Line Graph Representation matching Screen 12 */}
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

                {/* Bar Chart Representation matching Screen 12 */}
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

            {/* Right Panel: Metrics & Notes */}
            <div className="space-y-6">
              <div className="bg-paper border border-slate p-6 rounded-lg space-y-4">
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy">System Metrics</h3>
                <div className="space-y-3 font-data-mono text-sm">
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Total Registered:</span>
                    <strong className="text-ink-navy font-bold">24,890 Users</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Active Expeditions:</span>
                    <strong className="text-route-teal font-bold">142,300 Trips</strong>
                  </div>
                  <div className="p-3 bg-surface-container border border-slate/60 rounded flex justify-between items-center">
                    <span className="text-slate">Public Shares:</span>
                    <strong className="text-horizon-amber font-bold">890,450 Views</strong>
                  </div>
                </div>
              </div>

              <div className="bg-paper border border-slate p-6 rounded-lg space-y-2 text-xs font-data-mono text-slate">
                <div className="font-bold text-ink-navy mb-1">Wireframe Notes (Screen 12)</div>
                <p>Visual representation of system metrics, charts, pie graphs, and activity timelines for administrative analysis.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
