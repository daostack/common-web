import React, {
  ForwardRefRenderFunction,
  forwardRef,
  isValidElement,
  cloneElement,
  ReactNode,
} from "react";
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
  leftIcon?: ReactNode;
  visuallyDisabled?: boolean;
};

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props,
  ref,
) => {
  const {
    variant = ButtonVariant.PrimaryPurple,
    size = ButtonSize.Medium,
    leftIcon,
    visuallyDisabled,
    children,
    ...restProps
  } = props;
  const className = classNames(styles.button, props.className, {
    [styles.buttonDisabled]: visuallyDisabled || props.disabled,
    [styles.buttonPrimaryPurpleVariant]:
      variant === ButtonVariant.PrimaryPurple,
    [styles.buttonOutlineBlueVariant]: variant === ButtonVariant.OutlineBlue,
    [styles.buttonLargeSize]: size === ButtonSize.Large,
    [styles.buttonMediumSize]: size === ButtonSize.Medium,
    [styles.buttonSmallSize]: size === ButtonSize.Small,
    [styles.buttonXsmallSize]: size === ButtonSize.Xsmall,
  });
  let leftIconEl: ReactNode | null = null;

  if (isValidElement(leftIcon)) {
    leftIconEl = cloneElement(leftIcon, {
      ...leftIcon.props,
      className: classNames(styles.leftIcon, leftIcon.props.className),
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
      {leftIconEl}
      {children}
    </button>
  );
};

export default forwardRef(Button);
