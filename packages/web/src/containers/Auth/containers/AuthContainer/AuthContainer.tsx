import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useSelector, useDispatch } from "react-redux";

import { authentificated } from "../../store/selectors";

import { SocialLoginButton } from "../../../../shared/components";
import { AuthWrapper } from "./styles";
import { socialLogin } from "../../store/actions";

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
