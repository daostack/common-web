import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

export enum ButtonVariant {
  PrimaryPurple = "primary-purple",
  OutlineBlue = "outline-blue",
}

export enum ButtonSize {
  Large = "large",
  Medium = "medium",
  Small = "small",
  Xsmall = "xsmall",
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button: FC<ButtonProps> = (props) => {
  const {
    variant = ButtonVariant.PrimaryPurple,
    size = ButtonSize.Medium,
    ...restProps
  } = props;
  const className = classNames(styles.button, props.className, {
    [styles.buttonOutlineBlueVariant]: variant === ButtonVariant.OutlineBlue,
    [styles.buttonLargeSize]: size === ButtonSize.Large,
    [styles.buttonMediumSize]: size === ButtonSize.Medium,
    [styles.buttonSmallSize]: size === ButtonSize.Small,
    [styles.buttonXsmallSize]: size === ButtonSize.Xsmall,
  });

  return (
    <button tabIndex={0} type="button" {...restProps} className={className} />
  );
};

export default Button;
