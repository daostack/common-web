import React, { FC, useLayoutEffect } from "react";
import classNames from "classnames";
import { useCountdown } from "@/shared/hooks";
import { Proposal, ProposalState } from "@/shared/models";
import { checkIsCountdownState, formatCountdownValue } from "@/shared/utils";
import { calculateProposalStatus } from "./helpers";
import "./index.scss";

interface CountDownCardProps {
  className?: string;
  date?: Date | null;
  proposal: Proposal;
  memberCount: number;
}

const CountDownCard: FC<CountDownCardProps> = (props) => {
  const { className, date, proposal, memberCount } = props;
  const { days, hours, minutes, seconds, startCountdown } = useCountdown();
  const daysText = days > 0 ? `${days} Day${days > 1 ? "s " : " "}` : "";
  const timerString = `${daysText}${formatCountdownValue(
    hours
  )}:${formatCountdownValue(minutes)}:${formatCountdownValue(seconds)}`;

  useLayoutEffect(() => {
    if (date) {
      startCountdown(date);
    }
  }, [startCountdown, date]);

  return (
    <div className={classNames("proposal-container-countdown-card", className)}>
      {checkIsCountdownState(proposal) && (
        <>
          <span className="proposal-container-countdown-card__time-title">
            {proposal.state === ProposalState.DISCUSSION
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
        {calculateProposalStatus(proposal, memberCount)}
      </p>
    </div>
  );
};

export default CountDownCard;
