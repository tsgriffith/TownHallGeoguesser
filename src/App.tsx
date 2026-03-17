import { useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import { postScore, fetchGameEnabled } from "./lib/supabase";
import "./App.css";

const SUBMITTED_KEY = "griffith-geo-submitted";

type Screen = "start" | "game" | "leaderboard";

function App() {
  const alreadySubmitted = sessionStorage.getItem(SUBMITTED_KEY) === "true";
  const [screen, setScreen] = useState<Screen>(alreadySubmitted ? "leaderboard" : "start");
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [gameEnabled, setGameEnabled] = useState(true);

  useEffect(() => {
    const check = async () => {
      const enabled = await fetchGameEnabled();
      setGameEnabled(enabled);
    };
    check();
    const id = setInterval(check, 5_000);
    return () => clearInterval(id);
  }, []);

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
      {screen === "start" && !gameEnabled && (
        <div className="disabled-screen">
          <h1>Griffith Location Geo-Guesser</h1>
          <p className="disabled-message">Disabled until the town hall is over...you can try again later</p>
        </div>
      )}
      {screen === "start" && gameEnabled && <StartScreen onStart={handleStart} />}
      {screen === "game" && <GameScreen onFinish={handleFinish} />}
      {screen === "leaderboard" && (
        <LeaderboardScreen
          currentName={playerName}
          currentScore={finalScore}
          currentTime={finalTime}
          onPlayAgain={gameEnabled ? handlePlayAgain : undefined}
        />
      )}
    </div>
  );
}

export default App;
