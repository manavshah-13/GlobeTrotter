# 🌍 GlobeTrotter — Smart Multi-City Itinerary Planner

GlobeTrotter is an intelligent travel logistics platform engineered with a tactile retro-modern design system, powered by **Google Gemini 2.5 Flash** and a relational backend schema.

---

## 🌟 Key Features

1. **AI Multi-City Itinerary Generator**:
   - Natural language itinerary synthesizer that parses user prompts into multi-city stopovers, curated day-by-day activities, and cost estimates.
   - Powered by Gemini 2.5 Flash with structured JSON schemas and resilient fallbacks.
2. **Dynamic Itinerary Builder**:
   - Add/reorder waypoint stops and assign categorized activities (Culinary, Sightseeing, Culture, Adventure, Nightlife) with instant updates and full persistence.
3. **Itinerary View & Budget Breakdown**:
   - Day-by-day chronological breakdown with itemized costs, transit allocations, and budget analytics.
4. **Interactive Public Sharing**:
   - View-only shareable itineraries with one-click link copying and clone-trip capabilities.
5. **Robust Authentication & Protected Routes**:
   - Full session management with `AuthContext`, input validation, route guards (`ProtectedRoute`), and demo accounts.
6. **Tactile Editorial Aesthetic**:
   - Tailored palette (`#1B2A4A` Ink Navy, `#E8873A` Horizon Amber, `#2F8F82` Route Teal, `#F7F4EC` Paper), IBM Plex Mono typography, ticket stub borders, and perforated boarding passes.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI Engine**: Google Gemini 2.5 Flash / 1.5 Flash via `@google/generative-ai`
- **Database & Edge**: Supabase Postgres & Deno Edge Functions
- **State & Sync**: Dynamic React Context with session persistence and resilient backend memory sync

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
# Server listens on port 5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
# Client runs on port 3000 (proxies /api to localhost:5000)
```

---

## 🔑 Demo Accounts

- **Traveler**: `traveler@globetrotter.io` / `password123`
- **Admin**: `admin@globetrotter.io` / `adminpassword`