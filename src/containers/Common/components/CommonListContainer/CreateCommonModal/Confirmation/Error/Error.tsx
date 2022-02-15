import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

export default function Error(): ReactElement {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="create-common-error">
      <img
        className="create-common-error__image"
        src="/icons/add-proposal/illustrations-medium-alert.svg"
        alt="confirm"
      />
      <h1 className="create-common-error__title">Something went wrong</h1>
      <p className="create-common-error__sub-title">
        This took longer than expected, please try again later
      </p>
      <Button
        key="personal-contribution-continue"
        className="create-common-error__submit-button"
        variant={ButtonVariant.Secondary}
        shouldUseFullWidth={isMobileView}
      >
        Ok
      </Button>
      <p className="create-common-error__view-details">
        View error details
      </p>
    </div>
  );
}
