# Syd Social

A social events app: browse and create events, RSVP, chat on event pages, and follow other users' profiles. Built with React, TypeScript, Redux Toolkit, and Firebase (Auth, Firestore, Storage), bundled with Vite, deployed to GitHub Pages via GitHub Actions.

## Getting started

Requires [pnpm](https://pnpm.io/) and Node 20+.

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:3000`.

## Environment variables

Create a `.env.local` (gitignored) or rely on the committed `.env.production` for the Firebase web config:

```
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
```

The rest of the Firebase config (project ID, auth domain, etc.) is hardcoded in [`src/app/config/firebase.ts`](src/app/config/firebase.ts) since it isn't sensitive — it's the API key that's environment-specific.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check (`tsc`) and build for production into `dist/` |
| `pnpm test` | Run the Vitest test suite once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build locally |

## Testing

Tests use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/react). Firebase modules (`firebase/auth`, `src/app/config/firebase`, `src/app/hooks/firestore/useFirestore`) are mocked in component tests rather than hitting real Firebase — see `src/features/auth/*.test.tsx` for the pattern, and `src/test/renderWithProviders.tsx` for the shared Redux + Router test wrapper.

## Deployment

Static hosting on **GitHub Pages**, built and deployed by **GitHub Actions**. Firebase is used only as the app's backend (Auth, Firestore, Storage) — there is no Firebase Hosting/CLI involved in shipping the app anymore.

- `.github/workflows/ci.yml` — runs build, lint, and test on every PR and on pushes to `main`/`test`.
- `.github/workflows/deploy.yml` — on push to `main`, builds with `GITHUB_PAGES=true` (so Vite emits asset URLs under the `/SydSocialRedux/` project-page base) and publishes `dist/` to GitHub Pages via `actions/deploy-pages`.

Because GitHub Pages is a static file host with no server-side rewrites, a hard refresh or direct link on a client-side route (e.g. `/events/123`) would normally 404. `public/404.html` + a small inline script in `index.html` implement the standard [spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect trick to work around that — see the comments in those files.

One-time repo setup (already done for this repo, noted here for forks): in **Settings → Pages**, set the source to "GitHub Actions"; the `VITE_FIREBASE_API_KEY` secret must exist under **Settings → Secrets and variables → Actions**.

Firestore/Storage security rules are managed directly in the Firebase Console and are not yet version-controlled in this repo (tracked as a roadmap item in `ROADMAP.md`).

## System design

```
┌──────────────────────────────────────────────────────────────────────┐
│  Browser (SPA)                                                        │
│                                                                        │
│   React (UI) ── react-router-dom (routing) ── Redux Toolkit (state)   │
│        │                                             │                │
│        │                                   feature slices dispatch    │
│        │                                   async thunks/actions       │
│        ▼                                             ▼                │
│   Semantic UI React                       src/app/actions/            │
│   (components)                            firestoreActions.ts         │
│                                                       │                │
└───────────────────────────────────────────────────────┼───────────────┘
                                                          │ Firebase JS SDK
                                                          ▼
                              ┌───────────────────────────────────────┐
                              │  Firebase (backend-as-a-service)       │
                              │  - Auth        → email/password,       │
                              │                  Google/Facebook       │
                              │  - Firestore   → events, profiles,     │
                              │                  chat messages         │
                              │  - Storage     → profile/event photos  │
                              │  - App Check   → reCAPTCHA v3 abuse    │
                              │                  protection            │
                              └───────────────────────────────────────┘
```

- **Frontend**: React + TypeScript, bundled by Vite. Routing is declared centrally in [`src/app/router/Routes.tsx`](src/app/router/Routes.tsx); `RequireAuth` gates event-management, profile, and account routes behind a signed-in user.
- **State**: Redux Toolkit slices per feature (`authSlice`, `eventSlice`, `profileSlice`), combined in [`src/app/store`](src/app/store). Components read via `useSelector`/typed hooks rather than talking to Firebase directly.
- **Data access**: Firestore reads go through the `useFirestore` hook ([`src/app/hooks/firestore`](src/app/hooks/firestore)), which subscribes to a query and dispatches results into the relevant slice; writes go through thunks in [`src/app/actions/firestoreActions.ts`](src/app/actions/firestoreActions.ts). This keeps components decoupled from the Firebase SDK — see the Testing section for why that matters.
- **Backend**: Firebase is used as a hosted backend, not a server we run — Auth for sign-in, Firestore as the primary document store, Storage for uploaded images, App Check to gate abuse. Config/keys live in [`src/app/config/firebase.ts`](src/app/config/firebase.ts).
- **Build/deploy**: Vite builds a static bundle (code-split by route and by vendor chunk — see `vite.config.ts`); GitHub Actions ships that bundle to GitHub Pages. No backend server to deploy or scale — the "backend" is entirely Firebase's managed infrastructure.

## Project structure

```
src/
  app/            # cross-cutting: store, router, layout, Firestore hooks, shared types
  features/       # feature slices: auth, events, profiles (each with its own Redux slice)
```

## Roadmap

Ongoing enterprise-upgrade work (security, testing, CI/CD, performance, etc.) is tracked in [`ROADMAP.md`](ROADMAP.md).
