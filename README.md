# Hanexis — AI-Driven Social Media Lead Generation

A full-stack Next.js 14 app that covers **Module 1 (Auth)**, **Module 2 (Lead Management)**, and **Module 3 (AI Personalization)** from the Hanexis developer plan. Deploys in one click to Vercel.

> Built with Next.js + Tailwind + Prisma + NextAuth + Neon Postgres. UI uses different shades of pink only, with Framer Motion micro-interactions throughout.

## Features

**Module 1 — Auth & User Management**
- Email/password sign-up & sign-in (bcrypt-hashed, JWT sessions)
- Google OAuth
- LinkedIn OAuth (OpenID Connect)
- Role-based access (ADMIN / USER) with auto-promote via `ADMIN_EMAIL`
- Protected dashboard routes via Next.js middleware

**Module 2 — Lead Management**
- Add / edit / delete leads (CRUD)
- CSV import (drag-and-drop, auto-parses columns)
- Tags, status pipeline (NEW → CONTACTED → RESPONDED → CONVERTED → ARCHIVED)
- Quality score (0–100)
- Search across name, email, company, role
- Filter by status, source, tag
- Inline lead drawer for fast editing
- Dashboard with pipeline donut + status bars

**Module 3 — AI Personalization Engine**
- Generate **connection requests**, **follow-ups**, and **sales pitches**
- Tone control: friendly / professional / casual / enthusiastic
- Per-lead context or ad-hoc one-off generation
- High-quality mock generator (works without an OpenAI key)
- Drop-in OpenAI integration — set `OPENAI_API_KEY` and it switches to GPT-4o-mini automatically
- Prompt template library — 6 battle-tested templates seeded on first use
- Generation history per user

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (pink-only palette) |
| Animation | Framer Motion |
| State | Zustand |
| Forms / validation | React Hook Form + Zod |
| Auth | NextAuth v4 + Prisma adapter |
| DB | PostgreSQL via Neon |
| ORM | Prisma 5 |
| AI | OpenAI Chat Completions (or built-in mock) |
| Hosting | Vercel |

## Quick start (local)

```bash
git clone https://github.com/priyadarshini090805-del/hanexis-lead-gen.git
cd hanexis-lead-gen
npm install
cp .env.example .env
# edit .env — set DATABASE_URL + NEXTAUTH_SECRET (the others can stay empty)
npx prisma db push
npm run dev
# open http://localhost:3000
```

The app falls back to mock AI when `OPENAI_API_KEY` is empty, and skips OAuth providers whose client IDs are not set — so you can run with just a database.

## Deploy to Vercel

See **SETUP_GUIDE.md** for full click-by-click instructions including Neon, LinkedIn, Google, and Vercel setup.

TL;DR:
1. Push this repo to GitHub.
2. On Vercel, click **Add New → Project → Import** your repo.
3. Set environment variables (see `.env.example`).
4. Deploy.
5. Run `npx prisma db push` against your Neon DB (or it auto-runs on first request).

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Neon Postgres pooled connection string |
| `NEXTAUTH_SECRET` | yes | Random 32+ char string |
| `NEXTAUTH_URL` | yes | Your Vercel URL (e.g. `https://hanexis-lead-gen.vercel.app`) |
| `GOOGLE_CLIENT_ID` | optional | Google OAuth — omit to disable Google sign-in |
| `GOOGLE_CLIENT_SECRET` | optional | " |
| `LINKEDIN_CLIENT_ID` | optional | LinkedIn OAuth — omit to disable LinkedIn sign-in |
| `LINKEDIN_CLIENT_SECRET` | optional | " |
| `OPENAI_API_KEY` | optional | Real GPT generation — falls back to mock if missing |
| `ADMIN_EMAIL` | optional | First user to register with this email gets ADMIN role |

## Project layout

```
src/
  app/
    page.tsx                  # Landing
    login/                    # Sign in
    signup/                   # Sign up
    dashboard/                # Authenticated app
      layout.tsx
      page.tsx                # Overview + charts
      leads/                  # Module 2
      ai-messages/            # Module 3
      prompts/                # Prompt library
      integrations/
      settings/
    api/
      auth/
        [...nextauth]/route.ts
        register/route.ts
      leads/
        route.ts
        [id]/route.ts
        import/route.ts
      ai/generate/route.ts
      prompts/route.ts
  components/
    dashboard/                # Sidebar, Topbar, Drawer, Charts
  lib/
    auth.ts                   # NextAuth options
    prisma.ts
    ai.ts                     # Mock + real OpenAI
    utils.ts
  stores/
    useLeadsStore.ts          # Zustand
  middleware.ts               # Route protection
prisma/
  schema.prisma
```

## License

MIT
