import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'traveler-123',
    email: 'traveler@globetrotter.io',
    password: 'password123',
    name: 'Jane Traveler',
    city: 'San Francisco',
    country: 'United States',
    phone: '+1 (555) 234-5678',
    avatar: 'JT',
    created_at: '2024-01-15'
  },
  {
    id: 'demo-admin',
    email: 'admin@globetrotter.io',
    password: 'adminpassword',
    name: 'System Admin',
    role: 'admin',
    avatar: 'SA'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('globetrotter_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch (_) {
      return DEFAULT_USERS[0];
    }
  });

  const [usersDb, setUsersDb] = useState(() => {
    try {
      const saved = localStorage.getItem('globetrotter_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (_) {
      return DEFAULT_USERS;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('globetrotter_registered_users', JSON.stringify(usersDb));
  }, [usersDb]);

  const login = async (email, password) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.trim().length === 0) {
      throw new Error('Please enter your password.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const found = usersDb.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // If demo mode, allow login or throw helpful message
      if (cleanEmail === 'traveler@globetrotter.io' || cleanEmail.endsWith('@globetrotter.io')) {
        const demoUser = {
          id: `user-${Date.now()}`,
          email: cleanEmail,
          name: cleanEmail.split('@')[0].replace('.', ' '),
          avatar: cleanEmail.slice(0, 2).toUpperCase()
        };
        setUser(demoUser);
        return demoUser;
      }
      throw new Error('No account found with this email address. Please sign up.');
    }

    if (found.password && found.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    setUser(found);
    return found;
  };

  const signup = async (userData) => {
    const { email, password, name, phone, city, country } = userData;

    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      password,
      name: name || cleanEmail.split('@')[0],
      phone: phone || '',
      city: city || 'San Francisco',
      country: country || 'United States',
      avatar: (name || cleanEmail).slice(0, 2).toUpperCase(),
      created_at: new Date().toISOString()
    };

    setUsersDb(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('globetrotter_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
