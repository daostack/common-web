import React, { FC } from "react";
import classNames from "classnames";

import "./index.scss";

interface ErrorTextProps {
  className?: string;
}

const ErrorText: FC<ErrorTextProps> = ({ children, className }) => {
  return (
    <span className={classNames("error-text", className)}>{children}</span>
  );
};

export default ErrorText;
