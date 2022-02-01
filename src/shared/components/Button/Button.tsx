import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

export enum ButtonVariant {
  Primary,
  Secondary,
  Disabled,
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
};

const Button: FC<ButtonProps> = (props) => {
  const { variant = ButtonVariant.Primary, ...restProps } = props;
  const variantToUse = restProps.disabled ? ButtonVariant.Disabled : variant;

  const className = classNames("custom-button", props.className, {
    "custom-button--primary": variantToUse === ButtonVariant.Primary,
    "custom-button--secondary": variantToUse === ButtonVariant.Secondary,
    "custom-button--disabled": variantToUse === ButtonVariant.Disabled,
  });

  return <button tabIndex={0} {...restProps} className={className} />;
};

export default Button;
