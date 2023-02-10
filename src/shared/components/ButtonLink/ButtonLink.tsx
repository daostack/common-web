import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type ButtonLinkProps = JSX.IntrinsicElements["a"] & {
  disabled?: boolean;
};

const ButtonLink: FC<ButtonLinkProps> = (props) => {
  const { children, disabled = false, ...restProps } = props;

  return (
    <a
      {...restProps}
      className={classNames("button-link", restProps.className)}
      onClick={!disabled ? restProps.onClick : undefined}
    >
      {children}
    </a>
  );
};

export default ButtonLink;
