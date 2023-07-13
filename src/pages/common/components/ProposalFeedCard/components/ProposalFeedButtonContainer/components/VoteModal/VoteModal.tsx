import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createVote } from "@/pages/OldCommon/store/actions";
import { Modal } from "@/shared/components";
import { Vote, VoteOutcome } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import styles from "./VoteModal.module.scss";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  voteOutcome: VoteOutcome;
  onFinish?: (vote: Vote) => void;
}

const VOTE_OUTCOME_TO_TEXT_MAP: Record<VoteOutcome, string> = {
  [VoteOutcome.Approved]: "Vote for",
  [VoteOutcome.Abstained]: "Abstain",
  [VoteOutcome.Rejected]: "Vote against",
};

export const VoteModal: FC<VoteModalProps> = (props) => {
  const { isOpen, onClose, proposalId, voteOutcome, onFinish } = props;
  const dispatch = useDispatch();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = () => {
    setIsVoting(true);

    dispatch(
      createVote.request({
        payload: {
          votePayload: {
            proposalId,
            outcome: voteOutcome,
          },
          shouldWaitForVoteToBeApplied: false,
        },
        callback: (error, vote) => {
          setIsVoting(false);

          if (!error && vote && onFinish) {
            onFinish(vote);
          }
        },
      }),
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setIsVoting(false);
    }
  }, [isOpen]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isVoting ? emptyFunction : onClose}
      title={
        <div className={styles.modalTitleWrapper}>
          <h3 className={styles.modalTitle}>Are you sure?</h3>
        </div>
      }
      hideCloseButton={isVoting}
      styles={{
        header: styles.modalHeader,
      }}
    >
      <div className={styles.modalContent}>
        <p className={styles.description}>
          Once your vote is submitted, it cannot be changed or undone.
        </p>
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonsWrapper}>
            <Button
              className={styles.button}
              variant={ButtonVariant.OutlineDarkPink}
              onClick={onClose}
              disabled={isVoting}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.PrimaryPink}
              className={styles.button}
              onClick={handleVote}
              disabled={isVoting}
            >
              {VOTE_OUTCOME_TO_TEXT_MAP[voteOutcome]}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
