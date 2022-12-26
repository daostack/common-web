import React from "react";
import { VoteType } from "@/shared/models";
import { VoteButton } from "../VoteButton";
import styles from "./ProposalFeedButtonContainer.module.scss";

export const ProposalFeedButtonContainer = () => {
  return (
    <div className={styles.container}>
      <VoteButton voteType={VoteType.Approve} />
      <VoteButton voteType={VoteType.Abstain} />
      <VoteButton voteType={VoteType.Reject} />
    </div>
  );
};
