# AGENTS.md — AI Agent Contributor Guidelines

This document provides context, technical constraints, design guidelines, and operational procedures for AI coding agents (such as Claude Code, Cursor, Copilot, Antigravity, Roo Code, Aider) operating in the GlobeTrotter codebase.

---

## Project Overview

GlobeTrotter is a multi-city travel logistics platform that synthesizes day-by-day itineraries, live route waypoints, multi-modal transport options, and itemized financial analytics.

### Key Architectural Pillars
```
[Browser / Client] (React 18 + Vite SPA)
      │
      ▼  (REST API calls)
[Server] (Node.js + Express + TypeScript)
   ├── Google Gemini 3.6 Flash (Structured JSON Itinerary Synthesis)
   ├── Supabase Postgres DB (Trips, Stops, Activities, Auth)
   └── In-Memory Fallback Cache (Resilience during offline/testing)
```

---

## Tech Stack and Workspace Layout

```
GlobeTrotter/
├── client/                 # React 18 + Vite Frontend Single-Page App
│   ├── src/
│   │   ├── components/     # Shared UI (Navigation, Modals, Cards)
│   │   ├── context/        # React contexts (CurrencyContext, AuthContext)
│   │   ├── pages/          # Route page components
│   │   ├── services/       # Frontend API client layer (api.js)
│   │   ├── index.css       # Tailwind base + custom ticket/perforation styles
│   │   └── App.jsx         # React router configuration
│   ├── tailwind.config.js  # Theme tokens (colors, fonts, spacing)
│   └── package.json
├── server/                 # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/    # Request handlers (itinerary, trips, stops, transport)
│   │   ├── routes/         # Express router endpoints
│   │   ├── services/       # Gemini AI service, Supabase DB service
│   │   └── server.ts       # Application entry point & middleware
│   └── package.json
├── supabase/               # Database migration schemas & seed data
├── brag-output/            # 30s launch video deliverables & media assets
└── .github/                # Issue templates and PR workflows
```

---

## Design System and Styling Rules

Agents must adhere strictly to the Tactile Retro-Modern Design System:

1. **Color Tokens**:
   - Paper / Background: `#F7F4EC` (light paper) or `#FCF9F1` (surface)
   - Ink Navy: `#1B2A4A` (primary text, deep borders, dark accents)
   - Horizon Amber: `#E8873A` (primary CTA, active accents, flight tags)
   - Route Teal: `#2F8F82` (waypoint lines, transit routes, confirmed badges)
   - Alert Coral: `#E85D4E` (errors, high-cost alerts, cancellations)
   - Slate: `#6B7280` / `#475569` (secondary text, borders)

2. **Typography**:
   - Headlines: `Space Grotesk`, sans-serif (`font-headline-lg`, `font-headline-md`)
   - Body Copy: `Inter`, sans-serif (`font-body-md`)
   - Transit / Numbers / Data: `IBM Plex Mono`, monospace (`font-data-mono`, `font-data-mono-sm`)

3. **Tactile Signatures**:
   - Use `.perforated-edge` and `.ticket-stub` classes for boarding pass cards.
   - Use `.dashed-route-line` and `.route-dash` for transit connectors.
   - Hard tactile shadows: `shadow-[3px_3px_0px_0px_#1B2A4A]` or `shadow-[4px_4px_0px_0px_#1B2A4A]`.
   - Never use generic rounded modern gradients or Tailwind defaults (e.g. plain `bg-blue-500` or `rounded-2xl` pills) that break the retro ticket aesthetic.

---

## AI Service and Gemini Prompting Constraints

When editing or extending `server/src/services/geminiService.ts`:
- Always use the model identifier: `gemini-1.5-flash` or `gemini-3.6-flash` (or configured via environment).
- Enforce strict JSON output using structured response schemas where possible.
- Include anti-repetition rules: activities per city/day must be unique.
- Include error handling that falls back to structured mock data if the API rate limit is reached or keys are missing.

---

## Security and Environment Boundaries

- **Never** commit or display real API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`).
- Always check that `.env` files in `client/` and `server/` are listed in `.gitignore`.
- Sanitize and validate all user inputs before querying Supabase or prompting Gemini.
- Do not expose administrative endpoints without role-based authentication middleware.

---

## Build and Validation Commands

Before concluding any modification or preparing a PR, run:

### Frontend Validation:
```bash
cd client
npm run build
```

### Backend Validation:
```bash
cd server
npm run build
```

Ensure zero TypeScript compilation errors and zero broken Vite module imports.
