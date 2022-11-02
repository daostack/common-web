import React, { useState } from "react";
import { ButtonLink } from "@/shared/components";

export const AdProposalFailure = ({
  closePopup,
  errorMessage,
}: {
  closePopup: () => void;
  errorMessage?: string;
}) => {
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleErrorDetailsButtonClick = () => {
    setShouldShowError((shouldShow) => !shouldShow);
  };

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
        <button
          className="button-blue white"
          type="submit"
          onClick={closePopup}
        >
          Ok
        </button>
        {errorMessage && (
          <div className="add-proposal-failure-wrapper__error-wrapper">
            <ButtonLink
              className="add-proposal-failure-wrapper__view-error-button"
              onClick={handleErrorDetailsButtonClick}
            >
              View error details
            </ButtonLink>
            {shouldShowError && (
              <span className="add-proposal-failure-wrapper__error">
                {errorMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdProposalFailure;
