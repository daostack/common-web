import React, { useEffect, useState } from "react";
import "./index.scss";

interface ProposalCountDownInterface {
  date: Date;
}

const countDownCount = (date: Date) => {
  let difference = date.getTime() - new Date().getTime();

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  const minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  const secondsDifference = Math.floor(difference / 1000);

  return {
    difference: date.getTime() - new Date().getTime(),
    daysDifference,
    hoursDifference,
    minutesDifference,
    secondsDifference,
  };
};

const formatCountDown = (step: number) => {
  const string = step.toString();

  return string.length === 1 ? `0${string}` : string;
};

export default function ProposalCountDown({ date }: ProposalCountDownInterface) {
  const [state, setState] = useState(countDownCount(date));

  useEffect(() => {
    if (state.difference > 0) {
      const interval = setTimeout(() => {
        setState(countDownCount(date));
      }, 1000);

      return () => clearTimeout(interval);
    }
  }, [state, date]);

  return (
    <div className="countdown-wrapper">
      <div className="inner-wrapper">
        <img className="clock-icon" src="/icons/alarm-clock.svg" alt="alarm-clock" />
        <div className="text">
          {state.difference > 0 ? (
            <>
              {`Countdown ${formatCountDown(state.daysDifference)}:
              ${formatCountDown(state.hoursDifference)}:
              ${formatCountDown(state.minutesDifference)}:
              ${formatCountDown(state.secondsDifference)}`}
            </>
          ) : (
            "Time's up!"
          )}
        </div>
      </div>
    </div>
  );
}
