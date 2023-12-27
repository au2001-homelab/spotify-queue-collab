"use client";

import { formatDuration } from "@/utils/ui";
import { useEffect, useState } from "react";

interface TimerProps {
  timestamp: number;
  duration: number;
}

export function Timer({ timestamp, duration }: TimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {formatDuration(Math.min(Math.max(now - timestamp, 0), duration))}
      {" / "}
      {formatDuration(duration)}
    </>
  );
}
