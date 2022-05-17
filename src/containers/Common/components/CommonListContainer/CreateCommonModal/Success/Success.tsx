import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Button,
  ButtonVariant,
  CommonShare,
} from "@/shared/components";
import {
  Colors,
  ScreenSize,
  ROUTE_PATHS,
  ShareViewType,
  SharePopupVariant,
} from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  common: Common;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const {
    common,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
  } = props;
  const history = useHistory();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonPath = ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id);

  const handleGoToCommon = () => {
    history.push(commonPath);
  };

  const title = useMemo(
    (): ReactNode =>
      isMobileView ? (
        <img
          className="create-common-confirmation-success__title-logo"
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
    <div className="create-common-confirmation-success">
      <img
        className="create-common-confirmation-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Common Created"
      />
      <h2 className="create-common-confirmation-success__title">
        Your journey starts now
      </h2>
      <p className="create-common-confirmation-success__sub-title">
        Your Common is ready. Spread the word and invite others to join you. You
        can always share it later.
      </p>
      <div className="create-common-confirmation-success__buttons">
        <CommonShare
          className="create-common-confirmation-success__button-wrapper"
          common={common}
          type={isMobileView ? ShareViewType.ModalMobile : ShareViewType.Popup}
          color={Colors.lightPurple}
          top=""
          popupVariant={SharePopupVariant.TopCenter}
        >
          <Button
            key="create-common-confirmation-success-share-btn"
            className="create-common-confirmation-success__button"
            variant={
              isMobileView ? ButtonVariant.Primary : ButtonVariant.Secondary
            }
            shouldUseFullWidth
          >
            Share now
          </Button>
        </CommonShare>
        <Button
          key="create-common-confirmation-success-go-to-common-btn"
          className="create-common-confirmation-success__continue-button"
          variant={
            isMobileView ? ButtonVariant.Secondary : ButtonVariant.Primary
          }
          onClick={handleGoToCommon}
          shouldUseFullWidth
        >
          Go to Common
        </Button>
      </div>
    </div>
  );
};

export default Success;
