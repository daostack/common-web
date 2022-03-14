import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Proposal, ProposalState, VoteOutcome } from "@/shared/models";
import { percentage } from "@/shared/utils";
import { useModal } from "@/shared/hooks";
import VotePrompt from "./VotePrompt/VotePrompt";
import VoteBar from "./VoteBar/VoteBar";
import "./index.scss";

interface VotesComponentProps {
  proposal: Proposal;
  isCommonMember: boolean;
  preview?: boolean;
  compact?: boolean;
}

export default function VotesComponent({ proposal, isCommonMember, preview, compact }: VotesComponentProps) {
  const { isShowing, onOpen, onClose } = useModal(false);
  const votesFor = proposal.votesFor || 0;
  const votesAgainst = proposal.votesAgainst || 0;
  const votesAbstained = proposal.votesAbstained || 0;
  const totalVotes = votesFor + votesAgainst + votesAbstained;
  const [voteType, setVoteType] = useState<VoteOutcome>();

  const votingDisabled = !isCommonMember || proposal.state !== ProposalState.COUNTDOWN || preview;

  const handleVote = useCallback((vote: VoteOutcome) => {
    setVoteType(vote);
    onOpen();
  }, [onOpen]);

  return (
    <div className="votes-wrapper">
      <div className="vote-column approve">
        {percentage(votesFor, totalVotes)}%
        {!compact && <VoteBar votes={percentage(votesFor, totalVotes)} type={VoteOutcome.Approved} />}
        <button disabled={votingDisabled} onClick={() => handleVote(VoteOutcome.Approved)} className={classNames({ "disabled": votingDisabled, "compact": compact })}>
          <img src="/icons/votes/approved.svg" alt="vote type symbol" />
        </button>
      </div>
      <div className="vote-column abstain">
        {percentage(votesAbstained, totalVotes)}%
        {!compact && <VoteBar votes={percentage(votesAbstained, totalVotes)} type={VoteOutcome.Abstained} />}
        <button disabled={votingDisabled} onClick={() => handleVote(VoteOutcome.Abstained)} className={classNames({ "disabled": votingDisabled, "compact": compact })}>
          <img src="/icons/votes/abstained.svg" alt="vote type symbol" />
        </button>
      </div>
      <div className="vote-column reject">
        {percentage(votesAgainst, totalVotes)}%
        {!compact && <VoteBar votes={percentage(votesAgainst, totalVotes)} type={VoteOutcome.Rejected} />}
        <button disabled={votingDisabled} onClick={() => handleVote(VoteOutcome.Rejected)} className={classNames({ "disabled": votingDisabled, "compact": compact })}>
          <img src="/icons/votes/rejected.svg" alt="vote type symbol" />
        </button>
      </div>

      {isShowing && (
        <VotePrompt
          isShowing={isShowing}
          onClose={onClose}
          proposalId={proposal.id}
          voteType={voteType!}
          avatarURL={proposal.proposer?.photoURL ?? ""} />)}
    </div>
  );
}
