import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: 'Jane',
    lastName: 'Traveler',
    email: 'jane.new@globetrotter.io',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    city: 'San Francisco',
    country: 'United States',
    bio: 'Frequent traveler interested in outdoor hiking, culinary tours, and culture exploration.'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        bio: formData.bio
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
      <TopAppBar title="Registration" />

      <div className="flex-grow flex items-center justify-center p-margin-page relative py-10">
        <div className="w-full max-w-xl bg-paper border border-slate rounded-lg p-8 relative shadow-sm z-10">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-b border-r border-slate bg-paper rotate-45"></div>

          {/* Logo Header */}
          <div className="text-center mb-6">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">GlobeTrotter</h1>
            <p className="font-body-md text-slate mt-1">Register your new traveler account.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 bg-alert-coral/10 border border-alert-coral rounded text-alert-coral text-xs font-data-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login / Sign Up Tabs */}
          <div className="flex border-b border-slate mb-6">
            <Link
              to="/login"
              className="flex-1 pb-3 text-center font-headline-sm text-headline-sm text-ink-navy hover:text-horizon-amber transition-colors"
            >
              Login
            </Link>
            <button className="flex-1 pb-3 font-headline-sm text-headline-sm text-horizon-amber border-b-2 border-horizon-amber font-bold">
              Sign Up (Registration)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="Traveler"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="password">
                  Password (min. 6 characters)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="United States"
                />
              </div>
            </div>

            <div>
              <label className="block font-body-md text-xs font-semibold text-ink-navy mb-1" htmlFor="bio">
                Travel Style & Preferences
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-paper border border-slate rounded p-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                placeholder="Tell us about your travel preferences..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-horizon-amber text-ink-navy font-body-md font-bold py-3 rounded hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Register Now & Access Dashboard</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate text-center">
            <p className="text-xs text-slate font-data-mono-sm mb-2">Already have an account?</p>
            <Link
              to="/login"
              className="inline-block w-full text-center py-2.5 border border-slate rounded bg-surface-container font-headline-sm text-sm text-ink-navy hover:bg-surface-container-high font-semibold transition-colors"
            >
              Log In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
