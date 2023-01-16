import React, { FC, useState } from "react";
import { useModal } from "@/shared/hooks";
import { Vote, VoteOutcome } from "@/shared/models";
import { VoteButton } from "../VoteButton";
import { VoteModal } from "./components";
import styles from "./ProposalFeedButtonContainer.module.scss";

interface ProposalFeedButtonContainerProps {
  proposalId: string;
  onVoteCreate: (vote: Vote) => void;
}

export const ProposalFeedButtonContainer: FC<
  ProposalFeedButtonContainerProps
> = (props) => {
  const { proposalId, onVoteCreate } = props;
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

  return (
    <>
      <div className={styles.container}>
        <VoteButton
          voteOutcome={VoteOutcome.Approved}
          onClick={handleVoteButtonClick}
        />
        <VoteButton
          voteOutcome={VoteOutcome.Abstained}
          onClick={handleVoteButtonClick}
        />
        <VoteButton
          voteOutcome={VoteOutcome.Rejected}
          onClick={handleVoteButtonClick}
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
