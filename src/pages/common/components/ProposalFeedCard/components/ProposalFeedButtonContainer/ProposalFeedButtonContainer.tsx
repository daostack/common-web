import React, { FC } from "react";
import { VoteOutcome } from "@/shared/models";
import { VoteButton } from "../VoteButton";
import styles from "./ProposalFeedButtonContainer.module.scss";

export const ProposalFeedButtonContainer: FC = () => {
  return (
    <div className={styles.container}>
      <VoteButton voteOutcome={VoteOutcome.Approved} />
      <VoteButton voteOutcome={VoteOutcome.Abstained} />
      <VoteButton voteOutcome={VoteOutcome.Rejected} />
    </div>
  );
};
