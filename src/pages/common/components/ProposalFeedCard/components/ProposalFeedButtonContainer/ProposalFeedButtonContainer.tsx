import React, { FC, useState } from "react";
import classNames from "classnames";
import { useModal } from "@/shared/hooks";
import { ResolutionType, Vote, VoteOutcome } from "@/shared/models";
import { VoteButton } from "../VoteButton";
import { VoteModal } from "./components";
import styles from "./ProposalFeedButtonContainer.module.scss";

interface ProposalFeedButtonContainerProps {
  proposalId: string;
  onVoteCreate: (vote: Vote) => void;
  resolutionType: ResolutionType;
}

export const ProposalFeedButtonContainer: FC<
  ProposalFeedButtonContainerProps
> = (props) => {
  const { proposalId, onVoteCreate, resolutionType } = props;
  const [voteOutcome, setVoteOutcome] = useState<VoteOutcome | null>(null);
  const {
    isShowing: isVoteModalOpen,
    onOpen: onVoteModalOpen,
    onClose: onVoteModalClose,
  } = useModal(false);

  const handleVoteButtonClick = (voteOutcome: VoteOutcome) => {
    setVoteOutcome(voteOutcome);
    onVoteModalOpen();
  };

  const handleVoteCreationFinish = (vote: Vote) => {
    onVoteModalClose();
    onVoteCreate(vote);
  };

  const isImmediate = resolutionType === ResolutionType.IMMEDIATE;

  return (
    <>
      <div
        className={classNames(styles.container, {
          [styles.containerImmediate]: isImmediate,
        })}
      >
        <VoteButton
          className={styles.buttonApprove}
          voteOutcome={VoteOutcome.Approved}
          onClick={handleVoteButtonClick}
          resolutionType={resolutionType}
        />
        {!isImmediate && (
          <VoteButton
            className={styles.buttonAbstain}
            voteOutcome={VoteOutcome.Abstained}
            onClick={handleVoteButtonClick}
          />
        )}
        <VoteButton
          className={styles.buttonReject}
          voteOutcome={VoteOutcome.Rejected}
          onClick={handleVoteButtonClick}
          resolutionType={resolutionType}
        />
      </div>
      {voteOutcome && (
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={onVoteModalClose}
          proposalId={proposalId}
          voteOutcome={voteOutcome}
          onFinish={handleVoteCreationFinish}
        />
      )}
    </>
  );
};
