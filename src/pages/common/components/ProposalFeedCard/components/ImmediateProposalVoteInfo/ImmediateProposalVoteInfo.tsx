import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useEligibleVoters } from "@/shared/hooks/useCases";
import {
  DateFormat,
  Proposal,
  ProposalState,
  VoteOutcome,
} from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { formatDate } from "@/shared/utils";
import styles from "./ImmediateProposalVoteInfo.module.scss";

interface ImmediateProposalVoteInfoProps {
  proposal: Proposal;
}

const VOTE_OUTCOME_TO_TEXT_MAP: Record<VoteOutcome, string> = {
  [VoteOutcome.Approved]: "Approved",
  [VoteOutcome.Abstained]: "Abstained",
  [VoteOutcome.Rejected]: "Rejected",
};

export const ImmediateProposalVoteInfo = ({
  proposal,
}: ImmediateProposalVoteInfoProps) => {
  const user = useSelector(selectUser());
  const { loading, voters, fetchEligibleVoters, error } = useEligibleVoters();

  const isExpired =
    proposal.state === ProposalState.FAILED && proposal.votes.total === 0;

  const vote = useMemo(() => {
    if (voters && voters.length > 0) {
      return voters[0];
    }
  }, [voters]);

  useEffect(() => {
    if (!isExpired) {
      fetchEligibleVoters(proposal.id);
    }
  }, [proposal.id, isExpired]);

  if (!isExpired && loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {isExpired
          ? "Expired"
          : `${vote?.vote && VOTE_OUTCOME_TO_TEXT_MAP[vote.vote.outcome]} by ${
              user?.uid === vote?.userId ? "You" : vote?.user.displayName
            }`}
      </div>
      <div className={styles.subtitle}>
        {vote?.vote &&
          formatDate(
            new Date(vote.vote.createdAt.seconds * 1000),
            DateFormat.LongHuman,
          )}
      </div>
    </div>
  );
};
