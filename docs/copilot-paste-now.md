I want to put together a simple web app for our town hall that people can use during the presentation. The basic idea is a matching game using Griffith Foods locations around the world. People open a link, enter their name, and start a 3-minute challenge where they match 10 images to 10 locations. They can rearrange their answers before submitting, but only get one shot. When they're done, they see a leaderboard with names, scores, and times. It needs to feel simple and obvious right away. Works on desktop and mobile, no login, no heavy setup. Just the smallest thing that works.

Before writing any code, output a build plan with file structure and step order. Wait for my approval before proceeding.

Ignore any C# or .NET defaults. This is a web app only.

Stack:
- React + Vite + TypeScript
- Supabase for leaderboard (REST API via fetch, no SDK)
- Deploy to Vercel

Build in this order, stop and confirm after each step:

Step 1: Scaffold React + Vite + TypeScript project in the current directory. Confirm it runs locally.

Step 2: Create /src/data/locations.ts with 10 placeholder entries: { id, name, image }. Images will be in /public/images/ named image-01.jpg through image-10.jpg.

Step 3: Start screen. Name input and Start button. Validate name not empty. Store name in state, move to game screen.

Step 4: Game screen. 10 images on the left, 10 shuffled location name buttons on the right. Click image to select, click location to assign. Show assignments clearly. Allow reassignment. 3-minute countdown timer at top. Submit button disabled until all 10 matched. Auto-submit on timer expiry.

Step 5: Supabase leaderboard. Single table: scores (id, name, score, submitted_at). Store URL and anon key in .env. POST score via fetch on submit. Score = correct matches out of 10. Set sessionStorage flag to prevent resubmit.

Step 6: Leaderboard screen. Fetch all rows, display sorted by score. Refresh every 10 seconds.

Step 7: Mobile polish. Tap to select, tap to assign. Clean corporate look. No heavy design.

Constraints:
- No login
- No admin portal
- No test suite
- No complex state management
- Hardcode content for now, I will swap in real images and location names
- Small, readable files
- Comments only where logic is non-obvious

At the end provide: local run steps, Supabase table SQL, Vercel deploy steps, .env variables, what was left out intentionally.
