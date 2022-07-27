import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import {
  CommonMember,
  Proposal,
  ProposalState,
  VoteOutcome,
} from "@/shared/models";
import { percentage } from "@/shared/utils";
import { UserAvatar } from "@/shared/components";
import { GovernanceActions } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { selectUser } from "@/containers/Auth/store/selectors";
import VotePrompt from "./VotePrompt/VotePrompt";
import VoteBar from "./VoteBar/VoteBar";
import "./index.scss";
import { useProposalUserVote } from "@/containers/Common/hooks";

interface VotesComponentProps {
  proposal: Proposal;
  commonMember?: CommonMember | null;
  preview?: boolean;
  compact?: boolean;
  compactCard?: boolean;
}

export default function VotesComponent({
  proposal,
  preview,
  compact,
  compactCard,
  commonMember,
}: VotesComponentProps) {
  const user = useSelector(selectUser());
  const { isShowing, onOpen, onClose } = useModal(false);
  const votesFor = proposal.votes.approved || 0;
  const votesAgainst = proposal.votes.rejected || 0;
  const votesAbstained = proposal.votes.abstained || 0;
  const totalVotes = votesFor + votesAgainst + votesAbstained;
  const [voteType, setVoteType] = useState<VoteOutcome>();
  const {
    fetched: isVoteFetched,
    data: userVote,
    fetchProposalVote,
    setVote,
  } = useProposalUserVote();

  useEffect(() => {
    fetchProposalVote(proposal.id);
  }, [fetchProposalVote, proposal.id]);

  const isVotingAllowed = useMemo(
    () =>
      commonMember &&
      commonMember.allowedActions[GovernanceActions.CREATE_VOTE] &&
      proposal.global.weights.some(
        ({ circles }) => commonMember.circles & circles
      ),
    [commonMember, proposal]
  );

  const getIsVotingOptionDisabled = useCallback(
    (votingOption: VoteOutcome | null) =>
      !isVotingAllowed ||
      proposal.state !== ProposalState.VOTING ||
      (userVote && userVote.outcome === votingOption) ||
      preview,
    [proposal.state, isVotingAllowed, preview, userVote]
  );

  const handleVote = useCallback(
    (vote: VoteOutcome) => {
      setVoteType(vote);
      onOpen();
    },
    [onOpen]
  );

  const content = useMemo(
    () =>
      compactCard ? (
        <div className="votes-wrapper compact-card">
          <div className="votes-columns-container compact-card">
            <div className="vote-column approve compact-card">
              <button
                disabled={true}
                onClick={() => handleVote(VoteOutcome.Approved)}
                className="disabled compact compact-card"
              >
                <img
                  src="/icons/votes/approved-rounded.svg"
                  alt="vote type symbol"
                />
              </button>
              {percentage(votesFor, totalVotes)}%
            </div>
            <div className="vote-column abstain compact-card">
              <button
                disabled={true}
                onClick={() => handleVote(VoteOutcome.Abstained)}
                className="disabled compact compact-card"
              >
                <img
                  src="/icons/votes/abstained-rounded.svg"
                  alt="vote type symbol"
                />
              </button>
              {percentage(votesAbstained, totalVotes)}%
            </div>
            <div className="vote-column abstain compact-card">
              <button
                disabled={true}
                onClick={() => handleVote(VoteOutcome.Rejected)}
                className="disabled compact compact-card"
              >
                <img
                  src="/icons/votes/rejected-rounded.svg"
                  alt="vote type symbol"
                />
              </button>
              {percentage(votesAgainst, totalVotes)}%
            </div>
          </div>
          <UserAvatar
            photoURL={user?.photoURL ?? ""}
            className={classNames("user-avatar", "compact-card", {
              hidden: !userVote,
              approve: userVote?.outcome === VoteOutcome.Approved,
              abstain: userVote?.outcome === VoteOutcome.Abstained,
              reject: userVote?.outcome === VoteOutcome.Rejected,
            })}
          />
        </div>
      ) : (
        <div className="votes-wrapper">
          {!getIsVotingOptionDisabled(null) && (
            <span className="what-is-your-vote">What's your vote?</span>
          )}
          <div className="votes-columns-container">
            <div className={classNames("vote-column", { "voted": userVote?.outcome === VoteOutcome.Approved })}>
              {percentage(votesFor, totalVotes)}%
              {!compact && (
                <VoteBar
                  votes={percentage(votesFor, totalVotes)}
                  type={VoteOutcome.Approved}
                />
              )}
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Approved)}
                onClick={() => handleVote(VoteOutcome.Approved)}
                className={classNames({
                  disabled: getIsVotingOptionDisabled(VoteOutcome.Approved),
                  compact: compact,
                })}
              >
                <img src="/icons/votes/approved.svg" alt="vote type symbol" />
              </button>
            </div>
            <div className={classNames("vote-column", { "voted": userVote?.outcome === VoteOutcome.Abstained })}>
              {percentage(votesAbstained, totalVotes)}%
              {!compact && (
                <VoteBar
                  votes={percentage(votesAbstained, totalVotes)}
                  type={VoteOutcome.Abstained}
                />
              )}
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Abstained)}
                onClick={() => handleVote(VoteOutcome.Abstained)}
                className={classNames({
                  disabled: getIsVotingOptionDisabled(VoteOutcome.Abstained),
                  compact: compact,
                })}
              >
                <img
                  src="/icons/votes/abstained.svg"
                  alt="vote type symbol"
                />
              </button>
            </div>
            <div className={classNames("vote-column", { "voted": userVote?.outcome === VoteOutcome.Rejected })}>
              {percentage(votesAgainst, totalVotes)}%
              {!compact && (
                <VoteBar
                  votes={percentage(votesAgainst, totalVotes)}
                  type={VoteOutcome.Rejected}
                />
              )}
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Rejected)}
                onClick={() => handleVote(VoteOutcome.Rejected)}
                className={classNames({
                  disabled: getIsVotingOptionDisabled(VoteOutcome.Rejected),
                  compact: compact,
                })}
              >
                <img src="/icons/votes/rejected.svg" alt="vote type symbol" />
              </button>
            </div>
          </div>
          {isShowing && isVoteFetched && (
            <VotePrompt
              isShowing={isShowing}
              onClose={onClose}
              proposalId={proposal.id}
              proposalVotes={proposal.votes}
              voteType={voteType!}
              prevVote={userVote!}
              avatarURL={user?.photoURL ?? ""}
              onVoteUpdate={setVote}
            />
          )}
        </div>
      ),
    [
      compact,
      compactCard,
      getIsVotingOptionDisabled,
      isVoteFetched,
      user,
      handleVote,
      isShowing,
      onClose,
      proposal.id,
      totalVotes,
      userVote,
      voteType,
      votesAbstained,
      votesAgainst,
      votesFor,
    ]
  );

  return content;
}
