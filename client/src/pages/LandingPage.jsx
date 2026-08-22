import React from 'react';
import { Link } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';

export default function LandingPage() {
  return (
    <div className="bg-paper font-body-md text-ink-navy text-body-md min-h-screen flex flex-col antialiased">
      {/* Top Header with Screen Switcher & Quick Navigation */}
      <TopAppBar title="GlobeTrotter Landing v2.1" />

      {/* Main Landing Canvas matching exact Stitch layout */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full px-margin-page py-20 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto overflow-hidden">
          <div className="w-full md:w-[55%] flex flex-col items-start gap-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-slate font-data-mono-sm text-xs text-route-teal">
              <span className="w-2 h-2 rounded-full bg-route-teal animate-pulse"></span>
              GlobeTrotter Landing v2.1 • Refined Tactile Edition
            </div>
            <h1 className="font-headline-lg text-headline-lg text-ink-navy leading-none md:text-[64px] md:leading-[64px] tracking-tight max-w-[800px]">
              Travel logistics, sorted
            </h1>
            <p className="font-body-md text-body-md text-slate max-w-md">
              Master your itineraries with precision. From departure gates to destination waypoints, keep everything in sync.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/signup"
                className="bg-horizon-amber text-ink-navy font-body-md text-body-md font-bold px-6 py-3 border border-ink-navy shadow-[2px_2px_0px_0px_#1B2A4A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-DEFAULT flex items-center gap-2"
              >
                <span>Plan Your Journey</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                to="/login"
                className="bg-paper text-ink-navy font-body-md text-body-md font-medium px-6 py-3 border border-slate hover:bg-surface-container transition-colors rounded-DEFAULT flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-route-teal">login</span>
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          {/* Interactive Boarding Pass Card */}
          <div className="w-full md:w-[45%] flex justify-center relative perspective-1000">
            <div className="relative w-full max-w-md rotate-[4deg] transform-gpu hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="bg-paper border border-slate shadow-sm flex min-h-[240px]">
                {/* Perforated Edge */}
                <div className="w-12 border-r border-dashed border-slate perforated-edge flex-shrink-0 flex items-center justify-center bg-surface-container">
                  <span className="font-data-mono-sm text-data-mono-sm text-slate -rotate-90 whitespace-nowrap">GT-9942</span>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between relative bg-paper">
                  <div className="absolute top-0 right-8 w-8 h-12 bg-horizon-amber opacity-20 transform -skew-x-12 origin-top"></div>
                  
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <p className="font-data-mono-sm text-data-mono-sm text-slate mb-1">DEPARTURE</p>
                      <p className="font-headline-sm text-headline-sm text-ink-navy">14 OCT, 08:30</p>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono-sm text-data-mono-sm text-slate mb-1">CLASS</p>
                      <p className="font-headline-sm text-headline-sm text-ink-navy">PRIORITY</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="font-data-mono text-data-mono text-ink-navy flex items-center justify-between relative">
                      <span>TYO</span>
                      <div className="flex-grow mx-4 route-dash h-1 relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-paper rounded-full border-2 border-route-teal z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-route-teal rounded-full"></div>
                        </div>
                      </div>
                      <span>KYO</span>
                      <div className="flex-grow mx-4 route-dash h-1 relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-paper rounded-full border-2 border-route-teal z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-route-teal rounded-full"></div>
                        </div>
                      </div>
                      <span>KNZ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="w-full py-24 px-margin-page max-w-7xl mx-auto overflow-hidden">
          <div className="relative w-full mb-12 mt-4">
            <div className="absolute top-0 left-0 w-full h-[2px] route-dash"></div>
            <div className="relative flex justify-between w-full max-w-5xl mx-auto px-12">
              <div className="flex flex-col items-center relative -top-[7px]">
                <div className="w-4 h-4 rounded-full bg-route-teal border-2 border-paper ring-1 ring-slate z-10"></div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-16 bg-slate border-dashed border-l"></div>
                <div className="mt-28 flex flex-col items-center text-center w-48">
                  <h3 className="font-headline-sm text-headline-sm text-ink-navy mb-2">Describe</h3>
                  <p className="font-body-md text-body-md text-slate text-sm">Input your general parameters and desired waypoints.</p>
                </div>
              </div>

              <div className="flex flex-col items-center relative -top-[7px]">
                <div className="w-4 h-4 rounded-full bg-route-teal border-2 border-paper ring-1 ring-slate z-10"></div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-slate border-dashed border-l"></div>
                <div className="mt-20 flex flex-col items-center text-center w-48">
                  <h3 className="font-headline-sm text-headline-sm text-ink-navy mb-2">Draft</h3>
                  <p className="font-body-md text-body-md text-slate text-sm">Review the initial sequence and connection times.</p>
                </div>
              </div>

              <div className="flex flex-col items-center relative -top-[7px]">
                <div className="w-4 h-4 rounded-full bg-route-teal border-2 border-paper ring-1 ring-slate z-10"></div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-24 bg-slate border-dashed border-l"></div>
                <div className="mt-36 flex flex-col items-center text-center w-48">
                  <h3 className="font-headline-sm text-headline-sm text-ink-navy mb-2">Customize</h3>
                  <p className="font-body-md text-body-md text-slate text-sm">Refine details, add specific accommodations and finalise.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boarding Pass Features Strip */}
        <section className="w-full border-y border-slate bg-surface-container py-8 overflow-x-auto">
          <div className="relative max-w-7xl mx-auto">
            <div className="min-w-[800px] flex px-margin-page divide-x divide-slate">
              <div className="flex-1 px-8 first:pl-0 last:pr-0 flex flex-col justify-center">
                <span className="font-data-mono-sm text-data-mono-sm text-slate mb-2">SYNC</span>
                <span className="font-headline-sm text-headline-sm text-ink-navy whitespace-nowrap">Real-time Itinerary</span>
              </div>
              <div className="flex-1 px-8 flex flex-col justify-center">
                <span className="font-data-mono-sm text-data-mono-sm text-slate mb-2">DOCS</span>
                <span className="font-headline-sm text-headline-sm text-ink-navy whitespace-nowrap">Unified Wallet</span>
              </div>
              <div className="flex-1 px-8 flex flex-col justify-center">
                <span className="font-data-mono-sm text-data-mono-sm text-slate mb-2">MAPS</span>
                <span className="font-headline-sm text-headline-sm text-ink-navy whitespace-nowrap">Offline Routing</span>
              </div>
              <div className="flex-1 px-8 flex flex-col justify-center">
                <span className="font-data-mono-sm text-data-mono-sm text-slate mb-2">ALERTS</span>
                <span className="font-headline-sm text-headline-sm text-ink-navy whitespace-nowrap">Smart Notifications</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-paper to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* Popular Journeys (Ticket Stubs) */}
        <section className="w-full py-20 px-margin-page max-w-7xl mx-auto">
          <h2 className="font-headline-md text-headline-md text-ink-navy mb-8">Popular Journeys</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/signup" className="bg-paper border border-slate flex flex-col hover:border-horizon-amber transition-colors group">
              <div className="h-4 border-b border-dashed border-slate ticket-stub"></div>
              <div className="p-6">
                <h4 className="font-headline-sm text-headline-sm text-ink-navy mb-2 group-hover:text-horizon-amber transition-colors">Kyoto & Beyond</h4>
                <p className="font-body-md text-body-md text-slate text-sm mb-4">A 12-day cultural deep dive connecting ancient temples.</p>
                <div className="w-full h-1 route-dash mb-4"></div>
                <div className="font-data-mono text-data-mono text-ink-navy">12 DAYS · $2,400</div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border border-slate flex flex-col hover:border-horizon-amber transition-colors group">
              <div className="h-4 border-b border-dashed border-slate ticket-stub"></div>
              <div className="p-6">
                <h4 className="font-headline-sm text-headline-sm text-ink-navy mb-2 group-hover:text-horizon-amber transition-colors">Patagonian Trails</h4>
                <p className="font-body-md text-body-md text-slate text-sm mb-4">Rugged peaks and glacial lakes in the heart of the Andes.</p>
                <div className="w-full h-1 route-dash mb-4"></div>
                <div className="font-data-mono text-data-mono text-ink-navy">14 DAYS · $3,100</div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border border-slate flex flex-col hover:border-horizon-amber transition-colors group">
              <div className="h-4 border-b border-dashed border-slate ticket-stub"></div>
              <div className="p-6">
                <h4 className="font-headline-sm text-headline-sm text-ink-navy mb-2 group-hover:text-horizon-amber transition-colors">Classic Italy</h4>
                <p className="font-body-md text-body-md text-slate text-sm mb-4">Art, history, and gastronomy from Rome to Venice.</p>
                <div className="w-full h-1 route-dash mb-4"></div>
                <div className="font-data-mono text-data-mono text-ink-navy">10 DAYS · $2,800</div>
              </div>
            </Link>

            <Link to="/signup" className="bg-paper border border-slate flex flex-col hover:border-horizon-amber transition-colors group">
              <div className="h-4 border-b border-dashed border-slate ticket-stub"></div>
              <div className="p-6">
                <h4 className="font-headline-sm text-headline-sm text-ink-navy mb-2 group-hover:text-horizon-amber transition-colors">Nordic Winter</h4>
                <p className="font-body-md text-body-md text-slate text-sm mb-4">Arctic adventures and aurora hunting in Lapland.</p>
                <div className="w-full h-1 route-dash mb-4"></div>
                <div className="font-data-mono text-data-mono text-ink-navy">8 DAYS · $3,500</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="w-full bg-ink-navy py-24 px-margin-page flex flex-col items-center justify-center text-center border-t-4 border-horizon-amber">
          <h2 className="font-headline-lg text-headline-lg text-paper mb-8 max-w-2xl mx-auto md:text-[56px] md:leading-[60px]">
            Ready for your next waypoint?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-horizon-amber text-ink-navy font-body-md text-body-md font-bold px-8 py-4 shadow-[4px_4px_0px_0px_#F7F4EC] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-DEFAULT inline-block"
            >
              Sign Up to Initialize Itinerary
            </Link>
            <Link
              to="/login"
              className="bg-paper text-ink-navy font-body-md text-body-md font-bold px-8 py-4 border border-slate hover:bg-surface-container transition-all rounded-DEFAULT inline-block"
            >
              Already Have An Account? Login
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full bg-ink-navy border-t border-slate flex flex-col md:flex-row justify-between items-center px-margin-page py-stack-lg">
        <div className="font-headline-sm text-headline-sm text-surface-container-lowest mb-4 md:mb-0">GlobeTrotter</div>
        <div className="flex gap-6 font-caption text-caption text-surface-variant mb-4 md:mb-0">
          <Link to="/login" className="hover:text-horizon-amber transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-horizon-amber transition-colors">Create Account</Link>
          <Link to="/support" className="hover:text-horizon-amber transition-colors">Support</Link>
        </div>
        <div className="font-caption text-caption text-surface-variant">© 2024 GlobeTrotter Logistics. All rights reserved.</div>
      </footer>
    </div>
  );
}
