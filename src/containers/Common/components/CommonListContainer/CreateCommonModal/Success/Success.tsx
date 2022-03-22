import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Button,
  ButtonVariant,
  Share,
  SharePopupVariant,
} from "@/shared/components";
import { Colors, ScreenSize, ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getSharingURL } from "@/shared/utils";
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
  const sharingURL = getSharingURL(commonPath);

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
        <Share
          className="create-common-confirmation-success__button-wrapper"
          url={sharingURL}
          type={isMobileView ? "modal" : "popup"}
          color={Colors.lightPurple}
          top=""
          popupVariant={SharePopupVariant.topCenter}
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
        </Share>
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
