import React, { FC } from "react";
import { VoteOutcome } from "@/shared/models";
import { VoteButton } from "../VoteButton";
import styles from "./ProposalFeedButtonContainer.module.scss";

export const ProposalFeedButtonContainer: FC = () => {
  return (
    <div className={styles.container}>
      <VoteButton
        className={styles.buttonApprove}
        voteOutcome={VoteOutcome.Approved}
      />
      <VoteButton
        className={styles.buttonAbstain}
        voteOutcome={VoteOutcome.Abstained}
      />
      <VoteButton
        className={styles.buttonReject}
        voteOutcome={VoteOutcome.Rejected}
      />
    </div>
  );
};
