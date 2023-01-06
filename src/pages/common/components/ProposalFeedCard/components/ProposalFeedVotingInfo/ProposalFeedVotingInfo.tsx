import React, { useLayoutEffect } from "react";
import classNames from "classnames";
import { useCountdown } from "@/shared/hooks";
import { Proposal, ProposalState } from "@/shared/models";
import { checkIsCountdownState } from "@/shared/utils";
import { VotingInfo } from "../VotingInfo";
import styles from "./ProposalFeedVotingInfo.module.scss";

export interface ProposalFeedVotingInfoProps {
  proposal: Proposal;
  votersCount: number;
  votedCount: number;
  voters: string;
  voteStatus: string;
}

export const ProposalFeedVotingInfo: React.FC<ProposalFeedVotingInfoProps> = (
  props,
) => {
  const { proposal, votersCount, votedCount, voters, voteStatus } = props;
  const { startCountdown, timer } = useCountdown();
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

  return (
    <div className={styles.container}>
      {checkIsCountdownState(proposal) && (
        <VotingInfo
          label={
            proposal.state === ProposalState.DISCUSSION
              ? "Voting starts in"
              : "Time to Vote"
          }
        >
          <p className={classNames(styles.text, styles.timeToVote)}>{timer}</p>
        </VotingInfo>
      )}
      <VotingInfo label="Votes">
        <p className={classNames(styles.text, styles.votes)}>
          {votedCount}/{votersCount}
        </p>
      </VotingInfo>
      <VotingInfo label="Voters">
        <p className={classNames(styles.text, styles.voters)}>{voters}</p>
      </VotingInfo>
      <VotingInfo label="Status">
        <p className={classNames(styles.text, styles.status)}>{voteStatus}</p>
      </VotingInfo>
    </div>
  );
};
