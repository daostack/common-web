import React, { useState, FC } from "react";
import { Button, ButtonLink, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface ErrorProps {
  errorText: string;
  onFinish: () => void;
}

const Error: FC<ErrorProps> = ({ errorText, onFinish }) => {
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleErrorDetailsButtonClick = () => {
    setShouldShowError((shouldShow) => !shouldShow);
  };

  return (
    <div className="create-common-confirmation-error">
      <img
        className="create-common-confirmation-error__image"
        src="/icons/add-proposal/illustrations-medium-alert.svg"
        alt="Something went wrong"
      />
      <h2 className="create-common-confirmation-error__title">
        Something went wrong
      </h2>
      <p className="create-common-confirmation-error__sub-title">
        This took longer than expected, please try again later
      </p>
      <Button
        key="personal-contribution-continue"
        className="create-common-confirmation-error__submit-button"
        variant={ButtonVariant.Secondary}
        onClick={onFinish}
        shouldUseFullWidth
      >
        OK
      </Button>
      <ButtonLink
        className="create-common-confirmation-error__view-details"
        onClick={handleErrorDetailsButtonClick}
      >
        View error details
      </ButtonLink>
      {shouldShowError && (
        <span className="create-common-confirmation-error__error">
          {errorText}
        </span>
      )}
    </div>
  );
};

export default Error;
