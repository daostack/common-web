import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant, CommonShare } from "@/shared/components";
import {
  Colors,
  ScreenSize,
  ShareViewType,
  SharePopupVariant,
} from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  common: Common;
  onFinish: () => void;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const {
    common,
    onFinish,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
  } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const title = useMemo(
    (): ReactNode =>
      isMobileView ? (
        <img
          className="update-common-confirmation-success__title-logo"
          src="/icons/logo.svg"
          alt="Common Logo"
        />
      ) : null,
    [isMobileView]
  );

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  return (
    <div className="update-common-confirmation-success">
      <img
        className="update-common-confirmation-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Common Created"
      />
      <h2 className="update-common-confirmation-success__title">
        Your journey starts now
      </h2>
      <p className="update-common-confirmation-success__sub-title">
        Your Common is ready. Spread the word and invite others to join you. You
        can always share it later.
      </p>
      <div className="update-common-confirmation-success__buttons">
        <CommonShare
          className="update-common-confirmation-success__button-wrapper"
          common={common}
          type={isMobileView ? ShareViewType.ModalMobile : ShareViewType.Popup}
          color={Colors.lightPurple}
          top=""
          popupVariant={SharePopupVariant.TopCenter}
        >
          <Button
            key="update-common-confirmation-success-share-btn"
            className="update-common-confirmation-success__button"
            variant={
              isMobileView ? ButtonVariant.Primary : ButtonVariant.Secondary
            }
            shouldUseFullWidth
          >
            Share now
          </Button>
        </CommonShare>
        <Button
          key="update-common-confirmation-success-go-to-common-btn"
          className="update-common-confirmation-success__continue-button"
          variant={
            isMobileView ? ButtonVariant.Secondary : ButtonVariant.Primary
          }
          onClick={onFinish}
          shouldUseFullWidth
        >
          Go to Common
        </Button>
      </div>
    </div>
  );
};

export default Success;
