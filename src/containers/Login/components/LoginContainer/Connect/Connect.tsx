import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Loader } from "../../../../../shared/components";
import { AuthProvider, ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { selectIsAuthLoading } from "../../../../Auth/store/selectors";
import { LoginButtons } from "../LoginButtons";
import { LoginError } from "../LoginError";
import "./index.scss";

interface ConnectProps {
  hasError: boolean;
  onAuthButtonClick: (provider: AuthProvider) => void;
}

const Connect: FC<ConnectProps> = ({ hasError, onAuthButtonClick }) => {
  const screenSize = useSelector(getScreenSize());
  const isLoading = useSelector(selectIsAuthLoading());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const subTitleText = isMobileView
    ? "Connect with"
    : "Connect your account to join this Common";

  if (isLoading) {
    return (
      <div className="connect-wrapper connect-wrapper--loading">
        <Loader className="connect-wrapper__loader" />
      </div>
    );
  }

  return (
    <div className="connect-wrapper">
      <img
        className="connect-wrapper__img"
        src={
          isMobileView
            ? "/icons/social-login/account-avatar.svg"
            : "/assets/images/human-pyramid-transparent.svg"
        }
        alt={isMobileView ? "Account avatar" : "Human pyramid"}
      />
      {!isMobileView && (
        <h2 className="connect-wrapper__title">Be a part of Common</h2>
      )}
      <p
        className={classNames("connect-wrapper__sub-title", {
          "connect-wrapper__sub-title--without-margin": hasError,
        })}
      >
        {subTitleText}
      </p>
      {hasError && <LoginError className="connect-wrapper__error" />}
      <LoginButtons onLogin={onAuthButtonClick} />
      <p className="connect-wrapper__sub-text">
        By using Common you agree to the app’s
        <br />
        <a
          className="connect-wrapper__terms-of-use"
          href={require("../../../../../shared/assets/terms_and_conditions.pdf")}
          target="_blank"
          rel="noopener noreferrer"
        >
          terms of use
        </a>
      </p>
    </div>
  );
};

export default Connect;
