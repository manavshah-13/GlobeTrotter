/**
 * GlobeTrotter API Client Service
 */

const API_BASE = '/api';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return response.json();
}

// --- AI Endpoints ---
export async function generateItinerary({ prompt, user_id, start_date }) {
  return fetchApi('/generate-itinerary', {
    method: 'POST',
    body: JSON.stringify({ prompt, user_id, start_date }),
  });
}

export async function recommendActivities({ city_name, budget_level = 'moderate' }) {
  return fetchApi('/recommend-activities', {
    method: 'POST',
    body: JSON.stringify({ city_name, budget_level }),
  });
}

export async function estimateBudget({ destination, days = 5, travel_style = 'balanced' }) {
  return fetchApi('/estimate-budget', {
    method: 'POST',
    body: JSON.stringify({ destination, days, travel_style }),
  });
}

// --- Trips CRUD ---
export async function getTrips(userId) {
  const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
  return fetchApi(`/trips${query}`);
}

export async function getTripDetails(tripId) {
  return fetchApi(`/trips/${encodeURIComponent(tripId)}`);
}

export async function createTrip(tripData) {
  return fetchApi('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
}

export async function deleteTrip(tripId) {
  return fetchApi(`/trips/${encodeURIComponent(tripId)}`, {
    method: 'DELETE',
  });
}

// --- Stops CRUD ---
export async function addStop(stopData) {
  return fetchApi('/stops', {
    method: 'POST',
    body: JSON.stringify(stopData),
  });
}

export async function removeStop(stopId) {
  return fetchApi(`/stops/${encodeURIComponent(stopId)}`, {
    method: 'DELETE',
  });
}

// --- Activities CRUD ---
export async function assignActivity(activityData) {
  return fetchApi('/trip-activities', {
    method: 'POST',
    body: JSON.stringify(activityData),
  });
}

export async function removeActivity(activityId) {
  return fetchApi(`/trip-activities/${encodeURIComponent(activityId)}`, {
    method: 'DELETE',
  });
}

// --- Copy Trip ---
export async function copyTrip(sourceTripId, targetUserId) {
  return fetchApi('/trips/copy', {
    method: 'POST',
    body: JSON.stringify({
      source_trip_id: sourceTripId,
      target_user_id: targetUserId
    })
  });
}

// --- Admin Analytics ---
export async function getAdminMetrics() {
  return fetchApi('/admin/metrics');
}

export async function getAdminInsight() {
  return fetchApi('/admin-insight');
}

