import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Loader } from "../../../../../shared/components";
import { AuthProvider, ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { selectIsAuthLoading } from "../../../../Auth/store/selectors";
import { LoginButtons } from "../LoginButtons";
import { LoginError } from "../LoginError";
import { LoginHelpButtons } from "../LoginHelpButtons";
import "./index.scss";

interface ConnectProps {
  loginModalTitle?: string;
  errorText?: string;
  isJoinRequestType: boolean;
  onAuthButtonClick: (provider: AuthProvider) => void;
}

const Connect: FC<ConnectProps> = (props) => {
  const {
    loginModalTitle = "Be a part of Common",
    errorText,
    isJoinRequestType,
    onAuthButtonClick,
  } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "login",
  });
  const screenSize = useSelector(getScreenSize());
  const isLoading = useSelector(selectIsAuthLoading());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const hasError = Boolean(errorText);

  const subTitleText =
    isMobileView && !isJoinRequestType
      ? t("mobileDescription")
      : t("description");

  if (isLoading) {
    return (
      <div className="connect-wrapper connect-wrapper--loading">
        <Loader className="connect-wrapper__loader" />
      </div>
    );
  }

  return (
    <div className="connect-wrapper">
      <div className="connect-wrapper__content-wrapper">
        {(!isMobileView || !isJoinRequestType) && (
          <img
            className="connect-wrapper__img"
            src={
              isMobileView
                ? "/icons/social-login/account-avatar.svg"
                : "/assets/images/human-pyramid-transparent.svg"
            }
            alt={isMobileView ? "Account avatar" : "Human pyramid"}
          />
        )}
        {(!isMobileView || isJoinRequestType) && (
          <h2
            className={classNames("connect-wrapper__title", {
              "connect-wrapper__title--small":
                isMobileView && isJoinRequestType,
            })}
          >
            {loginModalTitle}
          </h2>
        )}
        <p
          className={classNames("connect-wrapper__sub-title", {
            "connect-wrapper__sub-title--without-margin":
              hasError && (!isMobileView || !isJoinRequestType),
          })}
        >
          {subTitleText}
        </p>
        {hasError && (
          <LoginError className="connect-wrapper__error">
            {errorText}
          </LoginError>
        )}
        <LoginButtons onLogin={onAuthButtonClick} />
        <p
          className={classNames("connect-wrapper__sub-text", {
            "connect-wrapper__sub-text--join-request":
              isMobileView && isJoinRequestType,
          })}
        >
          <Trans t={t} i18nKey="termsText">
            By using Common you agree to the app’s
            <a
              className="connect-wrapper__terms-of-use"
              href={require("../../../../../shared/assets/terms_and_conditions.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              terms of use
            </a>
          </Trans>
        </p>
      </div>
      {isMobileView && !isJoinRequestType && <LoginHelpButtons />}
    </div>
  );
};

export default Connect;
