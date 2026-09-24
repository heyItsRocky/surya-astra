# Changes Log — Surya-Astra

> Session-level change log. Detailed release history lives in `CHANGELOG.md`.
> Append an entry **before every push**.

---

## 2026-09-23 — Submission-ready hardening session

**Base:** `e91564d` (feat: Python FastAPI backend with threshold nowcaster and API wiring)

### Session goals
- Green build gate: lint + typecheck + build
- Verify all 6 backend endpoints end-to-end
- Close remaining DoD gaps: tests, CI, README, presentation pack, deploy runbook, favicon.ico, MetricsGrid loading/error/retry
- Update stale docs (COMPLETION_GUIDE, HANDOVER_PROMPT, PLAN_OPTION_A, CHANGELOG)

### Inventory (Phase 0, verified against repo at `e91564d`)

| # | DoD item | Status at start | Action |
|---|----------|-----------------|--------|
| 1 | Fresh clone lint/tsc/build | build ✓ tsc ✓ **lint ✗** (`next lint` removed in Next 16) | Migrate to ESLint 9 flat config |
| 2 | Backend 6 endpoints `{success,data}` | Code present; endpoint loop returned HTTP 200 | Re-verify + document run cmd |
| 3 | Frontend mock + real API modes | `src/lib/api.ts` switch present | E2E smoke after fixes |
| 4 | Error boundaries + 4 widgets loading/error/retry | Boundaries ✓; Nowcast/Forecast/Events ✓; **MetricsGrid ✗** | Wire MetricsGrid to API + states |
| 5 | public/ favicon, robots, sitemap, OG | favicon.svg ✓ robots ✓ sitemap ✓ og-image.svg ✓; **favicon.ico missing** (referenced in layout) | Add favicon.ico |
| 6 | `.env.example` documents env vars | ✓ | — |
| 7 | Vitest + `npm test` | **✗** no test script, no vitest | Add vitest + smoke tests + pytest |
| 8 | Mobile hamburger nav | ✓ `MobileNav.tsx` | — |
| 9 | `.github/workflows/ci.yml` | **✗** | Add CI (lint, tsc, build, pytest) |
| 10 | README matches reality | **✗** still says "Mock data (no backend)" | Rewrite quickstart |
| 11 | vercel.json + deploy steps | rewrite present; **no DEPLOY.md** | Add `docs/DEPLOY.md` + README section |
| 12 | Presentation artifacts | **✗** no `presentation/` dir | Create presentation/ + deck notes |
| 13 | Pushed main + changes.md | **✗** changes.md missing | This file + commits |
| 14 | Final Done/Not-done report | pending | Phase 6 |

### Commits planned this session
1. `fix: eslint flat config for Next 16, MetricsGrid API states, favicon.ico`
2. `test: add vitest frontend tests and pytest nowcaster tests`
3. `ci: add GitHub Actions workflow for lint, typecheck, build, pytest`
4. `docs: rewrite README, update guides, add deploy runbook and presentation pack`
5. Final: push all to `main`

### BLOCKERS
- **Deploy accounts (Vercel/Railway):** no CLI credentials detected this session → config + runbook only unless login available.

### Execution log (this session)

| Gate | Result |
|------|--------|
| `npm run lint` | 0 errors, 1 warning (custom font — pages/_document note, accepted) |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 (Next 16.2.9) |
| `npm test` (vitest) | 29 passed / 3 files |
| `python3 -m pytest backend/tests` | 22 passed |
| Backend live smoke | `/api/health` + `/api/nowcast` HTTP 200, `success=true`, full envelope |
| Endpoint loop | 6/6 HTTP 200 earlier in session |

**Commits made this session (on top of `e91564d`):**
1. `fix: eslint flat config for Next 16, MetricsGrid API states, purity lint fixes, favicon.ico`
2. `test: add vitest frontend tests and pytest nowcaster tests`
3. `ci: add GitHub Actions workflow for lint, typecheck, build, pytest`
4. `docs: rewrite README, update guides, add deploy runbook and presentation pack`
5. `chore: optional polish — next/font, bundle analyzer, a11y and responsive fixes` (pending this push)

**Gates after polish:** lint **0 errors 0 warnings**; tsc 0; vitest 29; pytest 22; build 0; mock smoke 200s.

**E2E smoke:** mock-mode `npm start` → home/favicon/robots/sitemap 200; real-API mode → all 6 endpoints `{success,data}` + assets 200 (`REAL_SMOKE=PASS`).

**Deploy:** still BLOCKED on account login → `docs/DEPLOY.md` only.

---
