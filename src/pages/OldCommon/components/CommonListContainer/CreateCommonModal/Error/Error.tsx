import React, { useEffect, useState, FC, ReactNode } from "react";
import { Button, ButtonLink, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface ErrorProps {
  errorText: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
}

const Error: FC<ErrorProps> = (props) => {
  const {
    errorText,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
  } = props;
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleErrorDetailsButtonClick = () => {
    setShouldShowError((shouldShow) => !shouldShow);
  };

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  useEffect(() => {
    setTitle(null);
  }, [setTitle]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

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
