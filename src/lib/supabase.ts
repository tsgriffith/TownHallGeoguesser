const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export interface ScoreRow {
  id: string;
  name: string;
  score: number;
  time_seconds: number;
  submitted_at: string;
}

export async function postScore(
  name: string,
  score: number,
  timeSeconds: number
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({
      name,
      score,
      time_seconds: timeSeconds,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to post score: ${res.status}`);
  }
}

export async function fetchScores(): Promise<ScoreRow[]> {
if (!SUPABASE_URL || !SUPABASE_KEY) return [];
const res = await fetch(
    `${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc,time_seconds.asc`,
    { method: "GET", headers }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch scores: ${res.status}`);
  }
  return res.json();
}
