import { useEffect, useState } from "react";

interface Difference {
  isFinished: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateDifference = (finalDate: Date): Difference => {
  let milliseconds = finalDate.getTime() - new Date().getTime();

  if (Math.floor(milliseconds / 1000) <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    };
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

const useCountdown = (finalDate: Date): Difference => {
  const [difference, setDifference] = useState<Difference>(
    calculateDifference(finalDate)
  );

  useEffect(() => {
    if (difference.isFinished) {
      return;
    }

    const timer = setTimeout(() => {
      setDifference(calculateDifference(finalDate));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [difference, finalDate]);

  return difference;
};

export default useCountdown;
