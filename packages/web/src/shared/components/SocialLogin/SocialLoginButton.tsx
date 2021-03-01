import React from "react";

import { SocialButtonWrapper } from "./styles";

type Props = {
  provider: string;
  text: string;
  loginHandler: (provider: string) => void;

  className?: string;
};

const SocialLoginButton: React.FC<Props> = ({ provider, text, loginHandler }) => {
  return (
    <SocialButtonWrapper>
      <button className={provider} onClick={() => loginHandler(provider)}>
        <img src={`/icons/social-login/${provider}.svg`} alt={provider} />
        <span>{text}</span>
      </button>
    </SocialButtonWrapper>
  );
};

export default SocialLoginButton;
