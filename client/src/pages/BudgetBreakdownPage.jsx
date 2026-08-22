import React from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

const EXPENSES = [
  { category: 'Flights & Rail', item: 'Roundtrip SFO -> HND & Shinkansen Pass', cost: '$1,350', status: 'Paid', icon: 'flight' },
  { category: 'Accommodation', item: 'Hotel Gracery Shinjuku & Kyoto Ryokan', cost: '$1,400', status: 'Booked', icon: 'hotel' },
  { category: 'Activities & Tours', item: 'Food Tours, Tea Ceremony, Museum Passes', cost: '$420', status: 'Reserved', icon: 'local_activity' },
  { category: 'Food & Dining', item: 'Estimated Daily Food ($50/day)', cost: '$600', status: 'Estimated', icon: 'restaurant' }
];

export default function BudgetBreakdownPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Budget Breakdown" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Budget & Cost Breakdown</h1>
              <p className="font-body-md text-slate mt-1">Japan Expedition • Total Allocation: $4,000</p>
            </div>

            <div className="bg-surface-container border border-slate p-4 rounded-lg flex items-center gap-6">
              <div>
                <div className="font-data-mono-sm text-xs text-slate">TOTAL EXPENSES</div>
                <div className="font-headline-lg text-2xl font-bold text-horizon-amber">$3,770</div>
              </div>
              <div className="h-8 w-px bg-slate"></div>
              <div>
                <div className="font-data-mono-sm text-xs text-slate">REMAINING</div>
                <div className="font-headline-lg text-2xl font-bold text-route-teal">$230</div>
              </div>
            </div>
          </div>

          <div className="bg-paper border border-slate rounded-lg p-6 space-y-6">
            <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-3">Itemized Expense Log</h2>

            <div className="space-y-3 font-data-mono text-sm">
              {EXPENSES.map((exp, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container border border-slate/60 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-route-teal p-2 bg-paper rounded border border-slate text-lg">
                      {exp.icon}
                    </span>
                    <div>
                      <div className="font-bold text-ink-navy">{exp.item}</div>
                      <div className="text-xs text-slate">{exp.category}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-ink-navy text-base">{exp.cost}</div>
                    <span className="text-xs text-route-teal bg-route-teal/10 px-2 py-0.5 rounded border border-route-teal/30">
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
