import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-body-md text-ink-navy">
      <TopAppBar title="Login" />

      <div className="flex-grow flex items-center justify-center p-margin-page relative">
        <div className="w-full max-w-md bg-paper border border-slate rounded-lg p-8 relative shadow-sm z-10">
          {/* Ticket Stub Corner Detail */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-b border-r border-slate bg-paper rotate-45"></div>

          {/* Logo Header */}
          <div className="text-center mb-6">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">GlobeTrotter</h1>
            <p className="font-body-md text-slate mt-1">Your journey begins here.</p>
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
            <button className="flex-1 pb-3 font-headline-sm text-headline-sm text-horizon-amber border-b-2 border-horizon-amber font-bold">
              Login
            </button>
            <Link
              to="/signup"
              className="flex-1 pb-3 text-center font-headline-sm text-headline-sm text-ink-navy hover:text-horizon-amber transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body-md text-sm text-ink-navy font-semibold mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none">mail</span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-paper border border-slate rounded pl-10 pr-3 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="traveler@globetrotter.io"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-body-md text-sm text-ink-navy font-semibold" htmlFor="password">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset instructions sent to your email.'); }} className="text-xs text-horizon-amber hover:underline font-data-mono-sm">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-paper border border-slate rounded pl-10 pr-3 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-1 pb-1">
              <div className="flex items-center justify-between text-[11px] font-data-mono text-slate">
                <span>Demo shortcuts:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('traveler@globetrotter.io', 'password123')}
                    className="text-route-teal hover:underline font-bold"
                  >
                    Traveler
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin@globetrotter.io', 'adminpassword')}
                    className="text-horizon-amber hover:underline font-bold"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-horizon-amber text-ink-navy font-body-md font-bold py-3 rounded hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Board Flight (Sign In)</span>
                  <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate text-center">
            <p className="text-xs text-slate font-data-mono-sm mb-2">New traveler?</p>
            <Link
              to="/signup"
              className="inline-block w-full text-center py-2.5 border border-slate rounded bg-surface-container font-headline-sm text-sm text-ink-navy hover:bg-surface-container-high font-semibold transition-colors"
            >
              Create Account → Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
