import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useCurrency } from '../context/CurrencyContext';

const HERO_SUGGESTIONS = [
  "Plan a 5-day budget trip to Goa from Ahmedabad",
  "Find me a flight from Ahmedabad to Delhi next Friday for two people",
  "I need a train from Mumbai to Goa tomorrow morning",
  "10-day cultural journey across Tokyo and Kyoto in April"
];

const SHOWCASE_PILLARS = [
  {
    icon: 'auto_awesome',
    title: 'AI Multi-City Itinerary Synthesis',
    tag: 'INTELLIGENT PLANNING',
    description: 'Generates day-by-day scheduled timelines (morning, afternoon, evening) with zero repetition and localized pricing.',
    action: '/plan',
    actionText: 'Build Itinerary →'
  },
  {
    icon: 'payments',
    title: 'Precision Itemized Cost Forecasting',
    tag: 'BUDGET ANALYTICS',
    description: 'Calculates categorical breakdowns across flights, trains/buses, accommodation, dining, and activities with clear uncertainty bounds.',
    action: '/plan',
    actionText: 'Estimate Budget →'
  },
  {
    icon: 'calendar_month',
    title: 'Travel Timing & Climatology',
    tag: 'BEST TIME TO VISIT',
    description: 'Analyzes peak, shoulder, and off-seasons with real weather conditions, festival calendars, crowd levels, and periods to avoid.',
    action: '/city-search',
    actionText: 'Explore Timing →'
  },
  {
    icon: 'flight_takeoff',
    title: 'Multi-Airline Flight Booking',
    tag: 'AIR TRAVEL',
    description: 'Compare non-stop and connecting routes across IndiGo, Air India, Emirates, and more with instant Google Flights & Skyscanner booking.',
    action: '/transport?mode=flight',
    actionText: 'Search Flights →'
  },
  {
    icon: 'train',
    title: 'Express & Superfast Train Booking',
    tag: 'RAIL NETWORK',
    description: 'Search Vande Bharat, Rajdhani, and express trains with live class availability (1A, 2A, 3A, SL, CC) and direct IRCTC reservation links.',
    action: '/transport?mode=train',
    actionText: 'Search Trains →'
  },
  {
    icon: 'directions_bus',
    title: 'Intercity AC Sleeper & Volvo Buses',
    tag: 'HIGHWAY TRANSIT',
    description: 'Reserve BharatBenz AC Sleepers and Volvo Multi-Axle coaches with seat availability, operator ratings, and RedBus checkout.',
    action: '/transport?mode=bus',
    actionText: 'Search Buses →'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();

  const [heroInput, setHeroInput] = useState('');
  const [activeStub, setActiveStub] = useState('flight'); // 'flight' | 'train' | 'bus' | 'itinerary'

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!heroInput.trim()) return;

    const lower = heroInput.toLowerCase();
    if (lower.includes('flight') || lower.includes('train') || lower.includes('bus')) {
      navigate(`/transport?q=${encodeURIComponent(heroInput.trim())}`);
    } else {
      navigate(`/plan?prompt=${encodeURIComponent(heroInput.trim())}`);
    }
  };

  const applyHeroSuggestion = (text) => {
    setHeroInput(text);
  };

  return (
    <div className="bg-paper font-body-md text-ink-navy text-body-md min-h-screen flex flex-col antialiased selection:bg-horizon-amber selection:text-ink-navy">
      <TopAppBar title="AI Travel Planning & Transit Platform" />

      <main className="flex-grow">
        {/* ========================================================
            HERO SECTION
            ======================================================== */}
        <section className="w-full px-margin-page pt-12 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column: Value Prop & Natural Language Search */}
            <div className="w-full lg:w-[58%] flex flex-col items-start gap-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-slate font-data-mono-sm text-xs text-route-teal">
                <span className="w-2 h-2 rounded-full bg-route-teal animate-pulse"></span>
                <span>Next-Gen Travel Engine • Gemini 3.6 Flash & Live Transit</span>
              </div>

              <h1 className="font-headline-lg text-4xl sm:text-5xl lg:text-[62px] lg:leading-[64px] font-bold text-ink-navy tracking-tight">
                Travel logistics, <br className="hidden sm:inline" />
                <span className="text-horizon-amber underline decoration-route-teal decoration-4 underline-offset-8">
                  intelligently sorted.
                </span>
              </h1>

              <p className="font-body-md text-base sm:text-lg text-slate max-w-xl leading-relaxed">
                Tell GlobeTrotter where you want to go. It synthesizes custom multi-city itineraries, calculates itemized budgets, recommends ideal seasons, and compares live flights, trains, and buses.
              </p>

              {/* Natural Language Hero Search Box */}
              <div className="w-full max-w-xl bg-paper border-2 border-ink-navy rounded-lg p-3 shadow-[4px_4px_0px_0px_#1B2A4A] mt-1">
                <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate text-lg">
                      auto_awesome
                    </span>
                    <input
                      type="text"
                      value={heroInput}
                      onChange={(e) => setHeroInput(e.target.value)}
                      placeholder="e.g. Plan a 5-day budget trip to Goa from Ahmedabad..."
                      className="w-full bg-surface-container border border-slate rounded px-3 py-2.5 pl-9 font-data-mono text-xs sm:text-sm text-ink-navy placeholder:text-slate focus:outline-none focus:border-horizon-amber"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-horizon-amber text-ink-navy font-bold px-5 py-2.5 rounded border border-ink-navy hover:bg-opacity-90 transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <span>Synthesize</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>

                {/* Sample Prompt Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate/40">
                  <span className="text-[10px] text-slate font-data-mono uppercase tracking-wider">Try:</span>
                  {HERO_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyHeroSuggestion(item)}
                      className="px-2 py-0.5 bg-surface-container hover:bg-surface-container-high border border-slate/60 rounded text-[11px] font-data-mono text-ink-navy truncate max-w-[280px] sm:max-w-none transition-colors text-left"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/plan"
                  className="bg-horizon-amber text-ink-navy font-body-md font-bold px-7 py-3.5 border-2 border-ink-navy shadow-[3px_3px_0px_0px_#1B2A4A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                  <span>Plan My Trip</span>
                </Link>

                <Link
                  to="/transport"
                  className="bg-paper text-ink-navy font-body-md font-bold px-6 py-3.5 border-2 border-slate hover:border-ink-navy hover:bg-surface-container transition-all rounded flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-route-teal text-lg">commute</span>
                  <span>Book Flights, Trains & Buses</span>
                </Link>

                <Link
                  to="/city-search"
                  className="px-5 py-3.5 text-slate hover:text-ink-navy transition-colors font-medium text-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">explore</span>
                  <span>Explore Destinations</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Tactile Boarding Pass & Route Card */}
            <div className="w-full lg:w-[42%] flex flex-col items-center">
              {/* Card Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg border border-slate mb-3 text-xs font-data-mono">
                <button
                  type="button"
                  onClick={() => setActiveStub('flight')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeStub === 'flight' ? 'bg-paper font-bold text-ink-navy border border-slate shadow-xs' : 'text-slate'
                  }`}
                >
                  ✈️ Flight
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStub('train')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeStub === 'train' ? 'bg-paper font-bold text-ink-navy border border-slate shadow-xs' : 'text-slate'
                  }`}
                >
                  🚆 Train
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStub('bus')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeStub === 'bus' ? 'bg-paper font-bold text-ink-navy border border-slate shadow-xs' : 'text-slate'
                  }`}
                >
                  🚌 Bus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStub('itinerary')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeStub === 'itinerary' ? 'bg-paper font-bold text-ink-navy border border-slate shadow-xs' : 'text-slate'
                  }`}
                >
                  🗺️ Route
                </button>
              </div>

              {/* Tactile Boarding Pass Ticket */}
              <div className="relative w-full max-w-md transform-gpu hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-paper border-2 border-ink-navy rounded-lg shadow-[6px_6px_0px_0px_#1B2A4A] overflow-hidden flex min-h-[260px]">
                  {/* Perforated Edge */}
                  <div className="w-14 border-r-2 border-dashed border-slate perforated-edge flex-shrink-0 flex flex-col items-center justify-between py-6 bg-surface-container">
                    <span className="font-data-mono-sm text-[10px] text-slate -rotate-90 whitespace-nowrap">GT-PASS</span>
                    <span className="w-2 h-2 rounded-full bg-horizon-amber"></span>
                    <span className="font-data-mono-sm text-[10px] text-slate -rotate-90 whitespace-nowrap">CONFIRMED</span>
                  </div>

                  {/* Ticket Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between relative bg-paper">
                    {activeStub === 'flight' && (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase tracking-wider">
                              COMMERCIAL FLIGHT • 6E-2412
                            </span>
                            <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Ahmedabad ➔ Delhi</h3>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-data-mono text-[10px] font-bold">
                              NON-STOP
                            </span>
                            <div className="text-xs font-bold text-ink-navy font-data-mono mt-1">{formatCurrency(45)}</div>
                          </div>
                        </div>

                        <div className="my-4">
                          <div className="font-data-mono text-sm text-ink-navy flex items-center justify-between">
                            <div className="text-left">
                              <div className="font-bold text-xl text-ink-navy">AMD</div>
                              <div className="text-[10px] text-slate">06:15 AM</div>
                            </div>
                            <div className="flex-grow mx-4 relative flex flex-col items-center">
                              <span className="text-[10px] font-data-mono text-slate mb-1">1h 35m</span>
                              <div className="w-full h-px bg-slate route-dash relative flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-route-teal bg-paper px-1">
                                  flight_takeoff
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl text-ink-navy">DEL</div>
                              <div className="text-[10px] text-slate">07:50 AM</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate/60 flex justify-between items-center text-xs font-data-mono">
                          <span className="text-slate">PASSENGER: Jane Traveler</span>
                          <span className="text-horizon-amber font-bold">SEAT 12A • GATE 4</span>
                        </div>
                      </>
                    )}

                    {activeStub === 'train' && (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase tracking-wider">
                              VANDE BHARAT EXP • #20901
                            </span>
                            <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Mumbai ➔ Goa Madgaon</h3>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-data-mono text-[10px] font-bold">
                              AVAILABLE (48)
                            </span>
                            <div className="text-xs font-bold text-ink-navy font-data-mono mt-1">{formatCurrency(22)}</div>
                          </div>
                        </div>

                        <div className="my-4">
                          <div className="font-data-mono text-sm text-ink-navy flex items-center justify-between">
                            <div className="text-left">
                              <div className="font-bold text-xl text-ink-navy">CSMT</div>
                              <div className="text-[10px] text-slate">05:25 AM</div>
                            </div>
                            <div className="flex-grow mx-4 relative flex flex-col items-center">
                              <span className="text-[10px] font-data-mono text-slate mb-1">7h 45m</span>
                              <div className="w-full h-px bg-slate route-dash relative flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-route-teal bg-paper px-1">
                                  train
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl text-ink-navy">MAO</div>
                              <div className="text-[10px] text-slate">01:10 PM</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate/60 flex justify-between items-center text-xs font-data-mono">
                          <span className="text-slate">CLASS: AC Chair Car (CC)</span>
                          <span className="text-route-teal font-bold">C3 • BERTH 24</span>
                        </div>
                      </>
                    )}

                    {activeStub === 'bus' && (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase tracking-wider">
                              ZINGBUS PLUS • AC SLEEPER
                            </span>
                            <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Bengaluru ➔ Kochi</h3>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-data-mono text-[10px] font-bold">
                              4.8 ★ RATED
                            </span>
                            <div className="text-xs font-bold text-ink-navy font-data-mono mt-1">{formatCurrency(14)}</div>
                          </div>
                        </div>

                        <div className="my-4">
                          <div className="font-data-mono text-sm text-ink-navy flex items-center justify-between">
                            <div className="text-left">
                              <div className="font-bold text-xl text-ink-navy">BLR</div>
                              <div className="text-[10px] text-slate">09:30 PM</div>
                            </div>
                            <div className="flex-grow mx-4 relative flex flex-col items-center">
                              <span className="text-[10px] font-data-mono text-slate mb-1">9h 30m Overnight</span>
                              <div className="w-full h-px bg-slate route-dash relative flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-route-teal bg-paper px-1">
                                  directions_bus
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl text-ink-navy">COK</div>
                              <div className="text-[10px] text-slate">07:00 AM</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate/60 flex justify-between items-center text-xs font-data-mono">
                          <span className="text-slate">COACH: BharatBenz 2+1</span>
                          <span className="text-horizon-amber font-bold">BERTH U4 (Single)</span>
                        </div>
                      </>
                    )}

                    {activeStub === 'itinerary' && (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase tracking-wider">
                              MULTI-CITY EXPEDITION
                            </span>
                            <h3 className="font-headline-sm text-lg font-bold text-ink-navy">Golden Temple & Heritage</h3>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-route-teal/10 text-route-teal rounded font-data-mono text-[10px] font-bold">
                              DAY 1 OF 5
                            </span>
                          </div>
                        </div>

                        <div className="my-4">
                          <div className="font-data-mono text-xs text-ink-navy flex items-center justify-between">
                            <span>TYO (Tokyo)</span>
                            <div className="flex-grow mx-3 h-px bg-slate route-dash"></div>
                            <span>KNZ (Kanazawa)</span>
                            <div className="flex-grow mx-3 h-px bg-slate route-dash"></div>
                            <span>KYO (Kyoto)</span>
                          </div>
                          <p className="text-[11px] text-slate mt-2 italic">
                            3 Stops • 14 Curated Activities • $2,350 Est. Budget
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate/60 flex justify-between items-center text-xs font-data-mono">
                          <span className="text-slate">AI GENERATED • ZERO REPETITION</span>
                          <Link to="/plan" className="text-horizon-amber font-bold hover:underline">
                            Open Builder →
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            WHAT GLOBETROTTER DOES: THE 6 PILLARS
            ======================================================== */}
        <section className="w-full py-20 px-margin-page bg-surface-container border-y border-slate">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="font-data-mono-sm text-xs font-bold text-route-teal uppercase tracking-widest">
                Comprehensive Logistics Architecture
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-ink-navy">
                What GlobeTrotter Actually Does
              </h2>
              <p className="font-body-md text-slate text-sm sm:text-base">
                We combine generative reasoning with verified transit corridors to take you from vague idea to booked journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOWCASE_PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-paper border border-slate rounded-lg p-6 flex flex-col justify-between hover:border-horizon-amber transition-all shadow-sm group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center border border-slate/60 text-primary">
                        <span className="material-symbols-outlined text-xl">{pillar.icon}</span>
                      </div>
                      <span className="text-[10px] font-data-mono text-slate border border-slate/60 px-2 py-0.5 rounded">
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-lg font-bold text-ink-navy group-hover:text-horizon-amber transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="font-body-md text-xs sm:text-sm text-slate leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate/40">
                    <Link
                      to={pillar.action}
                      className="text-xs font-bold text-ink-navy hover:text-horizon-amber transition-colors flex items-center gap-1 font-data-mono"
                    >
                      <span>{pillar.actionText}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            POPULAR EXPEDITION PREVIEWS
            ======================================================== */}
        <section className="w-full py-20 px-margin-page max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate pb-4">
            <div>
              <span className="font-data-mono text-xs text-slate">TACTILE EXPEDITION CARDS</span>
              <h2 className="font-headline-md text-2xl sm:text-3xl font-bold text-ink-navy">
                Handcrafted Itinerary Blueprints
              </h2>
            </div>
            <Link to="/plan" className="text-xs font-bold text-horizon-amber font-data-mono hover:underline">
              Create Custom Blueprint →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/signup" className="bg-paper border-2 border-slate flex flex-col hover:border-horizon-amber transition-all group rounded-lg overflow-hidden shadow-xs">
              <div className="h-4 border-b-2 border-dashed border-slate ticket-stub bg-surface-container"></div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase">HERITAGE & TEMPLE</span>
                  <h4 className="font-headline-sm text-lg font-bold text-ink-navy mt-1 group-hover:text-horizon-amber transition-colors">
                    Varanasi & Ujjain Trail
                  </h4>
                  <p className="font-body-md text-slate text-xs mt-2">
                    Ancient alleyways, Ganga Aarti riverboats, and sacred Jyotirlinga shrines.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate/40 font-data-mono text-xs text-ink-navy flex justify-between items-center">
                  <span>5 DAYS</span>
                  <span className="font-bold text-horizon-amber">{formatCurrency(380)}</span>
                </div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border-2 border-slate flex flex-col hover:border-horizon-amber transition-all group rounded-lg overflow-hidden shadow-xs">
              <div className="h-4 border-b-2 border-dashed border-slate ticket-stub bg-surface-container"></div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase">COASTAL & LEISURE</span>
                  <h4 className="font-headline-sm text-lg font-bold text-ink-navy mt-1 group-hover:text-horizon-amber transition-colors">
                    Goa North & South Loop
                  </h4>
                  <p className="font-body-md text-slate text-xs mt-2">
                    Old Portuguese quarters of Fontainhas, sunset boat cruises, and beach shacks.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate/40 font-data-mono text-xs text-ink-navy flex justify-between items-center">
                  <span>6 DAYS</span>
                  <span className="font-bold text-horizon-amber">{formatCurrency(460)}</span>
                </div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border-2 border-slate flex flex-col hover:border-horizon-amber transition-all group rounded-lg overflow-hidden shadow-xs">
              <div className="h-4 border-b-2 border-dashed border-slate ticket-stub bg-surface-container"></div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase">ALPINE & VALLEYS</span>
                  <h4 className="font-headline-sm text-lg font-bold text-ink-navy mt-1 group-hover:text-horizon-amber transition-colors">
                    Kashmir Srinagar & Gulmarg
                  </h4>
                  <p className="font-body-md text-slate text-xs mt-2">
                    Dal Lake Shikara stays, Gondola rides in Gulmarg, and Mughal garden walks.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate/40 font-data-mono text-xs text-ink-navy flex justify-between items-center">
                  <span>7 DAYS</span>
                  <span className="font-bold text-horizon-amber">{formatCurrency(580)}</span>
                </div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border-2 border-slate flex flex-col hover:border-horizon-amber transition-all group rounded-lg overflow-hidden shadow-xs">
              <div className="h-4 border-b-2 border-dashed border-slate ticket-stub bg-surface-container"></div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-data-mono text-route-teal font-bold uppercase">GLOBAL EXPEDITION</span>
                  <h4 className="font-headline-sm text-lg font-bold text-ink-navy mt-1 group-hover:text-horizon-amber transition-colors">
                    Kyoto, Tokyo & Kanazawa
                  </h4>
                  <p className="font-body-md text-slate text-xs mt-2">
                    Bullet train transit, Fushimi Inari shrine hikes, and traditional Gion tea ceremonies.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate/40 font-data-mono text-xs text-ink-navy flex justify-between items-center">
                  <span>10 DAYS</span>
                  <span className="font-bold text-horizon-amber">{formatCurrency(2450)}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ========================================================
            CALL TO ACTION BANNER
            ======================================================== */}
        <section className="w-full bg-ink-navy py-20 px-margin-page flex flex-col items-center justify-center text-center border-t-4 border-horizon-amber">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="px-3 py-1 bg-paper/10 border border-paper/20 rounded-full text-paper text-xs font-data-mono">
              GET STARTED IN UNDER 60 SECONDS
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-paper tracking-tight">
              Ready for your next waypoint?
            </h2>
            <p className="text-slate text-sm sm:text-base">
              Create your account in seconds, specify your travel style, and let GlobeTrotter handle the logistics.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link
                to="/signup"
                className="bg-horizon-amber text-ink-navy font-body-md font-bold px-8 py-4 shadow-[4px_4px_0px_0px_#F7F4EC] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded text-sm inline-flex items-center gap-2"
              >
                <span>Create Free Traveler Account</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                to="/login"
                className="bg-paper text-ink-navy font-body-md font-bold px-8 py-4 border border-slate hover:bg-surface-container transition-all rounded text-sm inline-block"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-ink-navy border-t border-slate/40 px-margin-page py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm font-bold text-paper text-sm">GlobeTrotter</span>
            <span className="text-slate font-data-mono">• AI Travel Logistics & Transit Platform</span>
          </div>
          <div className="flex gap-6 font-data-mono text-slate">
            <Link to="/plan" className="hover:text-horizon-amber transition-colors">Plan Itinerary</Link>
            <Link to="/transport" className="hover:text-horizon-amber transition-colors">Flights, Trains & Buses</Link>
            <Link to="/community" className="hover:text-horizon-amber transition-colors">Community</Link>
            <Link to="/login" className="hover:text-horizon-amber transition-colors">Sign In</Link>
          </div>
          <div className="text-slate font-data-mono text-[11px]">
            © {new Date().getFullYear()} GlobeTrotter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
