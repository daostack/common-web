import React, { useLayoutEffect } from "react";
import classNames from "classnames";
import firebase from "firebase/app";
import { useCountdown } from "@/shared/hooks";
import { VotingInfo } from "../VotingInfo";
import styles from "./ProposalFeedVotingInfo.module.scss";

export interface ProposalFeedVotingInfoProps {
  expirationTimestamp: firebase.firestore.Timestamp;
  votersCount: number;
  votedCount: number;
  voters: string;
  voteStatus: string;
}

export const ProposalFeedVotingInfo: React.FC<ProposalFeedVotingInfoProps> = ({
  expirationTimestamp,
  votersCount,
  votedCount,
  voters,
  voteStatus,
}) => {
  const { startCountdown, timer } = useCountdown();

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

  return (
    <div className={styles.container}>
      <VotingInfo label="Time to Vote">
        <p className={classNames(styles.text, styles.timeToVote)}>{timer}</p>
      </VotingInfo>
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
