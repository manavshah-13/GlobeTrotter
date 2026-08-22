import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';

export default function ItineraryBuilderPage() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Section 1 - Tokyo Arrival & Shinjuku',
      description: 'All the itinerary information for this section. This can be anything: big city, small train station, or any other activity.',
      activities: ['Shinjuku Food & Yakitori Crawl', 'Tokyo Metropolitan View Deck'],
      accommodations: ['Hotel Gracery Shinjuku']
    },
    {
      id: 2,
      title: 'Section 2 - Kanazawa Heritage & Gardens',
      description: 'All the itinerary information for this section. This can be anything: big city, small train station, or any other activity.',
      activities: ['Kenroku-en Garden Walking Tour', 'Higashi Chaya Geisha District'],
      accommodations: ['Kanazawa Traditional Machiya']
    },
    {
      id: 3,
      title: 'Section 3 - Kyoto Temples & Arashiyama',
      description: 'All the itinerary information for this section. This can be anything: big city, small train station, or any other activity.',
      activities: ['Fushimi Inari Shrine Hike', 'Arashiyama Bamboo Grove Walk'],
      accommodations: ['Gion Ryokan & Spa']
    }
  ]);

  const [activeModal, setActiveModal] = useState(null); // { type: 'activity'|'accommodation', sectionId: number }
  const [inputVal, setInputVal] = useState('');

  const addSection = () => {
    const newSec = {
      id: Date.now(),
      title: `Section ${sections.length + 1} - New Waypoint / Destination`,
      description: 'All the itinerary information for this section. Include activities and accommodations below.',
      activities: [],
      accommodations: []
    };
    setSections([...sections, newSec]);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeModal) return;

    setSections(sections.map(sec => {
      if (sec.id === activeModal.sectionId) {
        if (activeModal.type === 'activity') {
          return { ...sec, activities: [...sec.activities, inputVal] };
        } else {
          return { ...sec, accommodations: [...sec.accommodations, inputVal] };
        }
      }
      return sec;
    }));

    setInputVal('');
    setActiveModal(null);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Build Itinerary Screen (Screen 5)" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Build Itinerary Screen</h1>
              <p className="font-body-md text-slate mt-1">Organize your expedition into structured day & location sections.</p>
            </div>
            <Link
              to="/itinerary"
              className="bg-route-teal text-white font-bold px-5 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              <span>View Final Itinerary</span>
            </Link>
          </div>

          {/* Sections List matching Screen 5 Wireframe */}
          <div className="space-y-6">
            {sections.map((sec) => (
              <div key={sec.id} className="bg-paper border border-slate rounded-lg p-6 relative space-y-4">
                <div className="flex justify-between items-start border-b border-slate pb-3">
                  <h3 className="font-headline-sm text-xl font-bold text-ink-navy">{sec.title}</h3>
                  <span className="text-xs font-data-mono text-route-teal bg-route-teal/10 px-2.5 py-0.5 rounded border border-route-teal/30">
                    Active Section
                  </span>
                </div>

                <p className="font-body-md text-sm text-slate">{sec.description}</p>

                {/* Added Activities & Accommodations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-surface-container border border-slate/60 rounded-lg p-4">
                    <h4 className="font-data-mono-sm text-xs font-bold text-ink-navy mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-horizon-amber">local_activity</span>
                      ACTIVITIES ({sec.activities.length})
                    </h4>
                    {sec.activities.length === 0 ? (
                      <p className="text-xs font-data-mono text-slate italic">No activities added yet.</p>
                    ) : (
                      <ul className="space-y-1 text-xs font-data-mono text-ink-navy">
                        {sec.activities.map((act, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-horizon-amber"></span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-surface-container border border-slate/60 rounded-lg p-4">
                    <h4 className="font-data-mono-sm text-xs font-bold text-ink-navy mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-route-teal">hotel</span>
                      ACCOMMODATIONS ({sec.accommodations.length})
                    </h4>
                    {sec.accommodations.length === 0 ? (
                      <p className="text-xs font-data-mono text-slate italic">No accommodations added yet.</p>
                    ) : (
                      <ul className="space-y-1 text-xs font-data-mono text-ink-navy">
                        {sec.accommodations.map((acc, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-route-teal"></span>
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Section Buttons matching Screen 5 Wireframe */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-slate">
                  <button
                    onClick={() => setActiveModal({ type: 'activity', sectionId: sec.id })}
                    className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-horizon-amber">add</span>
                    <span>Add Activity</span>
                  </button>

                  <button
                    onClick={() => setActiveModal({ type: 'accommodation', sectionId: sec.id })}
                    className="bg-paper border border-slate text-ink-navy font-bold px-4 py-2 rounded text-xs hover:bg-surface-container flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-route-teal">add</span>
                    <span>Add Accommodation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add another Section button matching Screen 5 */}
          <div className="text-center pt-4">
            <button
              onClick={addSection}
              className="bg-horizon-amber text-ink-navy font-headline-sm text-base font-bold px-8 py-3.5 rounded border border-ink-navy shadow-[2px_2px_0px_0px_#1B2A4A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span>Add another Section</span>
            </button>
          </div>

          {/* Modal for adding activity / accommodation */}
          {activeModal && (
            <div className="fixed inset-0 bg-ink-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-paper border border-slate rounded-lg p-6 max-w-md w-full shadow-2xl">
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy mb-3">
                  Add {activeModal.type === 'activity' ? 'Activity' : 'Accommodation'}
                </h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={activeModal.type === 'activity' ? 'e.g. Tsukiji Fish Market Food Tour' : 'e.g. Ryokan Mount Fuji Spa'}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 border border-slate rounded text-xs text-slate hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-xs hover:opacity-90"
                    >
                      Add Item
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
