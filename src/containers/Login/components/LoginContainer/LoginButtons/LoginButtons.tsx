import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { SocialLoginButton } from "../../../../../shared/components";
import { AuthProvider } from "../../../../../shared/constants";
import { socialLogin } from "../../../../Auth/store/actions";
import "./index.scss";

const LoginButtons: FC = () => {
  const dispatch = useDispatch();

  const handleSocialLogin = (provider: AuthProvider) => {
    dispatch(socialLogin.request(provider));
  };

  return (
    <div className="login-buttons-wrapper">
      <SocialLoginButton
        className="login-buttons-wrapper__button"
        provider={AuthProvider.Apple}
        onClick={handleSocialLogin}
      />
      <SocialLoginButton
        className="login-buttons-wrapper__button"
        provider={AuthProvider.Google}
        onClick={handleSocialLogin}
      />
      <SocialLoginButton
        className="login-buttons-wrapper__button"
        provider={AuthProvider.Facebook}
        onClick={handleSocialLogin}
      />
      <SocialLoginButton
        className="login-buttons-wrapper__button"
        provider={AuthProvider.Phone}
        onClick={handleSocialLogin}
      />
    </div>
  );
};

export default LoginButtons;
