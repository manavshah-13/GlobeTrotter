import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SidebarNav, TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { searchTransportApi, parseTravelIntentApi } from '../services/api';

const POPULAR_ROUTES = [
  { origin: 'Ahmedabad', destination: 'Delhi', label: 'AMD → DEL' },
  { origin: 'Mumbai', destination: 'Goa', label: 'BOM → GOI' },
  { origin: 'Bengaluru', destination: 'Kochi', label: 'BLR → COK' },
  { origin: 'Delhi', destination: 'Jaipur', label: 'DEL → JAI' },
  { origin: 'Ahmedabad', destination: 'Mumbai', label: 'AMD → BOM' },
  { origin: 'Tokyo', destination: 'Kyoto', label: 'TYO → KYO' }
];

export default function TransportationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatCurrency, currency } = useCurrency();

  const [activeTab, setActiveTab] = useState(searchParams.get('mode') || 'flight'); // 'flight' | 'train' | 'bus' | 'compare'
  const [origin, setOrigin] = useState(searchParams.get('origin') || user?.city || 'Ahmedabad');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Delhi');
  const [travelDate, setTravelDate] = useState(
    searchParams.get('date') || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState(parseInt(searchParams.get('passengers') || '1', 10));
  const [cabinClass, setCabinClass] = useState('economy');

  // Natural Language Query Bar
  const [nlQuery, setNlQuery] = useState('');
  const [parsingIntent, setParsingIntent] = useState(false);
  const [parsedBanner, setParsedBanner] = useState('');

  // Results State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const fetchResults = async (orig = origin, dest = destination, dt = travelDate, pax = passengers) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchTransportApi({
        origin: orig,
        destination: dest,
        date: dt,
        passengers: pax
      });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to search transportation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    fetchResults(origin, destination, travelDate, passengers);
  };

  const handleNlParse = async (e) => {
    e?.preventDefault();
    if (!nlQuery.trim()) return;

    setParsingIntent(true);
    setParsedBanner('');
    try {
      const parsed = await parseTravelIntentApi(nlQuery, {
        city: user?.city,
        country: user?.country,
        travel_style: user?.travel_style
      });

      if (parsed.origin) setOrigin(parsed.origin);
      if (parsed.destination) setDestination(parsed.destination);
      if (parsed.travel_date) setTravelDate(parsed.travel_date);
      if (parsed.passengers) setPassengers(parsed.passengers);

      if (parsed.transport_type === 'flight') setActiveTab('flight');
      else if (parsed.transport_type === 'train') setActiveTab('train');
      else if (parsed.transport_type === 'bus') setActiveTab('bus');

      setParsedBanner(`Parsed: ${parsed.summary || 'Parameters extracted and updated below'}`);
      fetchResults(
        parsed.origin || origin,
        parsed.destination || destination,
        parsed.travel_date || travelDate,
        parsed.passengers || passengers
      );
    } catch (err) {
      setError('Could not parse natural language request: ' + err.message);
    } finally {
      setParsingIntent(false);
    }
  };

  const setRouteQuick = (r) => {
    setOrigin(r.origin);
    setDestination(r.destination);
    fetchResults(r.origin, r.destination, travelDate, passengers);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Transportation & Live Transit Hub" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {/* Natural Language Travel Search Bar */}
          <div className="bg-paper border border-slate p-5 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-xs font-data-mono text-slate">
              <span className="material-symbols-outlined text-sm text-horizon-amber">psychology</span>
              <span className="font-bold text-ink-navy">AI NATURAL LANGUAGE TRANSIT SEARCH</span>
              <span className="text-[11px] text-slate hidden sm:inline">— Say it naturally</span>
            </div>
            <form onSubmit={handleNlParse} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate text-lg">
                  chat_bubble
                </span>
                <input
                  type="text"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="e.g. 'Find me a flight from Ahmedabad to Delhi next Friday for two people' or 'Train to Goa tomorrow'"
                  className="w-full bg-surface-container border border-slate rounded-lg pl-10 pr-4 py-2.5 text-sm font-data-mono text-ink-navy placeholder:text-slate/70 focus:outline-none focus:border-horizon-amber"
                />
              </div>
              <button
                type="submit"
                disabled={parsingIntent || !nlQuery.trim()}
                className="bg-ink-navy text-paper font-bold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
              >
                {parsingIntent ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-paper border-t-transparent rounded-full animate-spin"></div>
                    <span>Parsing AI...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm text-horizon-amber">auto_awesome</span>
                    <span>Extract & Search</span>
                  </>
                )}
              </button>
            </form>

            {parsedBanner && (
              <div className="mt-3 p-2.5 bg-route-teal/10 border border-route-teal/30 rounded text-route-teal text-xs font-data-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>{parsedBanner}</span>
              </div>
            )}

            {/* Quick Route Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate/40 text-xs">
              <span className="text-slate font-data-mono text-[11px]">Popular Corridors:</span>
              {POPULAR_ROUTES.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRouteQuick(r)}
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high border border-slate/60 rounded text-[11px] font-data-mono text-ink-navy transition-colors"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('flight')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'flight'
                    ? 'bg-horizon-amber text-ink-navy shadow-sm'
                    : 'bg-paper border border-slate text-ink-navy hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">flight</span>
                <span>Flights ({results?.flights?.length || 3})</span>
              </button>

              <button
                onClick={() => setActiveTab('train')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'train'
                    ? 'bg-horizon-amber text-ink-navy shadow-sm'
                    : 'bg-paper border border-slate text-ink-navy hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">train</span>
                <span>Trains ({results?.trains?.length || 3})</span>
              </button>

              <button
                onClick={() => setActiveTab('bus')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'bus'
                    ? 'bg-horizon-amber text-ink-navy shadow-sm'
                    : 'bg-paper border border-slate text-ink-navy hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">directions_bus</span>
                <span>Buses ({results?.buses?.length || 3})</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'compare'
                    ? 'bg-route-teal text-paper shadow-sm'
                    : 'bg-paper border border-slate text-ink-navy hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">balance</span>
                <span>Compare All Modes</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-data-mono text-slate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Fare Verification Enabled</span>
            </div>
          </div>

          {/* Structured Search Form */}
          <form onSubmit={handleSearchSubmit} className="bg-paper border border-slate p-5 rounded-lg space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1">Origin City / Station</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate text-base">
                    trip_origin
                  </span>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 pl-9 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1">Destination City</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate text-base">
                    location_on
                  </span>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 pl-9 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1">Departure Date</label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-navy mb-1">Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                >
                  <option value={1}>1 Traveler (Solo)</option>
                  <option value={2}>2 Travelers (Duo)</option>
                  <option value={3}>3 Travelers</option>
                  <option value={4}>4 Travelers (Family/Group)</option>
                  <option value={6}>6 Travelers</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-[11px] text-slate font-data-mono">
                Searching verified schedules for <span className="font-bold text-ink-navy">{origin}</span> ➔{' '}
                <span className="font-bold text-ink-navy">{destination}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-horizon-amber text-ink-navy font-bold px-6 py-2 rounded text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching Routes...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">search</span>
                    <span>Update Search Results</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          {error && (
            <div className="p-4 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral text-xs font-data-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Tab 1: Flights */}
          {activeTab === 'flight' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-base font-bold text-ink-navy">
                  Available Scheduled Flights ({origin} ➔ {destination})
                </h3>
                <span className="text-xs text-slate font-data-mono">Prices for {passengers} passenger(s)</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(results?.flights || []).map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-paper border border-slate rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-horizon-amber transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center border border-slate/60 text-primary font-bold text-sm">
                        {flight.carrier_code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink-navy text-sm">{flight.carrier}</span>
                          {flight.badge && (
                            <span className="px-2 py-0.5 bg-horizon-amber/20 text-ink-navy border border-horizon-amber/40 rounded text-[10px] font-bold">
                              {flight.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-data-mono text-slate">{flight.flight_number} • {flight.cabin_class}</span>
                      </div>
                    </div>

                    {/* Flight Timeline */}
                    <div className="flex items-center gap-6 flex-grow justify-center px-4">
                      <div className="text-right">
                        <div className="font-bold text-ink-navy text-base font-data-mono">{flight.departure_time}</div>
                        <div className="text-[11px] text-slate">{flight.origin_code} ({flight.origin_city})</div>
                      </div>

                      <div className="flex flex-col items-center min-w-[120px]">
                        <span className="text-[10px] font-data-mono text-slate mb-1">{flight.duration}</span>
                        <div className="w-full flex items-center">
                          <div className="w-2 h-2 rounded-full border border-route-teal bg-paper"></div>
                          <div className="flex-grow h-px bg-slate route-dash"></div>
                          <span className="material-symbols-outlined text-xs text-route-teal">flight</span>
                          <div className="flex-grow h-px bg-slate route-dash"></div>
                          <div className="w-2 h-2 rounded-full border border-route-teal bg-route-teal"></div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold mt-1">{flight.stops_info}</span>
                      </div>

                      <div className="text-left">
                        <div className="font-bold text-ink-navy text-base font-data-mono">{flight.arrival_time}</div>
                        <div className="text-[11px] text-slate">{flight.destination_code} ({flight.destination_city})</div>
                      </div>
                    </div>

                    {/* Price & Booking Link */}
                    <div className="flex flex-col items-end gap-2 min-w-[150px] w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate/40">
                      <div className="text-right">
                        <div className="text-xs text-slate">Total Fare</div>
                        <div className="font-bold text-lg text-ink-navy">{formatCurrency(flight.price)}</div>
                      </div>
                      <a
                        href={flight.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs hover:opacity-90 flex items-center gap-1.5 transition-all w-full md:w-auto justify-center"
                      >
                        <span>Book on {flight.booking_provider}</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Trains */}
          {activeTab === 'train' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-base font-bold text-ink-navy">
                  Express & Superfast Trains ({origin} ➔ {destination})
                </h3>
                <span className="text-xs text-slate font-data-mono">IRCTC / National Railway Schedule</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(results?.trains || []).map((train) => (
                  <div
                    key={train.id}
                    className="bg-paper border border-slate rounded-lg p-5 space-y-4 hover:border-route-teal transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-route-teal/10 text-route-teal border border-route-teal/30 rounded text-xs font-bold font-data-mono">
                            #{train.train_number}
                          </span>
                          <h4 className="font-bold text-ink-navy text-sm">{train.train_name}</h4>
                        </div>
                        <p className="text-xs text-slate mt-0.5">Runs on: {train.runs_on}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-data-mono">
                        <div>
                          <span className="font-bold text-ink-navy">{train.departure_time}</span>{' '}
                          <span className="text-slate">({train.origin_station})</span>
                        </div>
                        <span className="text-slate">➔ {train.duration} ➔</span>
                        <div>
                          <span className="font-bold text-ink-navy">{train.arrival_time}</span>{' '}
                          <span className="text-slate">({train.destination_station})</span>
                        </div>
                      </div>
                    </div>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {train.classes.map((cls, idx) => (
                        <div
                          key={idx}
                          className="bg-surface-container p-3 rounded border border-slate/60 flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-ink-navy text-xs">{cls.name} ({cls.code})</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                cls.status === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {cls.status} {cls.seats_available ? `(${cls.seats_available})` : ''}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between items-end">
                            <span className="text-xs text-slate">Fare</span>
                            <span className="font-bold text-ink-navy text-sm">{formatCurrency(cls.fare * passengers)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <a
                        href={train.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-ink-navy text-paper font-bold px-4 py-2 rounded text-xs hover:bg-opacity-90 flex items-center gap-1.5 transition-all"
                      >
                        <span>Reserve on {train.booking_provider}</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Buses */}
          {activeTab === 'bus' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-base font-bold text-ink-navy">
                  Intercity AC Buses & Sleeper Coaches ({origin} ➔ {destination})
                </h3>
                <span className="text-xs text-slate font-data-mono">Verified fleet operators</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(results?.buses || []).map((bus) => (
                  <div
                    key={bus.id}
                    className="bg-paper border border-slate rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-horizon-amber transition-all shadow-sm"
                  >
                    <div className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink-navy text-sm">{bus.operator}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">star</span>
                          {bus.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate mt-0.5">{bus.bus_type}</p>
                      <p className="text-[11px] text-slate/80 mt-1">Boarding: {bus.boarding_point}</p>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-6 flex-grow justify-center px-4">
                      <div>
                        <div className="font-bold text-ink-navy text-sm font-data-mono">{bus.departure_time}</div>
                        <div className="text-[11px] text-slate">{bus.origin_city}</div>
                      </div>
                      <div className="text-center min-w-[100px]">
                        <span className="text-[10px] text-slate font-data-mono">{bus.duration}</span>
                        <div className="w-full h-px bg-slate route-dash my-1"></div>
                        <span className="text-[10px] text-route-teal font-bold">{bus.seats_available} seats left</span>
                      </div>
                      <div>
                        <div className="font-bold text-ink-navy text-sm font-data-mono">{bus.arrival_time}</div>
                        <div className="text-[11px] text-slate">{bus.destination_city}</div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex flex-col items-end gap-2 min-w-[150px] w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate/40">
                      <div className="text-right">
                        <div className="text-xs text-slate">Total Fare</div>
                        <div className="font-bold text-base text-ink-navy">{formatCurrency(bus.fare)}</div>
                      </div>
                      <a
                        href={bus.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-horizon-amber text-ink-navy font-bold px-4 py-2 rounded text-xs hover:opacity-90 flex items-center gap-1.5 transition-all w-full md:w-auto justify-center"
                      >
                        <span>Book on {bus.booking_provider}</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Compare All Modes */}
          {activeTab === 'compare' && (
            <div className="bg-paper border border-slate rounded-lg p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-ink-navy">
                  Comparative Matrix: Flight vs. Train vs. Bus
                </h3>
                <p className="text-xs text-slate mt-1">
                  Side-by-side trade-off evaluation for travel between {origin} and {destination}.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate bg-surface-container font-data-mono text-slate">
                      <th className="p-3">Transit Mode</th>
                      <th className="p-3">Avg Travel Time</th>
                      <th className="p-3">Estimated Cost ({passengers} Pax)</th>
                      <th className="p-3">Comfort & Amenities</th>
                      <th className="p-3">Best Recommended For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate/60">
                    <tr>
                      <td className="p-3 font-bold text-ink-navy flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-horizon-amber">flight</span>
                        <span>Commercial Flight</span>
                      </td>
                      <td className="p-3 font-data-mono font-bold text-emerald-700">~1h 40m (Fastest)</td>
                      <td className="p-3 font-bold text-ink-navy">
                        {formatCurrency((results?.flights?.[0]?.price || 3800))}
                      </td>
                      <td className="p-3 text-slate">Quick, airport security, 15kg baggage included</td>
                      <td className="p-3 font-bold text-horizon-amber">Tight schedules, business trips, weekend getaways</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-ink-navy flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-route-teal">train</span>
                        <span>Vande Bharat / Express Train</span>
                      </td>
                      <td className="p-3 font-data-mono">6h – 13h (Overnight Sleeper)</td>
                      <td className="p-3 font-bold text-ink-navy">
                        {formatCurrency((results?.trains?.[0]?.classes?.[0]?.fare || 950) * passengers)}
                      </td>
                      <td className="p-3 text-slate">Roomy berths, landscape views, city-center drop</td>
                      <td className="p-3 font-bold text-route-teal">Budget travelers, families, scenic relaxed journeys</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-ink-navy flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-slate">directions_bus</span>
                        <span>Volvo AC Sleeper Bus</span>
                      </td>
                      <td className="p-3 font-data-mono">11h – 13h (Direct Highway)</td>
                      <td className="p-3 font-bold text-emerald-700">
                        {formatCurrency((results?.buses?.[0]?.fare || 650))} (Cheapest)
                      </td>
                      <td className="p-3 text-slate">Individual charging ports, recliner beds, flexible stops</td>
                      <td className="p-3 text-slate font-bold">Last-minute bookings, backpackers, night travels</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
