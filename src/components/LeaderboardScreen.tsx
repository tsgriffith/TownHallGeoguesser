import { useEffect, useRef, useState } from "react";
import { fetchScores, type ScoreRow } from "../lib/supabase";

interface LeaderboardScreenProps {
  currentName: string;
  currentScore: number;
  currentTime: number;
  onPlayAgain?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const TROPHY: Record<number, string> = { 0: "\u{1F947}", 1: "\u{1F948}", 2: "\u{1F949}" };

function LeaderboardScreen({ currentName, currentScore, currentTime, onPlayAgain }: LeaderboardScreenProps) {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(120);
  const cooldownRef = useRef(cooldown);

  useEffect(() => {
    cooldownRef.current = cooldown;
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchScores();
      setRows(data);
      setError(false);
    } catch {
      setError(true);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchScores();
        if (active) {
          setRows(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    };

    load();
    const id = setInterval(load, 5_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  // Show current player's result even if fetch hasn't returned yet
  const showCurrentResult = currentName && currentScore >= 0;

  return (
    <div className="leaderboard-screen">
      <h1>Griffith Location Geo-Guesser</h1>

      {showCurrentResult && (
        <div className="your-result">
          <span className="your-result-label">Your result</span>
          <div className="result-row highlight">
            <span className="result-name">{currentName}</span>
            <span className="result-score">{currentScore} / 10</span>
            <span className="result-time">{formatTime(currentTime)}</span>
          </div>
        </div>
      )}

      <div className="leaderboard-heading-row">
        <h2 className="leaderboard-heading">Leaderboard</h2>
        <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "\u{1F504} Refresh"}
        </button>
      </div>

      {error && <p className="leaderboard-error">Could not load scores.</p>}

      {rows.length > 0 && (
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <span>#</span>
            <span>Name</span>
            <span>Score</span>
            <span>Time</span>
            <span className="trophy-col"></span>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={`leaderboard-row ${row.name === currentName ? "leaderboard-you" : ""}`}
            >
              <span>{i + 1}</span>
              <span>{row.name}</span>
              <span>{row.score} / 10</span>
              <span>{formatTime(row.time_seconds)}</span>
              <span className="trophy-col">{TROPHY[i] ?? ""}</span>
            </div>
          ))}
        </div>
      )}

      {!error && rows.length === 0 && (
        <p className="leaderboard-empty">No scores yet.</p>
      )}

      {onPlayAgain && (
        cooldown > 0 ? (
          <div className="cooldown-dialog">
            <p>You can play again in <strong>{formatTime(cooldown)}</strong></p>
          </div>
        ) : (
          <button className="play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
        )
      )}
    </div>
  );
}

export default LeaderboardScreen;
