import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import PlanNewTripPage from './pages/PlanNewTripPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import MyTripsPage from './pages/MyTripsPage';
import ActivitySearchPage from './pages/ActivitySearchPage';
import CitySearchPage from './pages/CitySearchPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import TripCalendarPage from './pages/TripCalendarPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import SharedItineraryPage from './pages/SharedItineraryPage';
import BudgetBreakdownPage from './pages/BudgetBreakdownPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/plan" element={<PlanNewTripPage />} />
      <Route path="/builder" element={<ItineraryBuilderPage />} />
      <Route path="/trips" element={<MyTripsPage />} />
      <Route path="/activity-search" element={<ActivitySearchPage />} />
      <Route path="/city-search" element={<CitySearchPage />} />
      <Route path="/itinerary" element={<ItineraryViewPage />} />
      <Route path="/calendar" element={<TripCalendarPage />} />
      <Route path="/settings" element={<ProfileSettingsPage />} />
      <Route path="/shared" element={<SharedItineraryPage />} />
      <Route path="/budget" element={<BudgetBreakdownPage />} />
      <Route path="/admin" element={<AdminAnalyticsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
