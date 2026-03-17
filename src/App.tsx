import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import { postScore } from "./lib/supabase";
import "./App.css";

const SUBMITTED_KEY = "griffith-geo-submitted";

type Screen = "start" | "game" | "leaderboard";

function App() {
  const alreadySubmitted = sessionStorage.getItem(SUBMITTED_KEY) === "true";
  const [screen, setScreen] = useState<Screen>(alreadySubmitted ? "leaderboard" : "start");
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  const handleStart = (name: string) => {
    setPlayerName(name);
    setScreen("game");
  };

  const handlePlayAgain = () => {
    sessionStorage.removeItem(SUBMITTED_KEY);
    setPlayerName("");
    setFinalScore(0);
    setFinalTime(0);
    setScreen("start");
  };

  const handleFinish = async (score: number, timeSeconds: number) => {
    setFinalScore(score);
    setFinalTime(timeSeconds);
    setScreen("leaderboard");

    if (sessionStorage.getItem(SUBMITTED_KEY) === "true") return;
    sessionStorage.setItem(SUBMITTED_KEY, "true");

    try {
      await postScore(playerName, score, timeSeconds);
    } catch (err) {
      console.error("Score submission failed:", err);
    }
  };

  return (
    <div className="app">
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "game" && <GameScreen onFinish={handleFinish} />}
      {screen === "leaderboard" && (
        <LeaderboardScreen
          currentName={playerName}
          currentScore={finalScore}
          currentTime={finalTime}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
