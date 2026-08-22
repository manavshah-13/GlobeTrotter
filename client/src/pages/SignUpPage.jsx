import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/Navigation';

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-body-md text-ink-navy">
      <TopAppBar title="Sign Up" />

      <div className="flex-grow flex items-center justify-center p-margin-page relative">
        <div className="w-full max-w-md bg-paper border border-slate rounded-lg p-8 relative shadow-sm z-10">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-b border-r border-slate bg-paper rotate-45"></div>

          {/* Logo Header */}
          <div className="text-center mb-6">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">GlobeTrotter</h1>
            <p className="font-body-md text-slate mt-1">Create your travel workspace account.</p>
          </div>

          {/* Login / Sign Up Tabs */}
          <div className="flex border-b border-slate mb-6">
            <Link
              to="/login"
              className="flex-1 pb-3 text-center font-headline-sm text-headline-sm text-ink-navy hover:text-horizon-amber transition-colors"
            >
              Login
            </Link>
            <button className="flex-1 pb-3 font-headline-sm text-headline-sm text-horizon-amber border-b-2 border-horizon-amber font-bold">
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body-md text-sm text-ink-navy font-semibold mb-1" htmlFor="fullname">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none">person</span>
                <input
                  id="fullname"
                  type="text"
                  required
                  defaultValue="Jane Traveler"
                  className="w-full bg-paper border border-slate rounded pl-10 pr-3 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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
                  defaultValue="jane@globetrotter.io"
                  className="w-full bg-paper border border-slate rounded pl-10 pr-3 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-body-md text-sm text-ink-navy font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  defaultValue="password123"
                  className="w-full bg-paper border border-slate rounded pl-10 pr-3 py-2.5 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-horizon-amber text-ink-navy font-body-md font-bold py-3 rounded hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-lg">check_circle</span>
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
