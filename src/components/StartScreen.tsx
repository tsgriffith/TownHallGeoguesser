import { useState } from "react";

interface StartScreenProps {
  onStart: (name: string) => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onStart(trimmed);
  };

  return (
    <div className="start-screen">
      <h1>Griffith Location Geo-Guesser</h1>
      <p className="subtitle">
        Match 10 images to their Griffith Foods locations around the world.
        <br />
        You have 2 minutes. Good luck!
      </p>
      <form onSubmit={handleSubmit} className="start-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={40}
        />
        <button type="submit" disabled={name.trim().length === 0}>
          Start
        </button>
      </form>
    </div>
  );
}

export default StartScreen;
