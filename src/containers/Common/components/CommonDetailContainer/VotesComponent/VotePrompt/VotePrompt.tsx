import React, { useCallback, useState } from "react"
import { useDispatch } from "react-redux";
import { createVote, updateVote } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Loader, UserAvatar } from "@/shared/components";
import { Modal } from "@/shared/components/Modal"
import { ModalProps } from "@/shared/interfaces"
import {
  Vote,
  VoteOutcome,
  VoteAction,
} from "@/shared/models";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  proposalId: string;
  voteType: VoteOutcome;
  prevVote?: Vote;
  avatarURL: string;
}

export default function VotePrompt(
  {
    isShowing,
    onClose,
    proposalId,
    voteType,
    prevVote,
    avatarURL,
  }: IProps
) {
  const dispatch = useDispatch();
  const [voting, setVoting] = useState(false);
  const voteText = (voteType === VoteOutcome.Approved)
    ? "approve"
    : (voteType === VoteOutcome.Rejected)
      ? "reject"
      : "abstain";
  const voteAction = !prevVote
    ? VoteAction.Create
    : VoteAction.Update;

  const handleCreateVote = useCallback((vote: VoteOutcome) => {
    setVoting(true);
    dispatch(createVote.request({
      payload: { proposalId, outcome: vote },
      callback: (error) => {
        setVoting(false);
        if (error) {
          console.error(error);
          return;
        }
        onClose();
      }
    }))
  }, [dispatch, onClose, proposalId]);

  const handleUpdateVote = useCallback((vote: VoteOutcome) => {
    if (!prevVote) return;

    setVoting(true);
    dispatch(updateVote.request({
      payload: { id: prevVote.voteId, outcome: vote },
      callback: (error) => {
        setVoting(false);
        if (error) {
          console.error(error);
          return;
        }
        onClose();
      }
    }))
  }, [dispatch, onClose, prevVote]);

  const handleVote = useCallback((voteType: VoteOutcome) => {
    switch (voteAction) {
      case VoteAction.Create:
        return handleCreateVote(voteType);
      case VoteAction.Update:
        return handleUpdateVote(voteType);
    }
  }, [handleCreateVote, handleUpdateVote]);

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="vote-prompt-modal">
      <div className="vote-ptompt-wrapper">
        <UserAvatar photoURL={avatarURL} className={`user-avatar ${voteText}`} />
        <h3 className={`vote-type ${voteText}`}>{voteText}</h3>
        {!voting ? (
          <>
            <span>
              {
                (
                  () => {
                    switch (voteAction) {
                      case VoteAction.Create:
                        return `Vote to ${voteText} this proposal`;
                      case VoteAction.Update:
                        return `Change your vote to ${voteText} this proposal?`;
                      default:
                        return "";
                    }
                  }
                )()
              }
            </span>
            <div className="actions-wrapper">
              <Button onClick={() => handleVote(voteType)} className={`vote-button ${voteText}`}>Vote to {voteText}</Button>
              <Button onClick={onClose} variant={ButtonVariant.Secondary}>Cancel</Button>
            </div>
          </>) : <div><Loader /></div>}
      </div>
    </Modal>
  )
}
