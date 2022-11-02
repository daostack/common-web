import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createVote, updateVote } from "@/pages/OldCommon/store/actions";
import { Button, ButtonVariant, Loader, UserAvatar } from "@/shared/components";
import { Modal } from "@/shared/components/Modal";
import { ModalProps } from "@/shared/interfaces";
import { Vote, VoteOutcome, VoteAction } from "@/shared/models";
import { CalculatedVotes } from "@/shared/models/governance/proposals";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  proposalId: string;
  proposalVotes: CalculatedVotes;
  voteType: VoteOutcome;
  prevVote?: Vote;
  avatarURL: string;
  onVoteUpdate: (vote: Vote) => void;
}

const emptyFunction = () => {};

export default function VotePrompt({
  isShowing,
  onClose,
  proposalId,
  proposalVotes,
  voteType,
  prevVote,
  avatarURL,
  onVoteUpdate,
}: IProps) {
  const dispatch = useDispatch();
  const [voting, setVoting] = useState(false);
  const voteText =
    voteType === VoteOutcome.Approved
      ? "approve"
      : voteType === VoteOutcome.Rejected
      ? "reject"
      : "abstain";
  const voteAction = !prevVote ? VoteAction.Create : VoteAction.Update;

  const handleCreateVote = useCallback(
    (vote: VoteOutcome) => {
      setVoting(true);
      dispatch(
        createVote.request({
          payload: {
            proposalVotes,
            votePayload: {
              proposalId,
              outcome: vote,
            },
          },
          callback: (error, vote) => {
            setVoting(false);
            if (error || !vote) {
              console.error(error);
              return;
            }
            onVoteUpdate(vote);
            onClose();
          },
        }),
      );
    },
    [dispatch, onClose, proposalId, proposalVotes, onVoteUpdate],
  );

  const handleUpdateVote = useCallback(
    (vote: VoteOutcome) => {
      if (!prevVote) return;

      setVoting(true);
      dispatch(
        updateVote.request({
          payload: {
            proposalVotes,
            votePayload: {
              proposalId,
              outcome: vote,
            },
          },
          callback: (error, vote) => {
            setVoting(false);
            if (error || !vote) {
              console.error(error);
              return;
            }
            onVoteUpdate(vote);
            onClose();
          },
        }),
      );
    },
    [dispatch, onClose, prevVote, proposalId, proposalVotes, onVoteUpdate],
  );

  const handleVote = useCallback(
    (voteType: VoteOutcome) => {
      switch (voteAction) {
        case VoteAction.Create:
          return handleCreateVote(voteType);
        case VoteAction.Update:
          return handleUpdateVote(voteType);
      }
    },
    [handleCreateVote, handleUpdateVote, voteAction],
  );

  return (
    <Modal
      isShowing={isShowing}
      onClose={voting ? emptyFunction : onClose}
      hideCloseButton={voting}
      className="vote-prompt-modal"
    >
      <div className="vote-ptompt-wrapper">
        <UserAvatar
          photoURL={avatarURL}
          className={`user-avatar ${voteText}`}
        />
        <h3 className={`vote-type ${voteText}`}>{voteText}</h3>
        {!voting ? (
          <>
            <span>
              {(() => {
                switch (voteAction) {
                  case VoteAction.Create:
                    return `Vote to ${voteText} this proposal`;
                  case VoteAction.Update:
                    return `Change your vote to ${voteText} this proposal?`;
                  default:
                    return "";
                }
              })()}
            </span>
            <div className="actions-wrapper">
              <Button
                onClick={() => handleVote(voteType)}
                className={`vote-button ${voteText}`}
              >
                Vote to {voteText}
              </Button>
              <Button onClick={onClose} variant={ButtonVariant.Secondary}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </Modal>
  );
}
