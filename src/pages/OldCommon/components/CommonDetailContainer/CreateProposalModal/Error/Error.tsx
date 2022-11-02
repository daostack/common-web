import React, { useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonLink, ButtonVariant, Modal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import { useCreateProposalContext } from "../context";
import "./index.scss";

interface ErrorProps {
  errorText: string;
  onFinish: () => void;
}

const Error: FC<ErrorProps> = (props) => {
  const { errorText, onFinish } = props;
  const { setTitle, setOnGoBack } = useCreateProposalContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleErrorDetailsButtonClick = () => {
    setShouldShowError((shouldShow) => !shouldShow);
  };

  useEffect(() => {
    setOnGoBack();
  }, [setOnGoBack]);

  useEffect(() => {
    if (!isMobileView) {
      setTitle(null);
    }
  }, [isMobileView, setTitle]);

  const contentEl = (
    <section className="error-create-proposal-modal">
      <img
        className="error-create-proposal-modal__image"
        src="/icons/add-proposal/illustrations-medium-alert.svg"
        alt="Something went wrong"
      />
      <h3 className="error-create-proposal-modal__title">
        Something went wrong
      </h3>
      <Button
        key="personal-contribution-continue"
        className="error-create-proposal-modal__submit-button"
        variant={ButtonVariant.Secondary}
        onClick={onFinish}
        shouldUseFullWidth
      >
        OK
      </Button>
      {errorText && (
        <>
          <ButtonLink
            className="error-create-proposal-modal__view-details"
            onClick={handleErrorDetailsButtonClick}
          >
            View error details
          </ButtonLink>
          {shouldShowError && (
            <span className="error-create-proposal-modal__error">
              {errorText}
            </span>
          )}
        </>
      )}
    </section>
  );

  return isMobileView ? (
    <Modal isShowing onClose={onFinish} type={ModalType.MobilePopUp}>
      {contentEl}
    </Modal>
  ) : (
    contentEl
  );
};

export default Error;
