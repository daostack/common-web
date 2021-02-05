import React from "react";
import { Provider } from "react-social-login";
import SocialButton from "./SocialButton";
import config from "../../../config";

import { SocialButtonWrapper } from "./styles";

type Props = {
  provider: Provider;
  text: string;
  onSuccess: (data: any) => void;
  onFailure: (err: any) => void;
  className?: string;
};

const SocialLoginButton: React.FC<Props> = ({ provider, text, onSuccess, onFailure }) => {
  const clientId = config.socialLoginClientId[provider];

  return clientId ? (
    <SocialButtonWrapper>
      <SocialButton
        provider={provider}
        appId={clientId}
        onLoginSuccess={onSuccess}
        onLoginFailure={onFailure}
        className={provider}
      >
        <button className={provider}>
          <img src={`/icons/socialLogin/${provider}.svg`} alt={provider} />
          <span>{text}</span>
        </button>
      </SocialButton>
    </SocialButtonWrapper>
  ) : null;
};

export default SocialLoginButton;
