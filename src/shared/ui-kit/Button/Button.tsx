import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

export enum ButtonVariant {
  PrimaryPurple = "primary-purple",
  OutlineBlue = "outline-blue",
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
};

const Button: FC<ButtonProps> = (props) => {
  const { variant = ButtonVariant.PrimaryPurple, ...restProps } = props;
  const className = classNames(styles.button, props.className, {
    [styles.buttonOutlineBlueVariant]: variant === ButtonVariant.OutlineBlue,
  });

  return (
    <button tabIndex={0} type="button" {...restProps} className={className} />
  );
};

export default Button;
