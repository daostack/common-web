import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface LoginErrorProps {
  className?: string;
}

const LoginError: FC<LoginErrorProps> = ({ className, children }) => (
  <span className={classNames("login-error", className)}>{children}</span>
);

export default LoginError;
