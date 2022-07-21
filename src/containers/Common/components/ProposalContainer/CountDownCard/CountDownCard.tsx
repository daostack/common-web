import React, { FC, useLayoutEffect } from "react";
import classNames from "classnames";
import { useCountdown } from "@/shared/hooks";
import { ProposalState } from "@/shared/models";
import { checkIsCountdownState, formatCountdownValue } from "@/shared/utils";
import { calculateProposalStatus } from "./helpers";
import "./index.scss";

interface CountDownCardProps {
  className?: string;
  date: Date;
  state: ProposalState;
}

const CountDownCard: FC<CountDownCardProps> = (props) => {
  const { className, date, state } = props;
  const { days, hours, minutes, seconds, startCountdown } = useCountdown();
  const daysText = days > 0 ? `${days} Day${days > 1 ? "s " : " "}` : "";
  const timerString = `${daysText}${formatCountdownValue(
    hours
  )}:${formatCountdownValue(minutes)}:${formatCountdownValue(seconds)}`;

  useLayoutEffect(() => {
    startCountdown(date);
  }, [startCountdown, date]);

  return (
    <div className={classNames("proposal-container-countdown-card", className)}>
      {checkIsCountdownState({ state }) && (
        <>
          <span className="proposal-container-countdown-card__time-title">
            {state === ProposalState.DISCUSSION
              ? "Voting starts in"
              : "Time to Vote"}
          </span>
          <p className="proposal-container-countdown-card__timer">
            {timerString}
          </p>
        </>
      )}
      <span className="proposal-container-countdown-card__status-title">
        Voting Status
      </span>
      <p className="proposal-container-countdown-card__status">
        {calculateProposalStatus(state)}
      </p>
    </div>
  );
};

export default CountDownCard;
