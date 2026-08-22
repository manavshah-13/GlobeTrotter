import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import CommunityPage from './pages/CommunityPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/shared" element={<SharedItineraryPage />} />
        <Route path="/community" element={<CommunityPage />} />

        {/* Protected Authenticated Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <PlanNewTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <ItineraryBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary"
          element={
            <ProtectedRoute>
              <ItineraryViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <TripCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetBreakdownPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-search"
          element={
            <ProtectedRoute>
              <ActivitySearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/city-search"
          element={
            <ProtectedRoute>
              <CitySearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
