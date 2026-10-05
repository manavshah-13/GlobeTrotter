import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

// Structured Country & City Dataset
const COUNTRY_CITY_MAP = {
  'India': ['Ahmedabad', 'Mumbai', 'Delhi', 'Bengaluru', 'Jaipur', 'Goa', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Varanasi', 'Srinagar', 'Kochi', 'Udaipur', 'Amritsar'],
  'United States': ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle', 'Miami', 'Austin', 'Las Vegas', 'Boston'],
  'United Kingdom': ['London', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge', 'Liverpool'],
  'Japan': ['Tokyo', 'Kyoto', 'Osaka', 'Sapporo', 'Hiroshima', 'Fukuoka', 'Kanazawa'],
  'France': ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg'],
  'Italy': ['Rome', 'Florence', 'Venice', 'Milan', 'Naples', 'Bologna'],
  'Germany': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Singapore': ['Singapore'],
  'Thailand': ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  'Spain': ['Barcelona', 'Madrid', 'Seville', 'Valencia'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Banff'],
  'Switzerland': ['Zurich', 'Geneva', 'Interlaken', 'Zermatt', 'Lucerne']
};

const COUNTRIES = Object.keys(COUNTRY_CITY_MAP);

const TRAVEL_STYLES = [
  { id: 'Adventure', label: 'Adventure', icon: 'hiking' },
  { id: 'Luxury', label: 'Luxury', icon: 'diamond' },
  { id: 'Budget', label: 'Budget', icon: 'savings' },
  { id: 'Backpacking', label: 'Backpacking', icon: 'backpack' },
  { id: 'Family', label: 'Family', icon: 'family_restroom' },
  { id: 'Solo', label: 'Solo', icon: 'person' },
  { id: 'Romantic', label: 'Romantic', icon: 'favorite' },
  { id: 'Cultural', label: 'Cultural', icon: 'temple_buddhist' },
  { id: 'Nature', label: 'Nature', icon: 'forest' },
  { id: 'Food & nightlife', label: 'Food & Nightlife', icon: 'nightlife' },
  { id: 'Business', label: 'Business', icon: 'business_center' },
  { id: 'Relaxed', label: 'Relaxed', icon: 'spa' },
];

const BUDGET_TIERS = [
  { id: 'Budget', label: 'Budget (Shoestring)', desc: 'Hostels, public transit, street food' },
  { id: 'Moderate', label: 'Moderate (Balanced)', desc: '3★ hotels, mixed dining, curated tours' },
  { id: 'Premium', label: 'Premium (Comfort)', desc: '4★ boutique stays, private cabs, fine dining' },
  { id: 'Luxury', label: 'Luxury (High-End)', desc: '5★ resorts, private tours, premium cabins' },
];

const ACCOMMODATIONS = [
  'Hotels', 'Hostels', 'Resorts', 'Vacation rentals', 'Guesthouses'
];

const ACTIVITIES = [
  'Beaches', 'Mountains', 'Museums', 'History', 'Food', 'Shopping',
  'Nightlife', 'Wildlife', 'Adventure', 'Photography', 'Wellness'
];

const TRAVEL_PACES = [
  { id: 'Relaxed', label: 'Relaxed', desc: '1-2 activities/day, leisurely mornings' },
  { id: 'Balanced', label: 'Balanced', desc: '3-4 activities/day, steady rhythm' },
  { id: 'Fast-paced', label: 'Fast-paced', desc: 'Action-packed, maximizing every hour' },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  // Step 1: Account & Location | Step 2: Travel Preferences
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: 'India',
    city: 'Ahmedabad',
  });

  // Structured Preferences State
  const [selectedStyles, setSelectedStyles] = useState(['Cultural', 'Relaxed']);
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [customBudget, setCustomBudget] = useState('50000');
  const [useCustomBudget, setUseCustomBudget] = useState(false);
  const [selectedAccommodations, setSelectedAccommodations] = useState(['Hotels', 'Resorts']);
  const [selectedActivities, setSelectedActivities] = useState(['Sightseeing', 'Food', 'History']);
  const [travelPace, setTravelPace] = useState('Balanced');

  // UI State
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Filtered Cities based on country
  const availableCities = COUNTRY_CITY_MAP[formData.country] || [];

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    const cities = COUNTRY_CITY_MAP[newCountry] || [];
    setFormData(prev => ({
      ...prev,
      country: newCountry,
      city: cities[0] || ''
    }));
  };

  const handleTextChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Toggle helpers
  const toggleStyle = (styleId) => {
    setSelectedStyles(prev =>
      prev.includes(styleId) ? prev.filter(s => s !== styleId) : [...prev, styleId]
    );
  };

  const toggleAccommodation = (acc) => {
    setSelectedAccommodations(prev =>
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  const toggleActivity = (act) => {
    setSelectedActivities(prev =>
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  // Auto Detect Location
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    setLocationSuccessMsg('');
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode via BigDataCloud client API (free, no key required)
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const detectedCountry = data.countryName || 'India';
          const detectedCity = data.city || data.locality || 'Ahmedabad';

          // Match country if known
          const matchedCountry = COUNTRIES.find(c => c.toLowerCase() === detectedCountry.toLowerCase()) || 'India';

          setFormData(prev => ({
            ...prev,
            country: matchedCountry,
            city: detectedCity
          }));
          setLocationSuccessMsg(`📍 Detected: ${detectedCity}, ${detectedCountry}`);
        } catch (_) {
          // Graceful fallback
          setFormData(prev => ({ ...prev, country: 'India', city: 'Ahmedabad' }));
          setLocationSuccessMsg('📍 Location resolved to default (Ahmedabad, India)');
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        setError('Location permission denied. Please select your country and city from the dropdown below.');
      },
      { timeout: 8000 }
    );
  };

  // One-Click Google Signup
  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle({
        email: 'traveler.google@globetrotter.io',
        name: 'Google Explorer',
        avatar: 'G',
        city: formData.city,
        country: formData.country,
        travel_style: selectedStyles,
        budget_tier: budgetTier,
        preferences: selectedActivities
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-up failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        travel_style: selectedStyles,
        budget_tier: useCustomBudget ? `Custom: ${customBudget}` : budgetTier,
        accommodation: selectedAccommodations,
        activities: selectedActivities,
        travel_pace: travelPace
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-body-md text-ink-navy">
      <TopAppBar title="Traveler Registration & Onboarding" />

      <div className="flex-grow flex items-center justify-center p-margin-page relative py-10">
        <div className="w-full max-w-2xl bg-paper border-2 border-slate rounded-lg p-6 sm:p-8 relative shadow-sm z-10">
          {/* Ticket Header Notch */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-b-2 border-r-2 border-slate bg-paper rotate-45"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-surface-container rounded-full text-xs font-data-mono text-slate border border-slate/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-horizon-amber"></span>
              <span>Step {step} of 2 • {step === 1 ? 'Account & Origin' : 'Travel Persona & Style'}</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Join GlobeTrotter
            </h1>
            <p className="font-body-md text-slate text-xs sm:text-sm mt-1">
              Set up your profile to receive personalized itineraries and accurate transit fares.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral text-xs font-data-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick Google Sign Up Option */}
          {step === 1 && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-slate rounded-lg bg-paper hover:bg-surface-container font-headline-sm text-xs sm:text-sm font-bold text-ink-navy transition-all shadow-xs"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-grow h-px bg-slate/60"></div>
                <span className="font-data-mono text-[10px] text-slate uppercase">or register with email</span>
                <div className="flex-grow h-px bg-slate/60"></div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 1: ACCOUNT CREDENTIALS & STRUCTURED LOCATION
              ======================================================== */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1" htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleTextChange}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1" htmlFor="lastName">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleTextChange}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    placeholder="Traveler"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleTextChange}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-navy mb-1" htmlFor="password">
                    Password (min. 6 characters) *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleTextChange}
                    className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs sm:text-sm text-ink-navy focus:outline-none focus:border-horizon-amber"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Structured Location Block with Auto-Detect */}
              <div className="bg-surface-container p-4 rounded-lg border border-slate space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs font-bold text-ink-navy block">Your Base Location</span>
                    <span className="text-[11px] text-slate">Used for transit origins and currency formatting</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={detectingLocation}
                    className="px-3 py-1.5 bg-paper border border-slate rounded text-xs font-data-mono text-route-teal hover:border-route-teal transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    {detectingLocation ? (
                      <>
                        <div className="w-3 h-3 border-2 border-route-teal border-t-transparent rounded-full animate-spin"></div>
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">my_location</span>
                        <span>Auto-Detect Location</span>
                      </>
                    )}
                  </button>
                </div>

                {locationSuccessMsg && (
                  <div className="p-2 bg-route-teal/10 border border-route-teal/30 rounded text-route-teal text-xs font-data-mono flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>{locationSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-navy mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-navy mb-1">City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-xs text-ink-navy focus:outline-none focus:border-horizon-amber"
                    >
                      {availableCities.map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.firstName || !formData.email || formData.password.length < 6) {
                      setError('Please enter your name, email, and a password with at least 6 characters.');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                  className="w-full bg-horizon-amber text-ink-navy font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm shadow-xs"
                >
                  <span>Continue to Travel Preferences</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: STRUCTURED TRAVEL PERSONA & PREFERENCES
              ======================================================== */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Travel Style Chips */}
              <div>
                <label className="block text-xs font-bold text-ink-navy mb-2 flex items-center justify-between">
                  <span>Travel Style (Select all that fit you)</span>
                  <span className="text-[10px] text-slate font-data-mono">{selectedStyles.length} selected</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map(style => {
                    const isSelected = selectedStyles.includes(style.id);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => toggleStyle(style.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-data-mono flex items-center gap-1.5 transition-all border ${
                          isSelected
                            ? 'bg-horizon-amber text-ink-navy border-ink-navy font-bold shadow-2xs'
                            : 'bg-surface-container text-ink-navy border-slate/60 hover:border-ink-navy'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{style.icon}</span>
                        <span>{style.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Budget Tier */}
              <div>
                <label className="block text-xs font-bold text-ink-navy mb-2">Budget Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BUDGET_TIERS.map(tier => {
                    const isSelected = !useCustomBudget && budgetTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          setBudgetTier(tier.id);
                          setUseCustomBudget(false);
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-route-teal/10 border-route-teal shadow-2xs'
                            : 'bg-paper border-slate hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-ink-navy">{tier.label}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-route-teal text-sm">check_circle</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate mt-1">{tier.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Accommodation Preferences */}
              <div>
                <label className="block text-xs font-bold text-ink-navy mb-2">Preferred Accommodations</label>
                <div className="flex flex-wrap gap-2">
                  {ACCOMMODATIONS.map(acc => {
                    const isSelected = selectedAccommodations.includes(acc);
                    return (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => toggleAccommodation(acc)}
                        className={`px-3 py-1.5 rounded text-xs font-data-mono transition-all border ${
                          isSelected
                            ? 'bg-ink-navy text-paper border-ink-navy font-bold'
                            : 'bg-surface-container text-ink-navy border-slate/60 hover:border-ink-navy'
                        }`}
                      >
                        {acc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Activities */}
              <div>
                <label className="block text-xs font-bold text-ink-navy mb-2">Interests & Activities</label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITIES.map(act => {
                    const isSelected = selectedActivities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleActivity(act)}
                        className={`px-3 py-1.5 rounded-full text-xs font-data-mono transition-all border ${
                          isSelected
                            ? 'bg-route-teal text-paper border-route-teal font-bold'
                            : 'bg-paper text-ink-navy border-slate/60 hover:border-ink-navy'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Travel Pace */}
              <div>
                <label className="block text-xs font-bold text-ink-navy mb-2">Travel Pace</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TRAVEL_PACES.map(p => {
                    const isSelected = travelPace === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setTravelPace(p.id)}
                        className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                          isSelected
                            ? 'bg-horizon-amber/20 border-horizon-amber font-bold text-ink-navy'
                            : 'bg-paper border-slate text-ink-navy hover:bg-surface-container'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.label}</div>
                        <div className="text-[10px] text-slate mt-1">{p.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-slate rounded-lg text-xs font-data-mono text-ink-navy hover:bg-surface-container"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow bg-horizon-amber text-ink-navy font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Traveler Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration & Launch Dashboard</span>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer switch to login */}
          <div className="mt-6 pt-4 border-t border-slate text-center">
            <p className="text-xs text-slate font-data-mono mb-2">Already have an account?</p>
            <Link
              to="/login"
              className="inline-block w-full text-center py-2.5 border border-slate rounded bg-surface-container font-headline-sm text-xs sm:text-sm text-ink-navy hover:bg-surface-container-high font-semibold transition-colors"
            >
              Sign In to Existing Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
