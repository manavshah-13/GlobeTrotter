import React, { useState } from 'react';
import { TopAppBar } from '../components/Navigation';

export default function SharedItineraryPage() {
  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-paper font-body-md text-ink-navy min-h-screen flex flex-col">
      <TopAppBar title="Shared Itinerary" />

      <main className="flex-grow p-margin-page max-w-4xl mx-auto w-full py-8 space-y-stack-lg">
        <div className="bg-paper border border-slate p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30 mb-2">
              <span className="material-symbols-outlined text-sm">share</span> SHARED PUBLIC ITINERARY
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-primary">Autumn in Japan: Tokyo & Kyoto</h1>
            <p className="font-data-mono text-sm text-slate mt-1">Shared by Alexander R. • Oct 12 - Oct 24, 2024</p>
          </div>

          <button
            onClick={copyShareLink}
            className="bg-horizon-amber text-ink-navy font-bold px-4 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-base">content_copy</span>
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>
        </div>

        {/* Public Itinerary Highlights */}
        <div className="bg-paper border border-slate p-6 rounded-lg space-y-6">
          <h2 className="font-headline-md text-xl font-bold text-ink-navy border-b border-slate pb-3">Route Highlights & Stops</h2>

          <div className="space-y-4">
            <div className="p-4 bg-surface-container border border-slate rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-headline-sm font-bold text-lg text-ink-navy">Stop 1: Tokyo (4 Days)</h3>
                <span className="font-data-mono text-xs text-route-teal">OCT 12 - OCT 16</span>
              </div>
              <p className="text-sm text-slate font-body-md">Shinjuku Food Crawl, Senso-ji Temple, Shibuya Sky, Meiji Shrine.</p>
            </div>

            <div className="p-4 bg-surface-container border border-slate rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-headline-sm font-bold text-lg text-ink-navy">Stop 2: Kanazawa (2 Days)</h3>
                <span className="font-data-mono text-xs text-route-teal">OCT 16 - OCT 18</span>
              </div>
              <p className="text-sm text-slate font-body-md">Kenroku-en Gardens, Higashi Chaya Geisha District, Castle Ruins.</p>
            </div>

            <div className="p-4 bg-surface-container border border-slate rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-headline-sm font-bold text-lg text-ink-navy">Stop 3: Kyoto (4 Days)</h3>
                <span className="font-data-mono text-xs text-route-teal">OCT 18 - OCT 24</span>
              </div>
              <p className="text-sm text-slate font-body-md">Fushimi Inari Shrine, Bamboo Forest, Gion Tea Ceremony.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
