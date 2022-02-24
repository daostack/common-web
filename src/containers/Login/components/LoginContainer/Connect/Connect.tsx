import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LoginButtons } from "../LoginButtons";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { ScreenSize } from "../../../../../shared/constants";
import { LoginError } from "../LoginError";
import "./index.scss";

const Connect = () => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [error, setError] = useState(false);

  const subTitleText = isMobileView
    ? "Connect with"
    : "Connect your account to join this Common";

  return (
    <div className="connect-wrapper">
      <img
        className="connect-wrapper__img"
        src={
          isMobileView
            ? "/icons/social-login/account-avatar.svg"
            : "/assets/images/human-pyramid.svg"
        }
        alt={isMobileView ? "account_avatar" : "human pyramid"}
      />
      {isMobileView ? null : (
        <h2 className="connect__title">Be a part of Common</h2>
      )}
      <p className="connect__sub-title">{subTitleText}</p>
      {isMobileView ? null : (
        <div
          className="connect__error-message"
          style={
            error ? { margin: "0.5rem 0 1.5rem" } : { marginBottom: "2.625rem" }
          }
        >
          {error ? <LoginError /> : null}
        </div>
      )}
      <LoginButtons />
      <p className="connect__sub-text">
        By using Common you agree to the app’s&nbsp; <br />
        <a
          className="connect__terms-of-use"
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
