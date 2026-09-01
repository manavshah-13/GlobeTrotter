import { Request, Response } from 'express';
import {
  findUserByEmail,
  createUser,
  comparePassword,
  generateToken,
  UserPayload
} from '../services/authService.js';

export async function registerHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, phone, city, country, role } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Valid email address is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const newUser = await createUser({
      email: cleanEmail,
      password,
      name,
      phone,
      city,
      country,
      role: role === 'admin' || cleanEmail === 'admin@globetrotter.io' ? 'admin' : 'traveler'
    });

    const userPayload: UserPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city,
      country: newUser.country,
      avatar: newUser.avatar,
      created_at: newUser.created_at
    };

    const token = generateToken(userPayload);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: userPayload,
      token
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Registration failed.' });
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      // Auto-provision demo credentials if valid demo pattern
      if (cleanEmail === 'traveler@globetrotter.io' || cleanEmail === 'admin@globetrotter.io') {
        const demoUser = await createUser({
          email: cleanEmail,
          password: password,
          role: cleanEmail.includes('admin') ? 'admin' : 'traveler'
        });
        const userPayload: UserPayload = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          avatar: demoUser.avatar
        };
        const token = generateToken(userPayload);
        res.status(200).json({ success: true, user: userPayload, token });
        return;
      }

      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      created_at: user.created_at
    };

    const token = generateToken(userPayload);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: userPayload,
      token
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Login failed.' });
  }
}

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const user = await findUserByEmail(req.user.email);
    if (!user) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
        country: user.country,
        avatar: user.avatar,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Failed to fetch user.' });
  }
}
