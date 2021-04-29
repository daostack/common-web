/* eslint-disable import/order */
import { push } from "connected-react-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocialLoginButton } from "../../../../shared/components";
import { socialLogin } from "../../store/actions";
import { authentificated } from "../../store/selectors";
import { AuthWrapper } from "./styles";

const AuthContainer = () => {
  const isAuthorized = useSelector(authentificated());

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(push("/"));
    }
  }, [isAuthorized, dispatch]);

  const socialLoginHandler = (provider: string) => {
    dispatch(socialLogin.request(provider));
  };

  return (
    <AuthWrapper>
      <div className="inner-wrapper">
        <div className="button-wrapper">
          <SocialLoginButton provider="google" text="Continue with Google" loginHandler={socialLoginHandler} />

          <SocialLoginButton provider="apple" text="Continue with Apple" loginHandler={socialLoginHandler} />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AuthContainer;
