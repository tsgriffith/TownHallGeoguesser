# Technical Details

This file contains implementation and setup details for the `Griffith Foods Location Geo-Guesser` app.

## Important reality check

The frontend code is small. The Supabase setup is a required dependency and is often the longest part of re-creating this app.

Plan for backend setup time to:

- create tables
- configure API access
- apply/verify RLS policies
- copy the correct URL/key to Vite env vars
- test write/read from the browser app

## Stack

- `React`
- `TypeScript`
- `Vite`
- `Supabase` (REST via `fetch`, no SDK)
- `Vercel` deployment

## Project behavior

- Start screen collects player name
- Timed challenge (2 minutes)
- 10 image-to-location matches
- One submission per browser session using `sessionStorage`
- Leaderboard ordered by:
  1. highest score
  2. fastest time
- Optional remote game toggle via `config` table (`game_enabled`)

## Recreate from scratch (developer sequence)

1. Scaffold a Vite app with React + TypeScript.
2. Add `locations` data and map images in `/public/images`.
3. Implement screens and flow:
   - `start`
   - `game`
   - `leaderboard`
4. Implement timer + submit scoring + one-submit session guard.
5. Configure Supabase (URL/key, tables, policies).
6. Wire REST calls in `src/lib/supabase.ts`.
7. Verify locally.
8. Deploy to Vercel.

## Supabase setup (required)

### 1) Create project

Create a Supabase project and wait until it is fully provisioned.

### 2) Create tables

Run this SQL in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score int not null check (score between 0 and 10),
  time_seconds int not null check (time_seconds >= 0),
  submitted_at timestamptz not null default now()
);

create table if not exists public.config (
  key text primary key,
  value text not null
);

insert into public.config (key, value)
values ('game_enabled', 'true')
on conflict (key) do nothing;
```

### 3) Configure row-level security

If RLS is enabled, add policies so anonymous clients can do what this app needs.

Example baseline policies:

```sql
alter table public.scores enable row level security;
alter table public.config enable row level security;

create policy if not exists "anon can read scores"
on public.scores for select
using (true);

create policy if not exists "anon can insert scores"
on public.scores for insert
to anon
with check (true);

create policy if not exists "anon can read config"
on public.config for select
using (true);
```

Adjust for your security standards. These are simple event-oriented defaults.

### 4) Get URL + anon key

From Supabase project settings, copy:

- Project URL
- API anon key

### 5) Add env vars to Vite

Create `.env` (or `.env.local`) in project root:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Restart the dev server after editing env files.

### 6) Verify integration

- Submit a score from the app.
- Confirm row appears in `public.scores`.
- Confirm leaderboard reads data sorted by `score desc, time_seconds asc`.
- Toggle `config.game_enabled` to `false` and verify start screen disables.

## App integration points

- `postScore()` writes to `/rest/v1/scores`
- `fetchScores()` reads from `/rest/v1/scores?select=*&order=score.desc,time_seconds.asc`
- `fetchGameEnabled()` reads `/rest/v1/config?key=eq.game_enabled&select=value`

All are implemented in `src/lib/supabase.ts`.

## Local run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Vercel)

```bash
npx vercel
npx vercel --prod
```

## Files of interest

- `src/components/StartScreen.tsx`
- `src/components/GameScreen.tsx`
- `src/components/LeaderboardScreen.tsx`
- `src/data/locations.ts`
- `src/lib/supabase.ts`

## Intentional simplifications

- No authentication/login
- No admin portal
- No heavy state library
- No test suite in this starter
- Location content is hardcoded for easy swapping
