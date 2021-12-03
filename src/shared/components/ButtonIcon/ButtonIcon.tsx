import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

type ButtonIconProps = JSX.IntrinsicElements['button'];

const ButtonIcon: FC<ButtonIconProps> = (props) => {
  return (
    <button
      {...props}
      className={classNames("button-icon", props.className)}
    />
  );
};

export default ButtonIcon;
