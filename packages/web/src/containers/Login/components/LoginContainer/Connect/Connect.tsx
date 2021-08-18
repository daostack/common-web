import React from "react";
import "./index.scss";
import "../../../containers/LoginContainer/index.scss";
import { SocialLoginButton } from "../../../../../shared/components";
import { socialLogin } from "../../../../Auth/store/actions";
import { useDispatch } from "react-redux";

const Connect = () => {
  const dispatch = useDispatch();

  const socialLoginHandler = (provider: string) => {
    dispatch(socialLogin.request(provider));
  };

  return (
    <div className="connect-wrapper">
      <img src="/assets/images/people-pyramid.svg" alt="people pyramid" height="200px" />
      <span className="title">Be a part of Common</span>
      <span className="sub-text">Connect your account to join this Common</span>
      <div className="login-buttons-wrapper">
        <SocialLoginButton provider="google" text="Continue with Google" loginHandler={socialLoginHandler} />
        <SocialLoginButton provider="apple" text="Continue with Apple" loginHandler={socialLoginHandler} />
      </div>
      <span className="sub-text">
        By using Common you agree to the app’s&nbsp;
        <a
          className="terms-of-use"
          href={require("../../../../../shared/assets/terms_and_conditions.pdf")}
          target="_blank"
          rel="noopener noreferrer"
        >
          terms of use
        </a>
      </span>
    </div>
  );
};

export default Connect;
