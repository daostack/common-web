import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  governance: Governance;
  onFinish: () => void;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const {
    governance,
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
          className="update-governance-confirmation-success__title-logo"
          src="/icons/logo.svg"
          alt="Common Logo"
        />
      ) : null,
    [isMobileView],
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
    <div className="update-governance-confirmation-success">
      <img
        className="update-governance-confirmation-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Rules updated"
      />
      <p className="update-governance-confirmation-success__sub-title">
        You successfully updated your Common's rules!
      </p>
      <div className="update-governance-confirmation-success__buttons">
        <Button
          key="update-governance-confirmation-success-go-to-common-btn"
          className="update-governance-confirmation-success__continue-button"
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
