# Syd Social

A social events app: browse and create events, RSVP, chat on event pages, and follow other users' profiles. Built with React, TypeScript, Redux Toolkit, and Firebase (Auth, Firestore, Storage), bundled with Vite.

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

Firebase Hosting, deployed via GitHub Actions:

- `.github/workflows/ci.yml` — runs build, lint, and test on every PR and on pushes to `main`/`test`.
- `.github/workflows/firebase-hosting-merge.yml` — deploys to the live Firebase Hosting channel on push to `main`.
- `.github/workflows/firebase-hosting-pull-request.yml` — deploys a preview channel for each PR.

Hosting config lives in `firebase.json` (serves `dist/` as a single-page app). Firestore/Storage security rules are managed directly in the Firebase Console and are not yet version-controlled in this repo (tracked as a roadmap item in `ROADMAP.md`).

## Project structure

```
src/
  app/            # cross-cutting: store, router, layout, Firestore hooks, shared types
  features/       # feature slices: auth, events, profiles (each with its own Redux slice)
```

## Roadmap

Ongoing enterprise-upgrade work (security, testing, CI/CD, performance, etc.) is tracked in [`ROADMAP.md`](ROADMAP.md).
