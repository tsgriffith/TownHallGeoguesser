# Griffith Foods Location Geo-Guesser

A simple, mobile-friendly game built for a town hall presentation.

Participants enter their name, match 10 photos to 10 Griffith Foods locations, and submit one final answer before time runs out. A live leaderboard shows scores and completion times.

## Why this was created

This app was created to make a town hall session more interactive and memorable.

Instead of a passive presentation, people can join from their phone or laptop, play a short challenge, and see how they rank against others in real time. The goal was to keep it easy to use for everyone:

- no account creation
- no app install
- one link to join
- clear, quick gameplay

## How it works (non-technical)

1. Open the game link.
2. Enter your name.
3. Match each image to the correct Griffith location.
4. Submit once before the timer ends.
5. View the leaderboard with scores and times.

## What participants will see

- A clean start screen
- A timed matching challenge (10 images)
- A leaderboard after submission
- Optional play-again flow after cooldown (when enabled)

## If a developer needs to re-create this app later

Rebuilding this app is straightforward **once setup is complete**, but there are two parts:

1. Frontend (quick)
2. Supabase backend configuration (important and can take longer than coding)

The frontend game itself is small. In practice, the Supabase setup (tables, keys, policies, env config, and testing) is the part that usually takes the most time.

### Practical rebuild checklist

1. Create a `React + Vite + TypeScript` app.
2. Add 10 location records and image files in `/public/images`.
3. Build screens:
   - start (name input)
   - game (matching + timer)
   - leaderboard (scores + times)
4. Add one-submit behavior with `sessionStorage`.
5. Configure Supabase (required for persistent leaderboard and remote game enable/disable).
6. Add env variables in Vite.
7. Test score submit/read flows.
8. Deploy to Vercel.

If Supabase is not configured, the app UI still runs, but persistent scoring/leaderboard storage and remote game control are limited.

## Project story and source material

The game concept and location narrative came from:

- `docs/copilot-paste-now.md`
- `docs/Griffith Images with Location.md`

## Technical details

To keep this README easy for non-technical readers, full implementation/setup details are in:

- `docs/TECHNICAL_DETAILS.md`

That file includes:

- exact Supabase SQL
- practical Supabase setup sequence
- RLS policy guidance
- required env vars
- local run/build/deploy commands
