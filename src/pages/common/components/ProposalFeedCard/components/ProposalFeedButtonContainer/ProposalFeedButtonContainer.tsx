import React, { FC } from "react";
import { GovernanceActions } from "@/shared/constants";
import {
  CirclesPermissions,
  CommonMember,
  Proposal,
  ProposalState,
  Vote,
  VoteOutcome,
} from "@/shared/models";
import { VoteButton } from "../VoteButton";
import styles from "./ProposalFeedButtonContainer.module.scss";

interface ProposalFeedButtonContainerProps {
  userVote?: Vote | null;
  proposal: Proposal;
  commonMember?: (CommonMember & CirclesPermissions) | null;
}

export const ProposalFeedButtonContainer: FC<
  ProposalFeedButtonContainerProps
> = (props) => {
  const { userVote, proposal, commonMember } = props;
  const isVotingAllowed =
    !userVote &&
    proposal.state === ProposalState.VOTING &&
    commonMember &&
    commonMember.allowedActions[GovernanceActions.CREATE_VOTE] &&
    proposal.global.weights.some(
      ({ circles }) => commonMember.circles.bin & circles.bin,
    );

  if (!isVotingAllowed) {
    return null;
  }

  return (
    <div className={styles.container}>
      <VoteButton voteOutcome={VoteOutcome.Approved} />
      <VoteButton voteOutcome={VoteOutcome.Abstained} />
      <VoteButton voteOutcome={VoteOutcome.Rejected} />
    </div>
  );
};
