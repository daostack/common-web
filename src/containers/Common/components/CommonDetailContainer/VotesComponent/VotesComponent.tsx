import React, { useCallback, useState } from "react";
import { Proposal, VoteOutcome } from "../../../../../shared/models";
import { percentage } from "@/shared/utils";
import { useModal } from "@/shared/hooks";
import VotePrompt from "./VotePrompt/VotePrompt";
import "./index.scss";

interface VotesComponentProps {
  proposal: Proposal;
  type?: string;
}

export default function VotesComponent({ proposal, type }: VotesComponentProps) {
  const { isShowing, onOpen, onClose } = useModal(false);
  const votesFor = proposal.votesFor || 0;
  const votesAgainst = proposal.votesAgainst || 0;
  const votesAbstained = proposal.votesAbstained || 0;
  const totalVotes = votesFor + votesAgainst + votesAbstained;
  const [voteType, setVoteType] = useState<VoteOutcome>();

  const handleVote = useCallback((vote: VoteOutcome) => {
    setVoteType(vote);
    onOpen();
  }, [onOpen])

  return (
    <div className="votes-wrapper">
      <div className="vote-column approve">
        {percentage(votesFor, totalVotes)}%
        <button onClick={() => handleVote(VoteOutcome.APPROVED)}>approve</button>
      </div>
      <div className="vote-column abstain">
        {percentage(votesAbstained, totalVotes)}%
        <button onClick={() => handleVote(VoteOutcome.ABSTAINED)}>abstain</button>
      </div>
      <div className="vote-column reject">
        {percentage(votesAgainst, totalVotes)}%
        <button onClick={() => handleVote(VoteOutcome.REJECTED)}>reject</button>
      </div>

      {isShowing && (
        <VotePrompt
          isShowing={isShowing}
          onClose={onClose}
          proposalId={proposal.id}
          voteType={voteType!} />)}
    </div>
  );
}
