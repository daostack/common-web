import React,
{
  useEffect,
  useState,
  useMemo,
} from "react";
import { ProposalState } from "@/shared/models";
import "./index.scss";

interface ProposalCountDownInterface {
  date: Date;
  state: ProposalState;
  type?: string;
  preview?: boolean;
  hideCounter?: boolean;
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

export default function ProposalCountDown({ date, state: proposalState, type, preview, hideCounter }: ProposalCountDownInterface) {
  const [state, setState] = useState(countDownCount(date));
  const countdownText =
    proposalState === ProposalState.DISCUSSION ? "Discussion" : "Voting";
  const countdown = useMemo(
    () =>
      hideCounter
        ? countdownText
        : `${!preview ? `${countdownText} ` : ""}${formatCountDown(
            state.daysDifference
          )}:${formatCountDown(state.hoursDifference)}:${formatCountDown(
            state.minutesDifference
          )}:${formatCountDown(state.secondsDifference)}`,
    [state, hideCounter, countdownText, preview]
  );

  useEffect(() => {
    if (state.difference > 0 && !hideCounter) {
      const interval = setTimeout(() => {
        return setState(countDownCount(date));
      }, 1000);

      return () => clearTimeout(interval);
    }
  }, [state, date, hideCounter]);

  return (
    preview
      ? <div className="countdown-preview">{countdown}</div>
      : <div className="countdown-wrapper">
          <div className="inner-wrapper">
            {!type ? (
              <img className="clock-icon" src="/icons/alarm-clock.svg" alt="alarm-clock" />
            ) : (
              <img className="clock-icon" src="/icons/alarm-clock-gray.svg" alt="alarm-clock" />
            )}
            <div className="text">
              <span>
                {state.difference > 0
                  ? countdown
                  : "Time's up!"}
              </span>
            </div>
          </div>
      </div>
  );
}
