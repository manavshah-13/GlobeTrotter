import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ALL_SCREENS = [
  { name: "Landing Page", path: "/landing", icon: "flight_takeoff" },
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Sign Up", path: "/signup", icon: "person_add" },
  { name: "Login", path: "/login", icon: "login" },
  { name: "Plan a New Trip", path: "/plan", icon: "add_location_alt" },
  { name: "Itinerary Builder", path: "/builder", icon: "route" },
  { name: "My Trips", path: "/trips", icon: "luggage" },
  { name: "Community Hub", path: "/community", icon: "groups" },
  { name: "Activity Search", path: "/activity-search", icon: "local_activity" },
  { name: "City Search", path: "/city-search", icon: "location_city" },
  { name: "Itinerary View", path: "/itinerary", icon: "map" },
  { name: "Trip Calendar", path: "/calendar", icon: "calendar_month" },
  { name: "Profile & Settings", path: "/settings", icon: "tune" },
  { name: "Shared Itinerary", path: "/shared", icon: "share" },
  { name: "Budget Breakdown", path: "/budget", icon: "account_balance_wallet" },
  { name: "Admin Analytics", path: "/admin", icon: "analytics" }
];

export function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <nav className="h-screen sticky top-0 left-0 w-64 flex-shrink-0 border-r border-slate bg-paper flex flex-col p-stack-lg gap-stack-md z-10 hidden lg:flex">
      <div className="flex items-center gap-stack-sm mb-4">
        <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center border border-slate">
          <span className="material-symbols-outlined text-route-teal">public</span>
        </div>
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">GlobeTrotter</h2>
          <p className="font-data-mono-sm text-data-mono-sm text-slate">Workspace</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-grow pr-1 custom-scrollbar">
        {ALL_SCREENS.map((screen) => {
          const isActive = location.pathname === screen.path || (screen.path === '/landing' && location.pathname === '/');
          return (
            <Link
              key={screen.path}
              to={screen.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-surface-container-highest text-horizon-amber font-bold shadow-sm'
                  : 'text-ink-navy hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'text-horizon-amber' : 'text-slate'}`}>
                {screen.icon}
              </span>
              <span className="truncate">{screen.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-alert-coral hover:bg-alert-coral/10 font-medium text-sm transition-all"
        >
          <span className="material-symbols-outlined text-alert-coral">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

export function TopAppBar({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <header className="w-full bg-paper border-b border-slate px-margin-page py-3.5 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/landing" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          GlobeTrotter
        </Link>
        {title && (
          <span className="text-slate font-data-mono-sm text-sm border-l border-slate pl-4 hidden md:inline">
            {title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthPage ? (
          <Link
            to="/landing"
            className="text-sm font-medium text-ink-navy hover:text-horizon-amber flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        ) : (
          <>
            <Link
              to="/community"
              className="text-sm font-medium text-ink-navy hover:text-horizon-amber hidden sm:inline-block"
            >
              Community
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-paper border border-slate text-alert-coral font-bold px-3.5 py-1.5 rounded text-sm hover:bg-alert-coral/10 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-alert-coral">logout</span>
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
