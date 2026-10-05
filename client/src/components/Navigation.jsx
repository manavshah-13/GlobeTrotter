import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const ALL_SCREENS = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Plan a New Trip", path: "/plan", icon: "add_location_alt" },
  { name: "Book Transportation", path: "/transport", icon: "commute" },
  { name: "Itinerary Builder", path: "/builder", icon: "route" },
  { name: "My Trips", path: "/trips", icon: "luggage" },
  { name: "Itinerary View", path: "/itinerary", icon: "map" },
  { name: "Trip Calendar", path: "/calendar", icon: "calendar_month" },
  { name: "Budget Breakdown", path: "/budget", icon: "account_balance_wallet" },
  { name: "Activity Search", path: "/activity-search", icon: "local_activity" },
  { name: "City Search", path: "/city-search", icon: "location_city" },
  { name: "Community Hub", path: "/community", icon: "groups" },
  { name: "Shared Itinerary", path: "/shared", icon: "share" },
  { name: "Profile & Settings", path: "/settings", icon: "tune" },
  { name: "Admin Analytics", path: "/admin", icon: "analytics" }
];

export function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-screen sticky top-0 left-0 w-64 flex-shrink-0 border-r border-slate bg-paper flex flex-col p-stack-lg gap-stack-md z-10 hidden lg:flex">
      <div className="flex items-center gap-stack-sm mb-4">
        <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center border border-slate font-bold text-primary text-sm overflow-hidden flex-shrink-0">
          {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
            <img src={user.avatar} alt={user.name || 'Avatar'} className="w-full h-full object-cover" />
          ) : (
            <span>{user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'GT')}</span>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="font-headline-sm text-sm font-bold text-primary truncate">{user?.name || 'GlobeTrotter'}</h2>
          <p className="font-data-mono-sm text-[11px] text-slate truncate">{user?.email || 'traveler@globetrotter.io'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-grow pr-1 custom-scrollbar">
        {ALL_SCREENS.map((screen) => {
          const isActive = location.pathname === screen.path || (screen.path === '/landing' && location.pathname === '/');
          return (
            <Link
              key={screen.path}
              to={screen.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-medium ${
                isActive
                  ? 'bg-surface-container-highest text-horizon-amber font-bold shadow-sm'
                  : 'text-ink-navy hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${isActive ? 'text-horizon-amber' : 'text-slate'}`}>
                {screen.icon}
              </span>
              <span className="truncate">{screen.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-alert-coral hover:bg-alert-coral/10 font-medium text-xs transition-all"
        >
          <span className="material-symbols-outlined text-alert-coral text-lg">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

export function TopAppBar({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-paper border-b border-slate px-margin-page py-3.5 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          GlobeTrotter
        </Link>
        {title && (
          <span className="text-slate font-data-mono-sm text-sm border-l border-slate pl-4 hidden md:inline">
            {title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Currency Switcher */}
        <div className="flex items-center bg-surface-container border border-slate rounded px-2 py-1">
          <span className="material-symbols-outlined text-sm text-slate mr-1">payments</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent font-data-mono text-xs text-ink-navy font-bold focus:outline-none cursor-pointer"
            aria-label="Currency"
          >
            {supportedCurrencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {isAuthPage ? (
          <Link
            to="/landing"
            className="text-sm font-medium text-ink-navy hover:text-horizon-amber flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        ) : isAuthenticated ? (
          <>
            <Link
              to="/plan"
              className="bg-horizon-amber text-ink-navy font-bold px-3.5 py-1.5 rounded text-xs hover:bg-opacity-90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden sm:inline">New Trip</span>
            </Link>
            <Link
              to="/settings"
              className="text-xs font-data-mono text-ink-navy hover:text-horizon-amber hidden md:inline-block"
            >
              {user?.name?.split(' ')[0] || 'Profile'}
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-paper border border-slate text-alert-coral font-bold px-3 py-1.5 rounded text-xs hover:bg-alert-coral/10 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-alert-coral">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-ink-navy hover:text-horizon-amber"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-horizon-amber text-ink-navy font-bold px-3.5 py-1.5 rounded text-xs hover:bg-opacity-90"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
