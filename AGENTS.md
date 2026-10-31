# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making
changes. Keep it accurate: if you change architecture, commands, or conventions,
update this file in the same PR.

## 1. Project overview

**Twiso** is a movie & series tracker web app (PWA) that lets users:

- search TMDB for movies, shows, and people,
- keep a watchlist and a watched list,
- mark individual episodes/seasons watched,
- see ratings, cast, studios, releases, and related titles,
- install the app on mobile/desktop and use it offline-first.

Production: <https://twiso.pages.dev>

The app is a client-rendered React SPA. **User library data is cached locally in
IndexedDB (Dexie) and synced with a Supabase backend.** Metadata and images come
from TMDB.

## 2. Tech stack

| Area | Choice |
| --- | --- |
| Runtime | Node.js **>= 24** (CI uses 24) |
| UI | React **19**, TypeScript 5.7, `react-router` **7** (not `react-router-dom`) |
| Build | Vite **8**, `@vitejs/plugin-react`, `tsconfigPaths` |
| Styling | Tailwind CSS **4** via `@tailwindcss/vite`, CSS-first config in `src/index.css` |
| State | Redux Toolkit 2 + `react-redux` 9 |
| Local DB | Dexie 4 (IndexedDB) + `dexie-react-hooks` |
| Search | Fuse.js (local fuzzy search) |
| Backend | Supabase (auth + edge functions) |
| Metadata/images | TMDB API (direct + proxied through Supabase functions) |
| Animation | `motion` (`motion/react`) |
| PWA | `vite-plugin-pwa` (prompt update) |
| Errors | Sentry (`@sentry/react`) |
| Tests | Vitest 4 **browser mode** + Playwright (Chromium) + Testing Library |
| Release | semantic-release (atom preset + emoji rules) |
| Hosting | Cloudflare Pages + one Pages Function |
| Analytics | Simple Analytics (script in `index.html`) |

## 3. Quick start

```bash
npm ci                     # install (Node 24+)
cp .env.example .env       # fill in values; .env is gitignored
npm start                  # Vite dev server on http://localhost:3000
```

### Commands

| Command | What it does |
| --- | --- |
| `npm start` | Dev server (port 3000). There is no `dev` script. |
| `npm run tsc` | Type-check only (`tsc`, `noEmit`). |
| `npm run build` | `tsc` + `vite build` → `build/`. Required to pass CI. |
| `npm test` | Vitest once in headless Chromium (`vitest run`). |
| `npx vitest` | Vitest watch mode (not scripted). |
| `npm run analyze` | Build + `source-map-explorer` over `build/assets/*.js`. |

There is **no lint script and no ESLint/Prettier script** in `package.json`.
Format with `npx prettier --write <files>` (Prettier 2 config below).

Browser tests need Chromium for Playwright:

```bash
npx playwright install chromium
```

## 4. Environment variables

Vite is configured with `vite-plugin-environment` (`EnvironmentPlugin('all')`),
so variables are read as **`process.env.VITE_*`**, not `import.meta.env.*`.

| Variable | Purpose |
| --- | --- |
| `VITE_TMDB_API_KEY` | TMDB API key. Also used by the Cloudflare Pages Function. |
| `VITE_SUPABASE_DB` | Supabase project ref; URL becomes `https://<ref>.supabase.co`. Also used in the auth storage key. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key. |
| `VITE_SUPABASE_FUNCTIONS_URL` | Optional. Points `supabase.functions.invoke` at a locally running backend (e.g. `http://127.0.0.1:8000`). Empty = deployed functions. |
| `SENTRY_DSN` | Sentry DSN. |

- `.env` is gitignored and must never be committed. `.env.example` documents the
  required keys.
- The build succeeds with empty values, but auth/data calls fail at runtime.
- `src/test/setup.ts` stubs `process.env` for tests.

## 5. Repository map

```
.
├── src/
│   ├── index.tsx            # entry: Sentry init, Redux Provider, StrictMode
│   ├── main.tsx             # Providers wrapper + App
│   ├── App.tsx              # Routes, lazy pages, global overlays
│   ├── index.css            # Tailwind v4 theme + light/dark CSS variables
│   ├── components/          # Reusable UI (Icon, Image, Layout, WatchButton, ...)
│   │   ├── Navigation/      # Bottom (mobile) / top (desktop) navbar
│   │   ├── Seasons/         # Show/season/episode UI
│   │   ├── Pagination/
│   │   └── Alert/, ProgressBar/
│   ├── contexts/            # Auth, Theme, Alert, Modal (React context)
│   ├── hooks/               # useTranslate, useImage, usePageBackground, ...
│   ├── lib/react-image/     # Vendored react-image fork (Img, useImage)
│   ├── models/              # Domain types (Movie, Show, Person, Api, Translation, ...)
│   ├── pages/               # Route components
│   │   ├── movies/          # Movies, MoviesWatched, MoviesWatchlist
│   │   ├── shows/           # Shows, ShowsWatched, ShowsWatchlist
│   │   ├── search/          # Search, SearchFilters
│   │   ├── MovieDetail.tsx
│   │   ├── ShowDetail.tsx
│   │   ├── Person.tsx
│   │   ├── Profile.tsx
│   │   ├── VerifyMagicLink.tsx
│   │   └── Error.tsx
│   ├── state/
│   │   ├── store.ts         # configureStore + typed hooks
│   │   ├── dbMiddleware.ts  # Persists fulfilled mutations into Dexie
│   │   ├── firstLoadAction.ts # Startup sync + cache hydration
│   │   └── slices/          # root, config, movies, shows
│   ├── test/setup.ts        # Vitest setup + global mocks
│   └── utils/               # api, supabase, db, routes, cache, helpers
├── functions/[[catchAll]].ts # Cloudflare Pages Function (OG meta tags)
├── public/                  # manifest, icons, splashscreens, _routes.json
├── .github/workflows/       # ci.yml (test/release), cd.yml (Sentry release)
├── PLAN.md                  # Original layout rearchitecture proposal
├── implementation.md        # As-built shell/layout notes
└── README.md, CHANGELOG.md
```

Generated/ignored directories: `build/`, `node_modules/`, `.wrangler/`,
`test-results/`, `.vitest-attachments/`, `stats.html`, `/mockups`.
`PLAN.md`, `implementation.md`, and the root `image*.png` screenshots are
currently **untracked working files** — do not delete or overwrite them unless
asked.

## 6. Routing

Routes are declared in `src/App.tsx`; path constants live in
`src/utils/routes.ts`. Add a route to both when introducing a page.

| Path | Page | Notes |
| --- | --- | --- |
| `/` | redirect | Logged in → `/movies`, else → `/search`. |
| `/movies` | `Movies` | Protected. `?mode=watchlist\|watched&page=N`. |
| `/shows` | `Shows` | Protected. `?mode=watchlist\|watched&page=N`. |
| `/search` | `Search` | Public. `?query=&remote=true\|false&types=movie,show,person`. |
| `/movie/:id` | `MovieDetail` | Public. Served by the Pages Function for OG tags. |
| `/show/:id` | `ShowDetail` | Public. Served by the Pages Function for OG tags. |
| `/person/:id` | `Person` | Public. Served by the Pages Function for OG tags. |
| `/profile` | `Profile` | Theme, language, stats, login/logout, dev tools. |
| `/auth/confirm` | `VerifyMagicLink` | Supabase magic-link/OTP confirmation. |

- Pages are lazy-loaded via `React.lazy` with a Suspense spinner.
- `ProtectedRoute` redirects unauthenticated users to `/`.
- Pages set the document title with a plain `<title>` element inside the
  component (React 19 hoists it); there is no helmet library.
- `ROUTES.calendar` exists but has no route/page.

## 7. Data architecture (important)

Twiso is **offline-first**. Understanding this flow prevents most bugs.

### 7.1 Local database (Dexie)

`src/utils/db.ts` defines DB `twisoDB4`, version 4, with four tables:

| Table constant | Table name | Contents |
| --- | --- | --- |
| `USER_MOVIES_TABLE` | `user-movies` | Per-user movie status rows (`movie_tmdb`, `status`, `created_at`). |
| `USER_SHOWS_TABLE` | `user-shows` | Per-user show status rows (`show_tmdb`, `status`, `created_at`, `hidden`, `episodes[]`). |
| `DETAIL_MOVIES_TABLE` | `detail-movies` | Full cached `Movie` + optional `translation`/`contentLanguage`. |
| `DETAIL_SHOWS_TABLE` | `detail-shows` | Full cached `Show` + `all_seasons`, `translation`, `contentLanguage`, `updatedAt`. |

- `dbReady` is the open promise; startup awaits it.
- Indexes are `ids.tmdb` and `genres` for detail tables, and status/date fields
  for user tables. **Changing the schema requires bumping the Dexie version.**
- `EntityTable` typings cannot express nested keys such as `ids.tmdb`, so casts
  and `// @ts-expect-error limitations on Dexie EntityTable` are intentional.
- Backend payloads sometimes use **string** TMDB IDs. Normalize with
  `Number(...)` before writing to Dexie (see `firstLoadAction.ts` and
  `dbMiddleware.ts`).

### 7.2 Startup sync (`firstLoadAction.ts`)

On login, `App.tsx` dispatches `firstLoadThunk`:

1. Load `activities` cursors from `localStorage`.
2. Call `syncActivities()` on the backend.
3. Pull only changed movie/show rows into the user tables
   (`date_from` cursors; deletion cursors remove stale rows).
4. Dispatch `fillDetail` for user items missing cached details.
5. Refresh stale show details: TTL **7 days**, max **20** per load, skipping
   `ended`/`canceled` shows.
6. Save the new activity cursors back to `localStorage`.

`firstLoad()` is memoized (a single in-flight promise). Show mutations call it
again after the API succeeds, so episode/watchlist changes resync local state.

### 7.3 Read path

Components read local data **reactively** with `useLiveQuery` from
`dexie-react-hooks` — not by copying the DB into Redux. Examples:
`Image.tsx`, `Movies.tsx`, `MovieDetail.tsx`, `ShowsWatchlist.tsx`,
`useIsWatch.tsx`, `useFilter.ts`.

### 7.4 Write path

All library mutations go through async thunks:

- `src/state/slices/movies/thunks.ts`: add/remove watched, add/remove
  watchlist, `fillDetail`.
- `src/state/slices/shows/thunks.ts`: add/remove watchlist, add/remove watched
  episodes, hide show, `fillDetail`.

`src/state/dbMiddleware.ts` listens for fulfilled thunk actions and writes the
result to Dexie. **If you add or change a persisted mutation, update this
middleware too**, otherwise the UI will not reflect the change locally.

Redux state itself only holds transient/UI data: global-search open flag,
loading/pending request IDs, image config, and language. `serializableCheck` and
`immutableCheck` are disabled in `store.ts`.

### 7.5 Caching

- Detail cache TTL and stale-refresh caps are in `firstLoadAction.ts`.
- Image **URLs** are cached in `localStorage` under
  `${id}-${type}-${language}` with a `__size__` placeholder; see
  `src/utils/cache.ts` and `src/hooks/useImage.tsx`.
- Image **config** (base URL + available sizes) is fetched from TMDB at startup
  by `loadImgConfig` and kept in Redux (`state.config.img`).
- `src/utils/cache.ts` exposes dev helpers to clear user data, details, image
  URLs, and activity cursors. They are used by the hidden dev tools in Profile.

## 8. Backend / API layer

`src/utils/api.ts` is the single API entry point.

- **Catalog/search/metadata** calls go through `getCatalog<T>(path)`, which
  invokes Supabase Edge Function `api${path}` with `GET`
  (e.g. `api/movies/123`, `api/search?query=...`, `api/shows/123/seasons`).
- **TMDB direct** calls are used only for the image configuration and
  per-title image lists. These use an axios client rate-limited to
  **42 requests / 10 s**.
- Mutations use `POST`/`DELETE`/`PUT` on `api/movies/:id`,
  `api/shows/:id`, `api/shows/:id/episodes`, `api/shows/:id/hide`.
- The Supabase **backend code is not in this repository**. This repo only
  contains the client. Catalog responses are expected in the shapes defined in
  `src/models/`.
- `VITE_SUPABASE_FUNCTIONS_URL` rewrites `/functions/v1/...` requests to a local
  backend while developing.
- Supabase client setup (including that rewrite) is in `src/utils/supabase.ts`.

The only server-side code here is `functions/[[catchAll]].ts`, a **Cloudflare
Pages Function** for `/movie/*`, `/show/*`, `/person/*` (see
`public/_routes.json`). It fetches `index.html`, injects Open Graph meta tags,
and returns HTML. It is unrelated to Supabase Edge Functions.

## 9. Auth

`src/contexts/AuthContext.tsx`:

- Initializes from `localStorage['sb-<VITE_SUPABASE_DB>-auth-token']` for a fast
  first paint, then validates with `supabase.auth.getSession()` and subscribes
  to `onAuthStateChange`.
- Exposes `{ session, logout }`. Most components gate UI with `!!session`.
- `logout()` clears local activity cursors and user tables and signs out with
  `scope: 'local'`.
- Login UI is `src/components/LoginButton.tsx` (magic link / OTP). The
  `/auth/confirm` route verifies the link.

## 10. State management conventions

Store shape (`src/state/store.ts`): `root`, `config`, `movies`, `shows`.

- Use the typed hooks: `useAppDispatch()` and `useAppSelector()`.
- Thunks live next to their slice in `thunks.ts`; slices track pending IDs so
  buttons can show spinners and avoid double-submits.
- Selectors are inline (`useAppSelector`) in this codebase; there is no
  reselect layer.
- Add shared/domain types under `src/models/`, not inline in components, when
  they cross file boundaries.
- Prefer existing thunk/API helpers over calling `supabase` or `axios` directly
  from components.

## 11. UI, layout, and styling

### Layout

`src/components/Layout.tsx` defines the fixed app shell:

- `Layout.Root` → `#app-shell`, a `100dvh` CSS grid. Mobile rows are
  `safe-top → view → navbar` (the mobile navbar carries the bottom safe-area
  inset); at the **`lg` breakpoint (1024px)** they are
  `safe-top → navbar → view → safe-bottom`.
- `Layout.Navbar` is a grid row, **not** `position: fixed`/`sticky`. It holds
  `ProgressBar` and `NavigationTabs`, and sits at the bottom on mobile and the
  top on desktop.
- `Layout.View` → `#view`, the relative wrapper for `#page-header` and
  `#content`. `#page-header` is a non-scrolling toolbar row; `#content` is the
  **only vertical scroll container**.
- `Layout.PageHeader` portals page toolbars into `#page-header`. Use it for
  controls that must stay put while the page scrolls (`LibraryTabs`, search
  input/filters, Profile selectors).
- `Layout.Content` → `#content`; it owns `useScrollRestoration`. Horizontal
  lists pass their own ref and `'horizontal'`.
- `Layout.Overlay` is absolutely positioned over the view. It is top-anchored
  and grows with its content up to the view height (`max-h-full`). The
  long-press global search (`GlobalFilter`) uses it, so it covers the
  header/content but not the navbar or safe-area strips; long result lists
  scroll inside the overlay.
- `html`, `body`, `#root`, and `#app-shell` never scroll. Do not reintroduce
  `window.scrollTo`, `max-w-dvw`, or page-level `sticky`/`fixed` chrome.
- Safe areas: the shell owns the top strip (`SafeAreaTop`). On mobile the
  bottom inset is folded into `#navbar` as `padding-bottom`, so the navbar
  background bleeds to the screen edge; `#safe-bottom` is desktop-only. Lateral
  insets are applied once through the `safe-x` utility on the navbar, page
  header, and `#content`. Keep `viewport-fit=cover`; do not add page-level
  `env(safe-area-inset-*)` padding or margins.
- Status bar: `apple-mobile-web-app-status-bar-style` is intentionally absent
  (it made iOS draw a blur/scrim over the top). iOS 26/27 tints the status bar
  by sampling a solid `fixed`/`sticky` element at the top, so standalone iOS
  (`.ios-standalone #safe-top`) keeps an in-flow sticky strip of at least 11px
  painted with `--page-bg`. `ThemeProvider` also syncs
  `meta[name="theme-color"]` (`#ffffff` light, `#000000` dark) for browsers
  that still honor it.
- Page background: `usePageBackground()` sets `--page-bg` on `#app-shell` for
  detail/person status colors. Mappings live in
  `src/utils/pageBackground.ts`.
- The global collection search opens on **long-press** of the search nav icon
  (`Longpress.tsx`, 400 ms, logged-in only).

`PLAN.md` is the original layout proposal; the current implementation is
described above. Keep this section in sync when changing the shell.

### Tailwind / theming

- Tailwind **v4**, no `tailwind.config.js`. Theme tokens are declared in
  `src/index.css` inside `@theme`.
- `--color-*: initial` and `--font-*: initial` reset Tailwind's defaults. Only
  the mapped tokens are available: `white`, `black`, `gray-100..900`,
  `green-100..900`, `blue-100..900`, `purple-100..900`. Add new tokens in
  `@theme` instead of relying on arbitrary Tailwind palette colors.
- Light/dark themes are CSS-variable swaps on `.theme-light` / `.theme-dark`.
  `ThemeProvider` adds the class to `<html>`; unset means follow
  `prefers-color-scheme`. Do **not** use `dark:` variants — they are not used in
  this project. Use semantic tokens (`bg-gray-200`, `text-gray-700`, etc.).
- Fonts: **Nunito** (default `font-sans`), **Raleway** via
  `.font-family-text`.
- Colocated plain CSS exists for a few components (`Alert.css`,
  `collapsable.css`, `ProgressBar.css`); CSS modules are not used.
- Use `motion/react` for animations; shared-layout animations use `layoutId`
  (e.g. `Underline.tsx`, `NavigationTabs.tsx`).

### Icons

`src/components/Icon.tsx` maps names to SVGs in `src/assets/`. SVG imports are
URL strings used as `<img src>`, not React components. To add an icon, drop the
SVG in `src/assets/` and add it to `iconsMap`. Icons are inverted automatically
in dark mode.

## 12. Internationalization

- `src/hooks/useTranslate.ts` contains inline dictionaries for `en` and `es`
  and returns `{ t, language }`. There is no i18n library.
- Add every new string to **both** dictionaries. `{}` placeholders are replaced
  in order: `t('episode_num', 3)`.
- Current language lives in `state.config.language`, persisted in
  `localStorage['language']`; default is **`es`**.
- When `language === 'es'`, display `item.translation?.title/overview` with a
  fallback to the base TMDB fields. API calls receive the language too.
- Some older strings are hardcoded Spanish (e.g. the `GlobalFilter`
  placeholder). Prefer `t()` for new work.

## 13. Testing

- Config: `vitest.config.ts`. Tests run in a real **headless Chromium** browser
  (Vitest browser mode + `@vitest/browser-playwright`), with `globals: true`.
- Test files: `src/**/*.test.{ts,tsx}`, colocated with source.
- Setup: `src/test/setup.ts` mocks `virtual:pwa-register/react` and
  `src/lib/react-image`, loads `@testing-library/jest-dom`, and stubs
  `process.env`.
- `vitest.config.ts` includes `@tailwindcss/vite` so utility classes resolve in
  browser tests. Layout tests import `src/index.css` to assert real geometry.
- `src/vitest-browser.d.ts` bridges `vitest/browser` for the repo’s
  `moduleResolution: "node"`. Use `page.viewport(width, height)` from
  `vitest/browser` to test responsive shells.
- `src/App.tsx` has smoke tests in `src/App.test.tsx`. Layout regressions are
  covered by `Layout.test.tsx`, `LibraryTabs.test.tsx`,
  `GlobalFilter.test.tsx`, `Search.test.tsx`, `Profile.test.tsx`, and
  `usePageBackground.test.tsx`; pure logic has focused tests
  (`showAvailability.test.ts`, `showRuntime.test.ts`,
  `pageBackground.test.ts`).
- Write focused tests for pure utilities and reducers. UI tests use
  `@testing-library/react`; they execute in Chromium, so browser APIs are
  available.
- CI runs `npm run build` **before** `npm test`. Both must pass.

## 14. Build, deploy, and release

- `npm run build` → static output in `build/`, with sourcemaps enabled.
- Hosted on **Cloudflare Pages**. `public/_routes.json` sends only
  `/movie/*`, `/show/*`, `/person/*` through the Pages Function; everything else
  is static.
- **Deployment is driven by the Cloudflare Pages Git integration.** There is no
  `wrangler.toml` or deploy workflow in this repo, so enabling previews is a
  dashboard setting, not a code change:
  - Production branch is `master` → `https://twiso.pages.dev`.
  - In **Workers & Pages → twiso → Settings → Builds & deployments → Preview
    branch control**, choose **All non-production branches** (or custom
    includes such as `agents/*`, `dependabot/*`). Do not change the production
    branch.
  - Preview URLs are `<branch>.twiso.pages.dev` (moving alias) and
    `<hash>.twiso.pages.dev` (immutable). Cloudflare posts the URL on the PR.
  - Cloudflare only builds PRs whose head branch lives in this repository; PRs
    from forks do not get a preview.
  - Define the same `VITE_TMDB_API_KEY`, `VITE_SUPABASE_DB`,
    `VITE_SUPABASE_ANON_KEY`, optional `VITE_SUPABASE_FUNCTIONS_URL`, and
    `SENTRY_DSN` under the **Preview** environment. Preview variables are not
    inherited from Production.
  - Add `https://*.twiso.pages.dev/**` to **Supabase → Authentication → URL
    Configuration → Redirect URLs**; magic links use
    `emailRedirectTo: window.location.href`, so preview domains must be
    allow-listed.
  - Preview deployments are public unless a Cloudflare Access policy is enabled
    and are `X-Robots-Tag: noindex` by default.
- PWA is generated by `vite-plugin-pwa` with `registerType: 'prompt'`.
  `NewVersion.tsx` shows the update banner. Manifest/icons/splashscreens are in
  `public/`.
- Sentry is initialized in `src/index.tsx` with
  `release: twiso@${packageInfo.version}` and `SENTRY_DSN`.
- CI (`.github/workflows/ci.yml`):
  - On PRs and pushes to `master`: install, build, test (Playwright container),
    upload test artifacts.
  - On `master` after tests: semantic-release.
- CD (`.github/workflows/cd.yml`): on a published release, creates the Sentry
  release and uploads `build/assets` sourcemaps.
- The Vite visualizer writes `stats.html` (gitignored) on build.

### Commit messages / versioning (required)

Releases are driven by **semantic-release** using `conventional-changelog-atom`
and emoji release rules in `release.config.cjs`. Commit subjects must start with
an emoji shortcode:

| Prefix | Release |
| --- | --- |
| `:boom:` | major |
| `:sparkles:` | minor |
| `:bug:` | patch |
| `:rocket:` | patch |
| `:ambulance:` | patch |
| `:art:` | patch |

Examples: `:bug: fix double scroll`, `:sparkles: add hide-finished filter`,
`:art: animate poster borders`.

- **Do not** manually edit `package.json` version, `CHANGELOG.md`, tags, or
  releases; semantic-release owns them.
- Release branch is `master`.
- Dependabot-style `:arrow_up:` commits exist historically but are not in the
  release rules; use one of the emoji above for user-facing changes.

## 15. Code style

- Prettier 2 (`/.prettierrc.json`): `printWidth: 80`, `singleQuote: true`,
  `semi: true`, `tabWidth: 2`.
- TypeScript is `strict: true`, but `noImplicitAny: false`; `noEmit: true`.
- `tsconfig.json` includes `src` and `functions`, excludes `src/test`.
- Use **relative imports** (`../utils/api`); no path aliases are configured
  despite `tsconfigPaths` being enabled.
- Naming: components `PascalCase.tsx`; hooks `useX.ts(x)`; utilities and models
  mostly `camelCase`/`PascalCase` files in `utils`/`models`.
- Components are usually `React.FC<Props>` with explicit prop interfaces and
  default values in destructuring.
- React 19 conventions are in use: context providers are rendered as
  `<MyContext value={...}>` (no `.Provider`), and pages use `<title>`.
- Avoid introducing new global CSS when Tailwind utilities or the existing
  `@theme` tokens suffice.
- Keep comments rare and useful; explain non-obvious workarounds only.

## 16. Common task recipes

**Add a page/route**
1. Create `src/pages/MyPage.tsx` (`export default function MyPage()`).
2. Add the path to `src/utils/routes.ts` if it needs to be shared/navigated.
3. Register it in `src/App.tsx` (lazy import + `<Route>`); wrap with
   `ProtectedRoute` if it requires auth.
4. Add nav entry in `NavigationTabs.tsx` only if it is a primary destination.
5. Add translations and a `<title>`.

**Add an API call**
1. Add/extend types in `src/models/`.
2. Add the function to `src/utils/api.ts` (`getCatalog` for reads,
   `supabase.functions.invoke` for mutations).
3. Add a thunk in the appropriate slice if the result changes user data or
   shared state.
4. Persist in `dbMiddleware.ts` if it must survive reloads locally.
5. Surface loading/error state using the existing pending arrays / `Error` page.

**Add a library mutation**
1. API helper in `src/utils/api.ts`.
2. Thunk in `src/state/slices/{movies,shows}/thunks.ts`.
3. Pending/rejected/fulfilled handling in the slice, and Dexie persistence in
   `dbMiddleware.ts`.
4. For shows, call `firstLoad()` after success when episode/status aggregation
   changes (follow existing thunks).
5. Update UI via `useLiveQuery` rather than duplicating DB state.

**Add a translated string**
1. Add the key to both `en` and `es` in `src/hooks/useTranslate.ts`.
2. Use `const { t } = useTranslate()`.

**Add an icon**
1. Add the SVG to `src/assets/`.
2. Import and map it in `Icon.tsx`; use `<Icon name="..." />`.

## 17. Gotchas and pitfalls

- **`process.env`, not `import.meta.env`** for app env vars.
- **TMDB/backend IDs**: normalize to `Number` before Dexie writes; backend may
  return strings.
- **Dexie reads are reactive**; avoid redundant local copies of DB data.
- **Mutations must update `dbMiddleware`** or local state goes stale.
- **`firstLoad()` is the sync entry point**; do not bypass it with ad-hoc
  backend fetches for library data.
- **Never commit `.env`** or hardcode keys. The TMDB key is also expected by the
  Pages Function.
- **React Router v7**: import from `react-router`, not `react-router-dom`.
- **Tailwind v4 has no JS config**; theme changes belong in `src/index.css`.
- The default palette is reset — using an unmapped color utility silently does
  nothing.
- **Dark mode is CSS-variable based**; use semantic tokens, not `dark:`.
- **Only `#content` scrolls.** The viewport is locked; use
  `content.scrollTop`/scroll restoration, not `window.scrollTo`.
- **Page toolbars belong in `Layout.PageHeader`.** Rendering them inside
  `Layout.Content` makes them scroll away.
- **Lateral safe areas are centralized** in the `safe-x` utility. Do not add
  page-level `env(safe-area-inset-*)` padding or negative margins to escape it.
- **Page backgrounds go through `usePageBackground`**, not a wrapper
  `bg-*` class, so the shell strips and header stay in sync.
- **The global search overlay must stay inside `Layout.View`** so it covers the
  header/content but leaves the navbar reachable.
- Keep `env(safe-area-inset-*)` handling and the PWA viewport meta intact.
- Do not edit or commit generated artifacts: `build/`, `stats.html`,
  `test-results/`, `.vitest-attachments/`, `.wrangler/`.
- `.vscode/settings.json` references a `supabase/functions` Deno workspace that
  does not exist in this repo; that config is stale. The only function here is
  the Cloudflare Pages Function.
- `ShowsWatchlist.tsx` sorts by `added_to_watchlist_at`, which is not declared
  in the Dexie types in `db.ts`. If you touch that query, verify the actual
  backend payload/schema first rather than assuming the typing is complete.

## 18. Definition of done

Before handing off a change:

1. `npm run tsc` passes (or `npm run build`).
2. `npm test` passes (add/update tests for logic changes).
3. `npm run build` succeeds.
4. Manually verify (when UI-related): mobile + desktop layouts, light + dark,
   `en` + `es`, safe areas, and logged-in/logged-out states.
5. New user-facing strings exist in both languages.
6. New persisted mutations are handled by `dbMiddleware`.
7. The commit message starts with an allowed emoji shortcode.
8. Update this `AGENTS.md` if you changed commands, architecture, or
   conventions.
