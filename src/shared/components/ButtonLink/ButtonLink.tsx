import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type ButtonLinkProps = JSX.IntrinsicElements['a'];

const ButtonLink: FC<ButtonLinkProps> = (props) => {
  return (
    <a
      {...props}
      className={classNames("button-link", props.className)}
    />
  );
};

export default ButtonLink;
