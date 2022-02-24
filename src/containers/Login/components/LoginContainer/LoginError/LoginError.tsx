import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface LoginErrorProps {
  className?: string;
}

const LoginError: FC<LoginErrorProps> = ({ className }) => (
  <span className={classNames("login-error", className)}>
    There was an error logging you in. Please try again or try connecting a
    different account.
  </span>
);

export default LoginError;
