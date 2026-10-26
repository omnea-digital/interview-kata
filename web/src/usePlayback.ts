import { useCallback, useEffect, useState } from "react";

// Steps through `length` frames at `stepsPerSecond`, stopping at the end.
export function usePlayback(length: number, stepsPerSecond: number) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setStep((current) => Math.min(current + 1, length)),
      1000 / stepsPerSecond,
    );
    return () => clearInterval(id);
  }, [playing, length, stepsPerSecond]);

  useEffect(() => {
    if (playing && step >= length) setPlaying(false);
  }, [playing, step, length]);

  const play = useCallback(() => {
    setStep((current) => (current >= length ? 0 : current));
    setPlaying(true);
  }, [length]);

  const pause = useCallback(() => setPlaying(false), []);

  const restart = useCallback(() => {
    setStep(0);
    setPlaying(true);
  }, []);

  const seek = useCallback(
    (target: number) => {
      setPlaying(false);
      setStep(Math.max(0, Math.min(target, length)));
    },
    [length],
  );

  return { step, playing, play, pause, restart, seek };
}
