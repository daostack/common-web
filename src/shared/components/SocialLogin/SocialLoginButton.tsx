import React from "react";
import "./index.scss";

type Props = {
  provider: string;
  loginHandler: (provider: string) => void;
};

const SocialLoginButton: React.FC<Props> = ({ provider, loginHandler }) => {
  return (
    <button className="connect-button" onClick={() => loginHandler(provider)}>
      <img className="connect-button__img" src={`/icons/social-login/${provider}.svg`} alt={provider} />
    </button>
  );
};

export default SocialLoginButton;
