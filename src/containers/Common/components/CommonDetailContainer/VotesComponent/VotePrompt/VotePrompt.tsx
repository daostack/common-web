import React, { useCallback, useState } from "react"
import { useDispatch } from "react-redux";
import { createVote } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Loader, UserAvatar } from "@/shared/components";
import { Modal } from "@/shared/components/Modal"
import { ModalProps } from "@/shared/interfaces"
import { VoteOutcome } from "@/shared/models";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  proposalId: string;
  voteType: VoteOutcome;
  avatarURL: string;
}

export default function VotePrompt({ isShowing, onClose, proposalId, voteType, avatarURL }: IProps) {
  const dispatch = useDispatch();
  const [voting, setVoting] = useState(false);
  const voteText = voteType === VoteOutcome.Approved ? "approve" : voteType === VoteOutcome.Rejected ? "reject" : "abstain";

  const handleVote = useCallback((vote: VoteOutcome) => {
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
  }, [dispatch, onClose, proposalId])

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="vote-prompt-modal">
      <div className="vote-ptompt-wrapper">
        <UserAvatar photoURL={avatarURL} className={`user-avatar ${voteText}`} />
        <h3 className={`vote-type ${voteText}`}>{voteText}</h3>
        {!voting ? (
          <>
            <span>Vote to {voteText} this proposal</span>
            <div className="actions-wrapper">
              <Button onClick={() => handleVote(voteType)} className={`vote-button ${voteText}`}>Vote to {voteText}</Button>
              <Button onClick={onClose} variant={ButtonVariant.Secondary}>Cancel</Button>
            </div>
          </>) : <div><Loader /></div>}
      </div>
    </Modal>
  )
}
