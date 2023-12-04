import React, { FC } from "react";
import classNames from "classnames";
import AppleIcon from "@/shared/icons/auth/apple.icon";
import GoogleIcon from "@/shared/icons/auth/google.icon";
import PhoneIcon from "@/shared/icons/auth/phone.icon";
import { AuthProvider } from "../../constants";
import { ButtonIcon } from "../ButtonIcon";
import "./index.scss";

interface SocialLoginButtonProps {
  className?: string;
  provider: AuthProvider;
  onClick: (provider: AuthProvider) => void;
}

const SocialLoginButton: FC<SocialLoginButtonProps> = ({
  className,
  provider,
  onClick,
}) => {
  const handleClick = () => {
    onClick(provider);
  };

  return (
    <ButtonIcon
      className={classNames("social-login-button", className)}
      onClick={handleClick}
    >
      {provider === AuthProvider.Apple && <AppleIcon />}
      {provider === AuthProvider.Google && <GoogleIcon />}
      {provider === AuthProvider.Phone && <PhoneIcon />}
    </ButtonIcon>
  );
};

export default SocialLoginButton;
