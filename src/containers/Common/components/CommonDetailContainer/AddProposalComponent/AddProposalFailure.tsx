import React from "react";

export const AdProposalFailure = () => {
  return (
    <div className="add-proposal-failure-wrapper">
      <img
        src="/icons/add-proposal/illustrations-medium-alert.svg"
        alt="confirm"
      />
      <div className="add-proposal-failure-title">Something went wrong</div>
      <div className="add-proposal-failure-description">
        This took longer than expected, please try again later
      </div>
      <div className="actions-wrapper">
        <button className="button-blue white" type="submit">
          Ok
        </button>
        <div className="error-details">View error details</div>
      </div>
    </div>
  );
};

export default AdProposalFailure;
