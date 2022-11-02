import React, { FC, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createVote } from "@/pages/Common/store/actions";
import { Modal, Loader, Button } from "@/shared/components";
import { Proposal, Vote, VoteOutcome } from "@/shared/models";

interface VotingPopupProps {
  proposal: Proposal;
  setVote: (voteOutcome: Vote) => void;
  isShowing: boolean;
  onClose: () => void;
}

export const VotingPopup: FC<VotingPopupProps> = ({
  proposal,
  setVote,
  isShowing,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [voting, setVoting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateVote = useCallback(
    (voteOutcome: VoteOutcome) => {
      setVoting(true);

      dispatch(
        createVote.request({
          payload: {
            proposalVotes: proposal.votes,
            votePayload: {
              proposalId: proposal.id,
              outcome: voteOutcome,
            },
            shouldWaitForVoteToBeApplied: false,
          },
          callback: (error, vote) => {
            setVoting(false);

            if (error || !vote) {
              return;
            }

            setVote(vote);
            setIsSuccess(true);
          },
        }),
      );
    },
    [dispatch, onClose, proposal.id, proposal.votes, setVote, setVoting],
  );

  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="voting-popup__success-details-wrapper">
          <img
            className="voting-popup__approved-illustration"
            src="/assets/images/membership-request-created.svg"
            alt="Success"
          />
          <p>Your vote was submitted! It might take some time to load</p>
          <Button
            className="voting-popup__success-button"
            onClick={onClose}
            shouldUseFullWidth
          >
            OK
          </Button>
        </div>
      );
    }

    return (
      <>
        <img
          src="/icons/votes/popup-illustration.svg"
          alt="popup-pic"
          className="voting-popup__illustration"
        />
        <div className="voting-popup__title">Please vote</div>
        {voting ? (
          <div className="voting-popup__loader-wrapper">
            <Loader />
          </div>
        ) : (
          <ul className="voting-popup__vote-options-container">
            <li
              key="approve"
              className="voting-popup__vote-options-item"
              onClick={() => handleCreateVote(VoteOutcome.Approved)}
            >
              <img src="/icons/votes/approved-old.svg" alt="vote type symbol" />
            </li>
            <li
              key="abstain"
              className="voting-popup__vote-options-item"
              onClick={() => handleCreateVote(VoteOutcome.Abstained)}
            >
              <img
                src="/icons/votes/abstained-old.svg"
                alt="vote type symbol"
              />
            </li>
            <li
              key="reject"
              className="voting-popup__vote-options-item"
              onClick={() => handleCreateVote(VoteOutcome.Rejected)}
            >
              <img src="/icons/votes/rejected-old.svg" alt="vote type symbol" />
            </li>
          </ul>
        )}
      </>
    );
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={voting ? () => {} : onClose}
      className="voting-popup__modal-wrapper"
    >
      <div className="voting-popup">{renderContent()}</div>
    </Modal>
  );
};
