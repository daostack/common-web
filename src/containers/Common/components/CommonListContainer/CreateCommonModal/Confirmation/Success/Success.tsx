import React, { FC } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonVariant,
  CommonShare,
  SharePopupVariant,
} from "@/shared/components";
import { Colors, ScreenSize } from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  common: Common;
  onGoToCommon: () => void;
}

const Success: FC<SuccessProps> = ({ common, onGoToCommon }) => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

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
        </CommonShare>
        <Button
          key="create-common-confirmation-success-go-to-common-btn"
          className="create-common-confirmation-success__continue-button"
          variant={
            isMobileView ? ButtonVariant.Secondary : ButtonVariant.Primary
          }
          onClick={onGoToCommon}
          shouldUseFullWidth
        >
          Go to Common
        </Button>
      </div>
    </div>
  );
};

export default Success;
