import React from "react";

export const AddProposalConfirm = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  return (
    <div className="app-proposal-confirm-wrapper">
      <img
        src="/icons/add-proposal/illustrations-full-page-funds.svg"
        alt="confirm"
      />
      <div className="add-proposal-confirm-title">Use of Funds</div>
      <div className="add-proposal-confirm-description">
        If your proposal is accepted, the funds requested would be allocated to
        you for <br /> the proposed purpose and you will be responsible to
        ensure that the funding is <br /> used adequately. All Common members
        are volunteers and can not be paid by the <br /> Common for their
        services.
      </div>
      <div className="add-proposal-confirm-checkboxes">
        <div className="checkboxes-title">You may only use the funds to:</div>

        <div className="confirm-checkboxes">
          <div className="checkbox">
            <img src="/icons/check.png" alt="" />
            <span>
              Pay properly registered businesses, with a valid tax withholding
              exemption, for their products or services.
            </span>
          </div>
          <div className="checkbox">
            <img src="/icons/check.png" alt="" />
            <span>Contribute to registered non-profits.</span>
          </div>
        </div>
        <div className="confirm-notes-wrapper">
          After claiming the funds, you will be required to submit invoices
          and/or receipts for <br /> each expense sponsored by the Common.
        </div>
      </div>
      <div className="action-wrapper">
        <button className="button-blue" onClick={onConfirm}>
          I agree with the above statement
        </button>
      </div>
    </div>
  );
};
