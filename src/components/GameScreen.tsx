import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import locations from "../data/locations";
import Timer from "./Timer";

interface GameScreenProps {
  onFinish: (score: number, timeSeconds: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DURATION = 120;

function GameScreen({ onFinish }: GameScreenProps) {
  const shuffledLocations = useMemo(() => shuffle(locations), []);
  const [startTime] = useState(() => Date.now());

  // assignments: imageId -> locationId
  const [assignments, setAssignments] = useState<Record<number, number>>({});
  const assignmentsRef = useRef(assignments);

  useEffect(() => {
    assignmentsRef.current = assignments;
  });
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const assignedLocationIds = new Set(Object.values(assignments));
  const allAssigned = Object.keys(assignments).length === locations.length;

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);

    const currentAssignments = assignmentsRef.current;
    const elapsed = Math.min(
      Math.round((Date.now() - startTime) / 1000),
      DURATION
    );
    let score = 0;
    for (const loc of locations) {
      if (currentAssignments[loc.id] === loc.id) score++;
    }
    onFinish(score, elapsed);
  }, [submitted, onFinish, startTime]);

  const handleTimerExpire = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleImageClick = (imageId: number) => {
    if (submitted) return;

    // If this image already has an assignment, clear it and re-select for reassignment
    if (assignments[imageId] != null) {
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[imageId];
        return next;
      });
      setSelectedImageId(imageId);
      return;
    }

    setSelectedImageId(imageId === selectedImageId ? null : imageId);
  };

  const handleLocationClick = (locationId: number) => {
    if (submitted) return;

    // If no image is selected, clicking an already-assigned location unassigns it
    if (selectedImageId === null) {
      setAssignments((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          if (next[Number(key)] === locationId) {
            delete next[Number(key)];
            break;
          }
        }
        return next;
      });
      return;
    }

    setAssignments((prev) => {
      const next = { ...prev };
      // Remove this location from any other image
      for (const key of Object.keys(next)) {
        if (next[Number(key)] === locationId) {
          delete next[Number(key)];
        }
      }
      next[selectedImageId] = locationId;
      return next;
    });
    setSelectedImageId(null);
  };

  return (
    <div className="game-screen">
      <div className="game-layout">
        <div className="game-column">
          <h2>Where in the world?</h2>
          <div className="image-list">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className={`image-card ${selectedImageId === loc.id ? "selected" : ""} ${assignments[loc.id] != null ? "assigned" : ""}`}
                onClick={() => handleImageClick(loc.id)}
              >
                <img src={loc.image} alt={`Location ${loc.id}`} />
                {assignments[loc.id] != null ? (
                  <div className="assignment-badge">
                    {locations.find((l) => l.id === assignments[loc.id])?.name}
                  </div>
                ) : (
                  <div className="unassigned-badge"><b>Where in the world?</b></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="game-column">
          <Timer durationSeconds={DURATION} onExpire={handleTimerExpire} />
          <h2>Griffith Worldwide Locations</h2>
          <div className="location-list">
            {shuffledLocations.map((loc) => {
              const used = assignedLocationIds.has(loc.id);
              return (
                <button
                  key={loc.id}
                  className={`location-btn ${used ? "used" : ""}`}
                  onClick={() => handleLocationClick(loc.id)}
                  disabled={!used && selectedImageId === null}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
          <button
            className="submit-btn"
            disabled={!allAssigned || submitted}
            onClick={handleSubmit}
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
