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
| T-001 | P0 | *(example)* Add CI-enforced build/lint/test gate on every PR | CI/CD | Not Started | GitHub Actions workflow runs build+lint+test on PR and blocks merge on failure | |
| T-002 | P1 | *(example)* Establish baseline test coverage on auth flows | Testing | Not Started | Auth login/register/logout have passing unit tests | |

> Replace the example rows with real findings from the audit in section 2. Keep one row per independently-mergeable unit of work — if a category needs five PRs, that's five rows, not one.

---

## 4. Completed

*(the loop moves finished rows here with their merge commit SHA, keeping section 3 focused on what's left)*

| ID | Title | Merged SHA | Date |
|---|---|---|---|
