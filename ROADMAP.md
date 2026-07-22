# Enterprise Upgrade Roadmap

This file drives the automated upgrade loop:

```
GitHub Repo → Claude Code → Enterprise Review → Generate ROADMAP.md → Task #1 →
Implement → Build + Test + Lint → Auto-Fix → Commit → Merge to test branch →
Task #2 → repeat until every task is Done
```

It is designed to be **copied into any repo** — the audit checklist and task-table format stay the same; only the "Repo Profile" and the actual task rows change per app.

---

## 0. Repo Profile (fill in once per app, during the Enterprise Review step)

| Key | Value |
|---|---|
| Stack | e.g. React + Vite + TypeScript, or .NET 8 + EF Core |
| Package manager | `pnpm` |
| Build command | `pnpm build` |
| Test command | `pnpm test` |
| Lint command | `pnpm lint` |
| Integration branch | `test` |
| Protected branch | `main` |
| Developer agent | `.claude/agents/developer.md` |
| Reviewer agent | `.claude/agents/reviewer.md` |

> If a step doesn't apply to this app (e.g. no backend, no `dotnet build`), delete the row instead of leaving a stub — the loop should only ever run commands that actually exist in the repo.

---

## 1. How the loop uses this file

1. Find the highest-priority row below with `Status: Not Started` (P0 before P1 before P2 before P3; top-to-bottom within a tier).
2. Spawn the **developer agent** to implement it on a short-lived branch off the integration branch.
3. Run Build + Test + Lint from the Repo Profile above. If any fail, the developer agent auto-fixes and re-runs, up to a bounded number of attempts.
4. Spawn the **reviewer agent** against the diff. It returns `APPROVE` or `REJECT` with reasons.
5. On `APPROVE`: commit, merge into the integration branch, flip this row's `Status` to `Done`, record the commit SHA.
6. On `REJECT` after the retry budget is exhausted: flip `Status` to `Blocked`, write the reviewer's reasons into the row's Notes column, and move on to the next task rather than looping forever on one item.
7. Repeat from step 1 until no `Not Started` rows remain.

Status values: `Not Started` · `In Progress` · `Blocked` · `Done`
Priority values: `P0` (correctness/security, do first) · `P1` (reliability/quality gates) · `P2` (performance/DX) · `P3` (nice-to-have/polish)

---

## 2. Enterprise Review — audit categories

Re-run this checklist per app to (re)generate the task table in section 3. Each category below is a prompt for what to look for, not a task itself.

- **Security** — secrets committed to the repo, dependency CVEs, authz/authn gaps, unvalidated input at trust boundaries, overly-permissive CORS/IAM.
- **Testing & quality gates** — is there a test framework at all; is `test` wired into CI; is there any coverage on critical paths (auth, payments, data writes).
- **CI/CD** — does every push/PR run build + lint + test; is the deploy step separate from the verify step; are branches protected.
- **Dependency health** — outdated majors, deprecated packages, unused dependencies.
- **Error handling & resilience** — unhandled promise rejections/exceptions, missing error boundaries, silent failures, retry/backoff on network calls.
- **Observability** — logging, error tracking (e.g. Sentry), basic metrics/alerts for production issues.
- **Performance** — bundle size, obvious N+1 queries, missing memoization/pagination on hot paths.
- **Accessibility** — semantic HTML, keyboard nav, color contrast, form labeling (frontend apps only).
- **Documentation** — is there a README that lets a new dev run the app in under 10 minutes; is architecture/decision context captured anywhere.
- **Code quality / architecture** — dead code, inconsistent patterns, missing type-safety, lint rules disabled without reason.

---

## 3. Tasks

| ID | Priority | Title | Category | Status | Acceptance Criteria | Notes |
|---|---|---|---|---|---|---|
| T-002 | P0 | Verify committed Firebase web API key is safely scoped | Security | Blocked | `.env.production` (tracked in git) contains a Firebase web API key. Confirm HTTP-referrer restriction is set in Google Cloud Console and Firestore/Storage security rules deny unauthenticated writes; document the result in the repo | Needs human with Firebase/GCP console access — the loop has no credentials to check console-side restrictions, and rules aren't in this repo to review locally (see T-008) |
| T-007b | P3 | Upgrade React + React DOM to 19 | Dependency health | Not Started | `react`/`react-dom` 18→19, `@types/react`/`@types/react-dom` to match. **High risk**: semantic-ui-react (beta), react-datepicker, react-calendar, react-hook-form compatibility with React 19 is unverified. Needs a human to smoke-test the app in a real browser after upgrading, not just build+test+lint | |
| T-007c | P3 | Upgrade React Router to 7 | Dependency health | Not Started | `react-router-dom` 6→7 is a breaking data-router API change. **High risk**: needs manual review of `Routes.tsx`/`RequireAuth.tsx` against the v7 migration guide and a human browser smoke-test, not just build+test+lint | |
| T-009 | P3 | Upgrade Firebase SDK 10→12 | Dependency health | Not Started | `firebase` package is two majors behind (10.14→12.16). **High risk**: touches auth/firestore/storage/app-check, the app's core data layer. Needs a human to verify against the Firebase v11/v12 migration notes and smoke-test auth + data flows in a real browser, not just build+test+lint | |
| T-008 | P1 | Version-control Firestore/Storage security rules | Security | Blocked | `firebase.json` only configures `hosting` — no `firestore.rules`/`storage.rules` exist in this repo, so rules can only be reviewed/audited by pulling them from the live Firebase Console. Add the rules files to the repo (pulled from current prod config) and wire `firestore`/`storage` sections into `firebase.json` and the deploy workflow | Requires a human to export the current live rules first (`firebase firestore:rules:get` / console) — the loop cannot fabricate security rules for a live production database |

> Add more rows as new findings surface. Keep one row per independently-mergeable unit of work — if a category needs five PRs, that's five rows, not one.

---

## 4. Completed

*(the loop moves finished rows here with their merge commit SHA, keeping section 3 focused on what's left)*

| ID | Title | Merged SHA | Date |
|---|---|---|---|
| T-001 | Add CI-enforced build/lint/test gate on every PR (also fixed a pre-existing `Tab.Pane` TS build error blocking `pnpm build`, and migrated Firebase workflows from `npm` to `pnpm`) | b4fd0a4 | 2026-07-23 |
| T-003 | Add a top-level React error boundary | 90c5125 | 2026-07-23 |
| T-004 | Establish baseline test coverage on auth flows | a10ff8d | 2026-07-23 |
| T-005 | Replace stock Vite template README with real project docs | 8c74148 | 2026-07-23 |
| T-006 | Code-split routed pages and vendor (firebase/semantic-ui) chunks; largest JS chunk went from 1.5MB to ~292KB | a34842f | 2026-07-23 |
| T-007a | Migrate ESLint to flat config, upgrade to ESLint 10 / typescript-eslint 8 (surfaced T-010, T-011, T-012 as new findings) | 4390678 | 2026-07-23 |
| T-010 | Fix ref accessed during render in EventFilters (useRef -> useState for the picker date) | 3408151 | 2026-07-23 |
| T-011 | Fix direct state mutation in ProfileEvents (copy instead of aliasing initialOptions) | 7dd3aa6 | 2026-07-23 |
| T-012 | Replace react-hook-form watch() with useWatch() in AccountPage (compiler-safe) | acc9700 | 2026-07-23 |
