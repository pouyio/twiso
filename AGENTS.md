# AGENTS.md

## Commands

- `npm run start`: Dev server (Vite, port 3000).
- `npm run build`: Production build (runs `tsc` then `vite build`).
- `npm run test`: Run all tests (including Vitest browser mode via Playwright).
- `npm run analyze`: Build and analyze bundle size using `source-map-explorer`.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit.
- **Persistence:** IndexedDB (via Dexie) for local storage and offline capabilities (`src/state/dbMiddleware.ts`).
- **Backend/Auth:** Supabase.
- **APIs:**
  - TMDB API (direct calls in `src/utils/api.ts`).
  - Supabase Edge Functions (many business logic endpoints are implemented as functions, e.g., `api/movies`, `api/shows`).
- **Testing:** Vitest + Playwright for browser-based testing.
- **PWA:** Progressive Web App capabilities via `vite-plugin-pwa`.

## Architecture & Conventions

- **Environment Variables:** Use `process.env.VITE_...` (enabled via `vite-plugin-environment`).
- **State Management:** Redux slices are located in `src/state/slices/`.
- **Data Models:** Type definitions are in `src/models/`.
- **API Integration:**
  - Direct TMDB calls use `axios`.
  - Business logic/data persistence often goes through Supabase Edge Functions using `supabase.functions.invoke()`.
- **Directory Structure:**
  - `src/components/`: UI components.
  - `src/pages/`: Route components.
  - `src/utils/`: Utilities, API clients, and Supabase/Dexie integrations.
  - `functions/`: Supabase Edge Functions.

## Important Notes

- Changes to data structure or business logic might require updates to both the frontend Redux slices/models and the Supabase Edge Functions.
- When running tests, be aware that Vitest is configured for browser execution.
- Build output is placed in the `build/` directory.
