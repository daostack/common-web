import React, { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  setLogoTitle: (shouldShowLogo: boolean) => void;
}

export default function Success({ setLogoTitle }: SuccessProps): ReactElement {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  useEffect(() => {
    if (isMobileView) {
      setLogoTitle(true);
    }
    return () => setLogoTitle(false);
  });

  return (
    <div className="create-common-success">
      <img
        className="create-common-success__image"
        src="/icons/common-creation/illustrations-full-page-launch.svg"
        alt="confirm"
      />
      <h1 className="create-common-success__title">Your journey starts now</h1>
      <p className="create-common-success__sub-title">
        Your Common is ready. Spread the word and invite others to join you. You
        can always share it later.{" "}
      </p>
      <div className="create-common-success__buttons">
        <Button
          key="create-common-success-share-btn"
          className="create-common-success__button-item"
          variant={ButtonVariant.Primary}
          shouldUseFullWidth={isMobileView}
        >
          Share now
        </Button>
        <Button
          key="create-common-success-go-to-common-btn"
          className="create-common-success__button-item"
          variant={ButtonVariant.Secondary}
          shouldUseFullWidth={isMobileView}
        >
          Go to Common
        </Button>
      </div>
    </div>
  );
}
