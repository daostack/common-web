import { useCallback, useEffect, useState } from "react";

interface Difference {
  isFinished: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Return extends Difference {
  startCountdown: (date: Date) => void;
}

const INITIAL_DIFFERENCE: Difference = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isFinished: false,
};

const calculateDifference = (finalDate: Date): Difference => {
  let milliseconds = finalDate.getTime() - new Date().getTime();

  if (Math.floor(milliseconds / 1000) <= 0) {
    return { ...INITIAL_DIFFERENCE, isFinished: true };
  }

  const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
  milliseconds = milliseconds - days * 1000 * 60 * 60 * 24;

  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  milliseconds = milliseconds - hours * 1000 * 60 * 60;

  const minutes = Math.floor(milliseconds / 1000 / 60);
  milliseconds = milliseconds - minutes * 1000 * 60;

  const seconds = Math.floor(milliseconds / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isFinished: false,
  };
};

const useCountdown = (): Return => {
  const [countdownDate, setCountdownDate] = useState<Date | null>(null);
  const [difference, setDifference] = useState<Difference>(
    countdownDate ? calculateDifference(countdownDate) : INITIAL_DIFFERENCE
  );

  const startCountdown = useCallback((date: Date) => {
    setCountdownDate(date);
    setTimeout(() => {
      setDifference(calculateDifference(date));
    }, 0);
  }, []);

  useEffect(() => {
    if (difference.isFinished || !countdownDate) {
      return;
    }

    const timer = setTimeout(() => {
      setDifference(calculateDifference(countdownDate));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [difference, countdownDate]);

  return { ...difference, startCountdown };
};

export default useCountdown;
