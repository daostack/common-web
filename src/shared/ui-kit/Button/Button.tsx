import React, {
  ComponentType,
  ForwardRefRenderFunction,
  forwardRef,
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

type IconComponentType = ComponentType<{
  className?: string;
}>;

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconComponentType;
  visuallyDisabled?: boolean;
};

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props,
  ref,
) => {
  const {
    variant = ButtonVariant.PrimaryPurple,
    size = ButtonSize.Medium,
    leftIcon: LeftIcon,
    visuallyDisabled,
    children,
    ...restProps
  } = props;
  const className = classNames(styles.button, props.className, {
    [styles.buttonDisabled]: visuallyDisabled || props.disabled,
    [styles.buttonOutlineBlueVariant]: variant === ButtonVariant.OutlineBlue,
    [styles.buttonLargeSize]: size === ButtonSize.Large,
    [styles.buttonMediumSize]: size === ButtonSize.Medium,
    [styles.buttonSmallSize]: size === ButtonSize.Small,
    [styles.buttonXsmallSize]: size === ButtonSize.Xsmall,
  });

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
      {LeftIcon && <LeftIcon className={styles.leftIcon} />}
      {children}
    </button>
  );
};

export default forwardRef(Button);
