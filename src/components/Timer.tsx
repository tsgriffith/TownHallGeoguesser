import { useEffect, useRef, useState } from "react";

interface TimerProps {
  durationSeconds: number;
  onExpire: () => void;
}

function Timer({ durationSeconds, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining <= 30;

  return (
    <div className={`timer ${urgent ? "timer-urgent" : ""}`}>
      {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
}

export default Timer;
