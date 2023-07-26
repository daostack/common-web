import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useEligibleVoters } from "@/shared/hooks/useCases";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import {
  DateFormat,
  Proposal,
  ProposalState,
  Vote,
  VoteOutcome,
} from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { formatDate } from "@/shared/utils";
import styles from "./ImmediateProposalVoteInfo.module.scss";

interface ImmediateProposalVoteInfoProps {
  proposal: Proposal;
  userVote: Vote | null;
}

const VOTE_OUTCOME_TO_TEXT_MAP: Record<VoteOutcome, string> = {
  [VoteOutcome.Approved]: "Approved",
  [VoteOutcome.Abstained]: "Abstained",
  [VoteOutcome.Rejected]: "Rejected",
};

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor className={styles.icon} />,
  [VoteOutcome.Abstained]: <VoteAbstain className={styles.icon} />,
  [VoteOutcome.Rejected]: <VoteAgainst className={styles.icon} />,
};

export const ImmediateProposalVoteInfo = ({
  proposal,
  userVote,
}: ImmediateProposalVoteInfoProps) => {
  const user = useSelector(selectUser());
  const { loading, voters, fetchEligibleVoters, error } = useEligibleVoters();

  const isExpired =
    proposal.state === ProposalState.FAILED && proposal.votes.total === 0;

  /**
   * For now we assume that IMMEDIATE proposal is always a single vote proposal.
   * In future we would want to support more than a single vote so the logic and the UI might change.
   * See more details here https://github.com/daostack/common-backend/issues/1844.
   */
  const vote = voters && voters.length > 0 ? voters[0] : undefined;

  useEffect(() => {
    if (!isExpired) {
      fetchEligibleVoters(proposal.id);
    }
  }, [proposal.id, isExpired]);

  if (error) {
    return (
      <div>
        Oops! Something went wrong while loading the vote info. Please try again
        later.
      </div>
    );
  }

  if (!isExpired && loading) {
    return <Loader />;
  }

  const outcome = userVote?.outcome || vote?.vote?.outcome;
  const userId = userVote?.voterId || vote?.userId;
  const createdAt =
    userVote?.createdAt.seconds || vote?.vote?.createdAt.seconds;

  return (
    <div className={styles.container}>
      {outcome && VOTE_OUTCOME_TO_ICON_MAP[outcome]}
      <div className={styles.voteInfo}>
        <div className={styles.title}>
          {isExpired && "Expired"}
          {outcome &&
            `${VOTE_OUTCOME_TO_TEXT_MAP[outcome]} by ${
              user?.uid === userId ? "You" : vote?.user.displayName
            }`}
        </div>
        <div className={styles.subtitle}>
          {createdAt &&
            formatDate(new Date(createdAt * 1000), DateFormat.LongHuman)}
        </div>
      </div>
    </div>
  );
};
