import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "../ButtonIcon";
import { AuthProvider } from "../../constants";
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
      <img
        className="social-login-button__img"
        src={`/icons/social-login/${provider}.svg`}
        alt={`Sign in using ${provider}`}
      />
    </ButtonIcon>
  );
};

export default SocialLoginButton;
