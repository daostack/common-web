import React from "react";
import { useDispatch } from "react-redux";
import { SocialLoginButton } from "../../../../../shared/components";
import { socialLogin } from "../../../../Auth/store/actions";
import "./index.scss";

const LoginButtonsList = () => {
  const dispatch = useDispatch();

  const socialLoginHandler = (provider: string) => {
    dispatch(socialLogin.request(provider));
  };

  return (
    <div className="login-buttons-wrapper">
      <SocialLoginButton provider="apple" loginHandler={socialLoginHandler} />
      <SocialLoginButton provider="google" loginHandler={socialLoginHandler} />
      {/*<SocialLoginButton*/}
      {/*  provider="facebook"*/}
      {/*  loginHandler={socialLoginHandler}*/}
      {/*/>*/}
      {/*<SocialLoginButton provider="phone" loginHandler={socialLoginHandler} />*/}
    </div>
  );
};

export default LoginButtonsList;
