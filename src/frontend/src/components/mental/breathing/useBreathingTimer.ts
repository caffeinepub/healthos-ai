import { useState, useEffect, useRef } from 'react';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingState {
  phase: BreathingPhase;
  secondsRemaining: number;
  cyclesCompleted: number;
  isActive: boolean;
}

export function useBreathingTimer(durationMinutes: number = 2) {
  const [state, setState] = useState<BreathingState>({
    phase: 'inhale',
    secondsRemaining: 4,
    cyclesCompleted: 0,
    isActive: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalCycles = Math.floor((durationMinutes * 60) / 16); // 16 seconds per cycle

  const start = () => {
    setState((prev) => ({ ...prev, isActive: true }));
  };

  const stop = () => {
    setState({
      phase: 'inhale',
      secondsRemaining: 4,
      cyclesCompleted: 0,
      isActive: false,
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!state.isActive) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsRemaining > 1) {
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        }

        // Move to next phase
        let nextPhase: BreathingPhase = 'inhale';
        let nextDuration = 4;
        let nextCycles = prev.cyclesCompleted;

        if (prev.phase === 'inhale') {
          nextPhase = 'hold';
          nextDuration = 4;
        } else if (prev.phase === 'hold') {
          nextPhase = 'exhale';
          nextDuration = 6;
        } else if (prev.phase === 'exhale') {
          nextPhase = 'rest';
          nextDuration = 2;
        } else {
          nextPhase = 'inhale';
          nextDuration = 4;
          nextCycles = prev.cyclesCompleted + 1;
        }

        if (nextCycles >= totalCycles) {
          return { ...prev, isActive: false };
        }

        return {
          phase: nextPhase,
          secondsRemaining: nextDuration,
          cyclesCompleted: nextCycles,
          isActive: true,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, totalCycles]);

  return { state, start, stop };
}
