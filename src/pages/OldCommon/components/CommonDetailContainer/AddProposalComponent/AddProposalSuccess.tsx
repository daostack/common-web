import React from "react";

export const AdProposalSuccess = ({
  closePopup,
  openProposal,
}: {
  closePopup: () => void;
  openProposal: () => void;
}) => {
  return (
    <div className="add-proposal-success-wrapper">
      <img
        src="/icons/add-proposal/illustrations-full-page-send.svg"
        alt="confirm"
      />
      <div className="add-proposal-success-title">Your proposal is live!</div>
      <div className="add-proposal-success-description">
        The Common members will now discuss the proposal and <br /> vote to
        accept or reject it. You will be notified when the <br /> voting ends.
      </div>
      <div className="actions-wrapper">
        <button
          className="button-blue white"
          type="button"
          onClick={closePopup}
        >
          Back to Common
        </button>
        <button className="button-blue" type="button" onClick={openProposal}>
          View proposal
        </button>
      </div>
    </div>
  );
};

export default AdProposalSuccess;
