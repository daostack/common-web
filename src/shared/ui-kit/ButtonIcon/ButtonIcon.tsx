import React, {
  ForwardRefRenderFunction,
  forwardRef,
  isValidElement,
  cloneElement,
  ReactNode,
} from "react";
import classNames from "classnames";
import { ButtonVariant } from "../Button";
import buttonStyles from "../Button/Button.module.scss";
import styles from "./ButtonIcon.module.scss";

type ButtonIconProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
  visuallyDisabled?: boolean;
};

const ButtonIcon: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonIconProps
> = (props, ref) => {
  const {
    variant = ButtonVariant.PrimaryPurple,
    visuallyDisabled,
    children,
    ...restProps
  } = props;
  const className = classNames(
    buttonStyles.button,
    styles.button,
    props.className,
    {
      [buttonStyles.buttonDisabled]: visuallyDisabled || props.disabled,
      [buttonStyles.buttonTransparentVariant]:
        variant === ButtonVariant.Transparent,
      [buttonStyles.buttonPrimaryGrayVariant]:
        variant === ButtonVariant.PrimaryGray,
      [buttonStyles.buttonOutlineBlueVariant]:
        variant === ButtonVariant.OutlineBlue,
      [buttonStyles.buttonOutlinePinkVariant]:
        variant === ButtonVariant.OutlinePink,
      [buttonStyles.buttonOutlineDarkPinkVariant]:
        variant === ButtonVariant.OutlineDarkPink,
    },
  );
  let iconEl: ReactNode | null = null;

  if (isValidElement(children)) {
    iconEl = cloneElement(children, {
      ...children.props,
      className: classNames(buttonStyles.icon, children.props.className),
    });
  }

  return (
    <button
      ref={ref}
      tabIndex={0}
      type="button"
      {...restProps}
      className={className}
      disabled={visuallyDisabled ? undefined : props.disabled}
      aria-disabled={visuallyDisabled ? "true" : props["aria-disabled"]}
      onClick={visuallyDisabled ? undefined : props.onClick}
    >
      {iconEl}
    </button>
  );
};

export default forwardRef(ButtonIcon);
