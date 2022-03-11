import React, { FC } from "react";
import { SocialLoginButton } from "../../../../../shared/components";
import { AuthProvider } from "../../../../../shared/constants";
import "./index.scss";

const PROVIDERS = [
  AuthProvider.Apple,
  AuthProvider.Google,
  AuthProvider.Facebook,
  AuthProvider.Phone,
];

interface LoginButtonsProps {
  onLogin: (provider: AuthProvider) => void;
}

const LoginButtons: FC<LoginButtonsProps> = ({ onLogin }) => (
  <div className="login-buttons-wrapper">
    {PROVIDERS.map((provider) => (
      <SocialLoginButton
        key={provider}
        className="login-buttons-wrapper__button"
        provider={provider}
        onClick={onLogin}
      />
    ))}
  </div>
);

export default LoginButtons;
