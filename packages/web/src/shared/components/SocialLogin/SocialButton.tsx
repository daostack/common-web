import React, { Component } from "react";
import SocialLogin, { Props } from "react-social-login";

class SocialButton extends Component<Props> {
  render() {
    const { children, triggerLogin, triggerLogout, ...props } = this.props;

    return (
      <div onClick={triggerLogin} {...props}>
        {children}
      </div>
    );
  }
}

export default SocialLogin(SocialButton);
