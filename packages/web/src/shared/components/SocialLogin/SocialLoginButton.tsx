import React from "react";
import "./index.scss";

type Props = {
  provider: string;
  text: string;
  loginHandler: (provider: string) => void;
};

const SocialLoginButton: React.FC<Props> = ({ provider, text, loginHandler }) => {
  return (
    <button className="connect-button" onClick={() => loginHandler(provider)}>
      <img src={`/icons/social-login/${provider}.svg`} alt={provider} />
      <span>{text}</span>
    </button>
  );
};

export default SocialLoginButton;
