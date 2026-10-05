# Contributing to GlobeTrotter

Thank you for your interest in contributing to GlobeTrotter!

We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, UI/UX polish, and code enhancements.

Please read through this guide before submitting your contribution.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Local Development Setup](#local-development-setup)
4. [Branch Naming and Commit Conventions](#branch-naming-and-commit-conventions)
5. [Pull Request Workflow](#pull-request-workflow)
6. [Design System and Code Style](#design-system-and-code-style)
7. [Reporting Bugs and Requesting Features](#reporting-bugs-and-requesting-features)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the maintainers.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/GlobeTrotter.git
   cd GlobeTrotter
   ```
3. **Set the upstream remote**:
   ```bash
   git remote add upstream https://github.com/manavshah-13/GlobeTrotter.git
   ```

---

## Local Development Setup

GlobeTrotter is organized as a monorepo with separate `client/` and `server/` packages.

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Google AI Studio Key**: for Gemini AI (`GEMINI_API_KEY`)
- **Supabase Account**: for PostgreSQL database (optional for client-only changes)

### 1. Server Setup (Backend)
```bash
cd server
npm install

# Copy sample environment variables
cp .env.example .env
```
Fill in `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the backend development server:
```bash
npm run dev
# Server starts at http://localhost:5000
```

### 2. Client Setup (Frontend)
```bash
cd ../client
npm install

# Copy sample environment variables
cp .env.example .env
```
Ensure `client/.env` points to the local backend:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend development server:
```bash
npm run dev
# App starts at http://localhost:3000 (or http://localhost:5173)
```

---

## Branch Naming and Commit Conventions

### Branch Naming
Use descriptive branch names with appropriate prefixes:
- `feat/add-currency-converter`
- `fix/route-waypoint-disconnect`
- `docs/update-readme-badges`
- `style/ticket-perforation-contrast`
- `refactor/api-service-layer`

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect code logic (formatting, spacing)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `chore`: Build process, dependencies, or auxiliary tool updates

Example:
```bash
git commit -m "feat(transit): add Vande Bharat seat class availability filters"
```

---

## Pull Request Workflow

1. **Keep PRs focused**: Each pull request should address a single concern or feature.
2. **Sync with upstream** before pushing:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
3. **Verify build and lint**:
   ```bash
   cd client && npm run build
   cd ../server && npm run build
   ```
4. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a Pull Request**: Fill out the provided [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) completely, including before/after screenshots for any UI updates.

---

## Design System and Code Style

GlobeTrotter features a **Tactile Retro-Modern Design System**:
- **Color Palette**:
  - Paper: `#F7F4EC` / `#FCF9F1`
  - Ink Navy: `#1B2A4A`
  - Horizon Amber: `#E8873A`
  - Route Teal: `#2F8F82`
  - Alert Coral: `#E85D4E`
  - Slate: `#6B7280`
- **Typography Hierarchy**:
  - Headings: `Space Grotesk`
  - Body: `Inter`
  - Data / Timelines / Boarding Passes: `IBM Plex Mono`
- **Visual Signatures**:
  - Perforated ticket borders (`.perforated-edge`, `.ticket-stub`)
  - Dashed route connectors (`.route-dash`, `.route-dashed-line`)
  - Tactile offset drop shadows (`shadow-[4px_4px_0px_0px_#1B2A4A]`)

Please maintain this aesthetic consistency when building or altering frontend components.

---

## Reporting Bugs and Requesting Features

- **Found a bug?** Open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Have an idea?** Submit a [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- **Need help?** Start a discussion in the GitHub Discussions tab.

Thank you for helping make GlobeTrotter the best travel logistics tool in open source!
