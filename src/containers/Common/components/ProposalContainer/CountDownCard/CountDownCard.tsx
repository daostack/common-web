import React, { FC, useLayoutEffect } from "react";
import classNames from "classnames";
import { useCountdown } from "@/shared/hooks";
import { Proposal, ProposalState } from "@/shared/models";
import { checkIsCountdownState, formatCountdownValue } from "@/shared/utils";
import { calculateVotingStatus, VotingStatus } from "./helpers";
import "./index.scss";

interface CountDownCardProps {
  className?: string;
  proposal: Proposal;
}

const CountDownCard: FC<CountDownCardProps> = (props) => {
  const { className, proposal } = props;
  const { days, hours, minutes, seconds, startCountdown } = useCountdown();
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;
  const daysText = days > 0 ? `${days} Day${days > 1 ? "s " : " "}` : "";
  const timerString = `${daysText}${formatCountdownValue(
    hours,
  )}:${formatCountdownValue(minutes)}:${formatCountdownValue(seconds)}`;
  const votingStatus = calculateVotingStatus(proposal);

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

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
      {proposal.state !== ProposalState.DISCUSSION && (
        <>
          <span className="proposal-container-countdown-card__status-title">
            Voting Status
          </span>
          <p
            className={classNames("proposal-container-countdown-card__status", {
              "proposal-container-countdown-card__status--red": [
                VotingStatus.Failing,
                VotingStatus.Rejected,
                VotingStatus.Canceled,
              ].includes(votingStatus),
            })}
          >
            {votingStatus}
          </p>
        </>
      )}
    </div>
  );
};

export default CountDownCard;
