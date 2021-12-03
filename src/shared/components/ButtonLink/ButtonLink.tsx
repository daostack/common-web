import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type ButtonLinkProps = JSX.IntrinsicElements['a'];

const ButtonLink: FC<ButtonLinkProps> = ({ children, ...restProps }) => {
  return (
    <a
      {...restProps}
      className={classNames("button-link", restProps.className)}
    >
      {children}
    </a>
  );
};

export default ButtonLink;
