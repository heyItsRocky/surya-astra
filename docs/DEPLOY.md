# Deployment Runbook — Surya-Astra

Zero-budget deploy: **Vercel (frontend)** + **Railway or Render (FastAPI backend)**.

> Account logins are manual. Complete the steps below once signed in.
> Mark status in `changes.md` / final report if blocked on credentials.

---

## 1. Backend → Railway (recommended)

1. Create a free account at [railway.app](https://railway.app) and **New Project → Deploy from GitHub**.
2. Select `heyItsRocky/surya-astra`.
3. **Root Directory:** `backend`
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   Railway injects `$PORT`. The Dockerfile in `backend/` is optional (Railway can use it automatically if detected — both work).
6. Health check path: **`/api/health`**
7. Generate a public domain, e.g. `https://surya-astra-backend.up.railway.app`.
8. Smoke test:
   ```bash
   curl https://<your-railway-host>/api/health
   curl https://<your-railway-host>/api/nowcast
   ```

### Render alternative

- **New → Web Service**, root `backend`
- Runtime: Python 3
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health: `/api/health`

---

## 2. Frontend → Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import `heyItsRocky/surya-astra`.
2. Framework preset: **Next.js** (auto-detected).
3. Environment variables:

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_USE_MOCK` | `false` |
   | `NEXT_PUBLIC_API_URL` | `https://<your-backend-host>` |

4. Deploy. Note the production URL (e.g. `https://surya-astra.vercel.app`).

### vercel.json rewrite

`vercel.json` already contains:

```json
"rewrites": [
  { "source": "/api/:path*", "destination": "https://surya-astra-backend.up.railway.app/api/:path*" }
]
```

If your Railway hostname differs, **update the destination** and redeploy.  
The rewrite is for production proxying; local dev uses `NEXT_PUBLIC_API_URL` directly.

### CORS

Backend `main.py` already allows `https://surya-astra.vercel.app` and `*`. Tighten `*` for production if desired.

---

## 3. Post-deploy checklist

- [ ] `https://<vercel>/` loads 3D intro + dashboard
- [ ] Network tab: widget requests hit backend (or mock latency when mock=true)
- [ ] `https://<backend>/api/health` → `{"success": true, ...}`
- [ ] OG image / favicon resolve on Vercel
- [ ] CI green on latest commit

---

## 4. Local parity commands

```bash
# Terminal 1 — backend
cd backend && uvicorn main:app --port 8000

# Terminal 2 — frontend (real API)
NEXT_PUBLIC_USE_MOCK=false NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 npm run dev
```

---

## Blockers

| Item | Status |
|------|--------|
| Vercel account login | User action |
| Railway/Render account login | User action |
| Live URL verification | Blocked until both deployed |
