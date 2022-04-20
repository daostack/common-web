import React,
{
  useCallback,
  useState,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import {
  Proposal,
  ProposalState,
  VoteOutcome,
} from "@/shared/models";
import { percentage } from "@/shared/utils";
import { UserAvatar } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { selectUser } from "@/containers/Auth/store/selectors";
import VotePrompt from "./VotePrompt/VotePrompt";
import VoteBar from "./VoteBar/VoteBar";
import "./index.scss";

interface VotesComponentProps {
  proposal: Proposal;
  isCommonMember?: boolean;
  preview?: boolean;
  compact?: boolean;
  compactCard?: boolean;
}

export default function VotesComponent(
  {
    proposal,
    isCommonMember,
    preview,
    compact,
    compactCard,
  }: VotesComponentProps
) {
  const user = useSelector(selectUser());
  const { isShowing, onOpen, onClose } = useModal(false);
  const votesFor = proposal.votesFor || 0;
  const votesAgainst = proposal.votesAgainst || 0;
  const votesAbstained = proposal.votesAbstained || 0;
  const totalVotes = votesFor + votesAgainst + votesAbstained;
  const [voteType, setVoteType] = useState<VoteOutcome>();
  const userVote = proposal.votes.find((vote) => vote.voterId === user?.uid);

  const getIsVotingOptionDisabled = useCallback((votingOption: VoteOutcome | null) =>
    (
      !isCommonMember
      || (proposal.state !== ProposalState.COUNTDOWN)
      || (!!userVote && (userVote.voteOutcome === votingOption))
      || preview
    ),
    [
      isCommonMember,
      proposal.state,
      preview,
      userVote,
    ]
  );

  const handleVote = useCallback((vote: VoteOutcome) => {
    setVoteType(vote);
    onOpen();
  }, [onOpen]);

  const content = useMemo(
    () =>
      compactCard
      ? (
        <div className="votes-wrapper compact-card">
          <div className="votes-columns-container compact-card">
            <div className="vote-column approve compact-card">
              <button
                disabled={true}
                onClick={() => handleVote(VoteOutcome.Approved)}
                className="disabled compact compact-card"
              >
                <img
                  src="/icons/votes/approved.svg"
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
                  src="/icons/votes/abstained.svg"
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
                  src="/icons/votes/rejected.svg"
                  alt="vote type symbol"
                />
              </button>
              {percentage(votesAgainst, totalVotes)}%
            </div>
            </div>
            <UserAvatar
              photoURL={proposal.proposer?.photoURL ?? ""}
              className={classNames(
                "user-avatar",
                "compact-card",
                {
                  "hidden": !userVote,
                  "approve": userVote?.voteOutcome === VoteOutcome.Approved,
                  "abstain": userVote?.voteOutcome === VoteOutcome.Abstained,
                  "reject": userVote?.voteOutcome === VoteOutcome.Rejected,
                }
              )}
            />
        </div>
      )
      : (
        <div className="votes-wrapper">
          {
            !getIsVotingOptionDisabled(null)
            && <span className="what-is-your-vote">What's your vote?</span>
          }
          <div className="votes-columns-container">
            <div className="vote-column approve">
              {percentage(votesFor, totalVotes)}%
              {
                !compact
                && <VoteBar
                  votes={percentage(votesFor, totalVotes)}
                  type={VoteOutcome.Approved}
                />
              }
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Approved)}
                onClick={() => handleVote(VoteOutcome.Approved)}
                className={classNames(
                  {
                    "disabled": getIsVotingOptionDisabled(VoteOutcome.Approved),
                    "compact": compact,
                  }
                )}
              >
                {
                  (userVote?.voteOutcome === VoteOutcome.Approved)
                  ? <UserAvatar
                    photoURL={proposal.proposer?.photoURL ?? ""}
                    className="user-avatar approve"
                  />
                  : <img
                    src="/icons/votes/approved.svg"
                    alt="vote type symbol"
                  />
                }
              </button>
            </div>
            <div className="vote-column abstain">
              {percentage(votesAbstained, totalVotes)}%
              {
                !compact
                && <VoteBar
                  votes={percentage(votesAbstained, totalVotes)}
                  type={VoteOutcome.Abstained}
                />
              }
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Abstained)}
                onClick={() => handleVote(VoteOutcome.Abstained)}
                className={classNames({
                  "disabled": getIsVotingOptionDisabled(VoteOutcome.Abstained),
                  "compact": compact,
                })}
              >
                {
                  (userVote?.voteOutcome === VoteOutcome.Abstained)
                  ? <UserAvatar
                    photoURL={proposal.proposer?.photoURL ?? ""}
                    className="user-avatar abstain"
                  />
                  : <img
                    src="/icons/votes/abstained.svg"
                    alt="vote type symbol"
                  />
                }
              </button>
              </div>
            <div className="vote-column reject">
              {percentage(votesAgainst, totalVotes)}%
              {
                !compact
                && <VoteBar
                  votes={percentage(votesAgainst, totalVotes)}
                  type={VoteOutcome.Rejected}
                />
              }
              <button
                disabled={getIsVotingOptionDisabled(VoteOutcome.Rejected)}
                onClick={() => handleVote(VoteOutcome.Rejected)}
                className={classNames({
                  "disabled": getIsVotingOptionDisabled(VoteOutcome.Rejected),
                  "compact": compact,
                })}
              >
                {
                  (userVote?.voteOutcome === VoteOutcome.Rejected)
                  ? <UserAvatar
                    photoURL={proposal.proposer?.photoURL ?? ""}
                    className="user-avatar reject"
                  />
                  : <img
                    src="/icons/votes/rejected.svg"
                    alt="vote type symbol"
                  />
                }
              </button>
            </div>
          </div>
            {
              isShowing && <VotePrompt
                isShowing={isShowing}
                onClose={onClose}
                proposalId={proposal.id}
                voteType={voteType!}
                prevVote={userVote}
                avatarURL={proposal.proposer?.photoURL ?? ""}
              />
            }
        </div>
      ),
    [
      compact,
      compactCard,
      getIsVotingOptionDisabled,
      handleVote,
      isShowing,
      onClose,
      proposal.id,
      proposal.proposer,
      totalVotes,
      userVote,
      voteType,
      votesAbstained,
      votesAgainst,
      votesFor
    ]
  );

  return content;
}
