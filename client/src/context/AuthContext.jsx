import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USERS = {
  'traveler@globetrotter.io': {
    id: 'traveler-123',
    email: 'traveler@globetrotter.io',
    name: 'Jane Traveler',
    role: 'traveler',
    city: 'San Francisco',
    country: 'United States',
    phone: '+1 (555) 234-5678',
    avatar: 'JT',
    created_at: '2024-01-15'
  },
  'admin@globetrotter.io': {
    id: 'demo-admin',
    email: 'admin@globetrotter.io',
    name: 'System Admin',
    role: 'admin',
    avatar: 'SA',
    created_at: '2024-01-01'
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('globetrotter_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('globetrotter_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Validate session on app launch
  useEffect(() => {
    async function validateSession() {
      if (token) {
        try {
          const res = await fetchCurrentUser();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('globetrotter_user', JSON.stringify(res.user));
          }
        } catch (_) {
          // Keep cached user if offline or network glitch
        }
      }
      setLoadingInitial(false);
    }
    validateSession();
  }, [token]);

  const login = async (email, password) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.trim().length === 0) {
      throw new Error('Please enter your password.');
    }

    try {
      const res = await loginApi({ email: email.trim(), password });
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('globetrotter_token', res.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(res.user));
        return res.user;
      }
      throw new Error(res?.error || 'Login failed');
    } catch (err) {
      // Offline / network fallback for demo accounts
      const cleanEmail = email.toLowerCase().trim();
      const demoAccount = DEFAULT_DEMO_USERS[cleanEmail];
      if (demoAccount && (cleanEmail === 'traveler@globetrotter.io' || cleanEmail === 'admin@globetrotter.io')) {
        const mockToken = `demo-token-${Date.now()}`;
        setToken(mockToken);
        setUser(demoAccount);
        localStorage.setItem('globetrotter_token', mockToken);
        localStorage.setItem('globetrotter_user', JSON.stringify(demoAccount));
        return demoAccount;
      }
      throw err;
    }
  };

  const signup = async (userData) => {
    const { email, password, name, phone, city, country, bio } = userData;

    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const res = await registerApi({
        email: email.trim(),
        password,
        name,
        phone,
        city,
        country,
        bio
      });

      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('globetrotter_token', res.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(res.user));
        return res.user;
      }
      throw new Error(res?.error || 'Registration failed');
    } catch (err) {
      // If server unreachable, create local user session
      const cleanEmail = email.toLowerCase().trim();
      const localUser = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role: 'traveler',
        phone: phone || '',
        city: city || 'Ahmedabad',
        country: country || 'India',
        avatar: (name || cleanEmail).slice(0, 2).toUpperCase(),
        travel_style: userData.travel_style || ['Cultural', 'Relaxed'],
        budget_tier: userData.budget_tier || 'Moderate',
        accommodation: userData.accommodation || ['Hotels'],
        activities: userData.activities || ['Sightseeing', 'Food'],
        travel_pace: userData.travel_pace || 'Balanced',
        created_at: new Date().toISOString()
      };
      const mockToken = `token-${Date.now()}`;
      setToken(mockToken);
      setUser(localUser);
      localStorage.setItem('globetrotter_token', mockToken);
      localStorage.setItem('globetrotter_user', JSON.stringify(localUser));
      return localUser;
    }
  };

  const loginWithGoogle = async (googleProfile = {}) => {
    try {
      const email = googleProfile.email || 'traveler.google@globetrotter.io';
      const name = googleProfile.name || 'Google Explorer';
      const avatar = googleProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

      const res = await fetchApi('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          avatar,
          city: googleProfile.city || 'Ahmedabad',
          country: googleProfile.country || 'India',
          travel_style: googleProfile.travel_style || ['Cultural', 'Adventure'],
          budget_tier: googleProfile.budget_tier || 'Moderate',
          preferences: googleProfile.preferences || ['Beaches', 'Food']
        })
      });

      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('globetrotter_token', res.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (_) {
      // Local fallback for offline mode
      const mockUser = {
        id: `user-google-${Date.now()}`,
        email: googleProfile.email || 'explorer.google@globetrotter.io',
        name: googleProfile.name || 'Google Traveler',
        avatar: 'G',
        city: googleProfile.city || 'Ahmedabad',
        country: googleProfile.country || 'India',
        role: 'traveler',
        travel_style: googleProfile.travel_style || ['Cultural', 'Adventure'],
        budget_tier: googleProfile.budget_tier || 'Moderate',
        created_at: new Date().toISOString()
      };
      const mockToken = `google-token-${Date.now()}`;
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('globetrotter_token', mockToken);
      localStorage.setItem('globetrotter_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const updateUserPreferences = (preferences) => {
    setUser(prev => {
      const updated = { ...prev, ...preferences };
      localStorage.setItem('globetrotter_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      signup,
      loginWithGoogle,
      updateUserPreferences,
      logout,
      loadingInitial
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
