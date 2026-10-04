# CropAI — AI-Powered Agriculture Crop Advisory Assistant

A full-stack SaaS application delivering hyper-personalized crop recommendations, fertilizer schedules, and risk management strategies powered by **Google Gemini AI**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Auth (Client) | Supabase Auth |
| Forms | React Hook Form + Zod |
| Backend | Node.js + Express + TypeScript |
| AI | `@google/genai` (Gemini 2.5 Flash) |
| Database | Supabase (PostgreSQL) |
| Validation | Zod (shared schemas) |

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google AI Studio](https://aistudio.google.com/app/apikey) Gemini API Key

### 2. Install all dependencies
```bash
npm install          # installs root concurrently
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### 4. Run database migrations
```bash
# Option A: Run the migration script (requires DATABASE_URL in backend/.env)
npm run migrate

# Option B: Paste supabase/migrations/001_initial_schema.sql directly into
#            Supabase Dashboard → SQL Editor → Run
```

### 5. Start development servers
```bash
npm run dev
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

---

## 🗂 Project Structure

```
CropAI/
├── package.json              # Root — concurrently scripts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Full DB schema + RLS policies
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts                 # Express app entry point
│       ├── config/
│       │   ├── env.ts               # Environment config
│       │   └── supabase.ts          # Supabase admin client
│       ├── middleware/
│       │   ├── auth.ts              # JWT verification middleware
│       │   └── errorHandler.ts      # Global error handler
│       ├── routes/
│       │   └── advisoryRoutes.ts    # API route definitions
│       ├── controllers/
│       │   └── advisoryController.ts
│       ├── services/
│       │   └── geminiService.ts     # Gemini AI integration
│       ├── schemas/
│       │   └── advisorySchema.ts    # Zod schemas + TypeScript types
│       └── scripts/
│           └── migrate.ts           # DB migration runner
└── frontend/
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── App.tsx                  # Router + layout
        ├── main.tsx
        ├── index.css                # Design system
        ├── context/
        │   └── AuthContext.tsx      # Supabase auth state
        ├── lib/
        │   ├── supabase.ts          # Supabase browser client
        │   ├── api.ts               # Typed API client
        │   └── schema.ts            # Zod schemas (shared)
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── ProtectedRoute.tsx
        │   └── LoadingSpinner.tsx
        └── pages/
            ├── LandingPage.tsx
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── DashboardPage.tsx
            ├── NewAdvisoryPage.tsx
            └── AdvisoryReportPage.tsx
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | None | Server health check |
| POST | `/api/advisories/generate` | Bearer JWT | Generate + save AI advisory |
| GET | `/api/advisories` | Bearer JWT | List user's advisories |
| GET | `/api/advisories/:id` | Bearer JWT | Get specific advisory |
| DELETE | `/api/advisories/:id` | Bearer JWT | Delete advisory |

---

## 🔒 Security Model

- **JWT Verification**: All `/api` routes verify Supabase JWTs via the auth middleware
- **Row Level Security**: PostgreSQL RLS ensures users can only access their own data
- **CORS**: Backend only accepts requests from the configured `FRONTEND_URL`
- **No raw errors**: All internal errors are sanitized before reaching the client
- **Service role key**: Only used server-side, never exposed to the browser

---

## Development Mode (No API Keys)

The app supports a graceful degradation mode:
- If `GEMINI_API_KEY` is not set → returns realistic mock advisory data
- If `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are not set → uses in-memory mock store

This lets you explore the full UI without any external services configured.

---

## Database Schema

See [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) for the full schema including RLS policies.

Key table: `advisories`
- `id` UUID PK
- `user_id` → `auth.users.id` (RLS enforced)
- `ai_response` JSONB — stores `{ recommendedCrops, fertilizerSchedule, riskFactors }`
- All other form fields as typed columns
