import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

export enum ButtonVariant {
  Primary,
  Secondary,
  SecondaryPurple,
  Disabled,
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
  shouldUseFullWidth?: boolean;
  shadowed?: boolean;
};

const Button: FC<ButtonProps> = (props) => {
  const {
    variant = ButtonVariant.Primary,
    shouldUseFullWidth = false,
    shadowed = false,
    ...restProps
  } = props;
  const variantToUse = restProps.disabled ? ButtonVariant.Disabled : variant;

  const className = classNames("custom-button", props.className, {
    "custom-button--full-width": shouldUseFullWidth,
    "custom-button--shadowed": shadowed,
    "custom-button--primary": variantToUse === ButtonVariant.Primary,
    "custom-button--secondary": variantToUse === ButtonVariant.Secondary,
    "custom-button--secondary-purple":
      variantToUse === ButtonVariant.SecondaryPurple,
    "custom-button--disabled": variantToUse === ButtonVariant.Disabled,
  });

  return <button tabIndex={0} {...restProps} className={className} />;
};

export default Button;
