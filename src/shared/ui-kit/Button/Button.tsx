import React, {
  ForwardRefRenderFunction,
  forwardRef,
  isValidElement,
  cloneElement,
  ReactNode,
} from "react";
import classNames from "classnames";
import { Loader } from "../Loader";
import { LoaderColor } from "../Loader/Loader";
import styles from "./Button.module.scss";

export enum ButtonVariant {
  PrimaryGray = "primary-gray",
  PrimaryPurple = "primary-purple",
  OutlineBlue = "outline-blue",
  Warning = "warning",
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
  loading?: boolean;
  loaderColor?: LoaderColor;
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
    loading,
    loaderColor = LoaderColor.Default,
    children,
    ...restProps
  } = props;
  const className = classNames(styles.button, props.className, {
    [styles.buttonDisabled]: visuallyDisabled || props.disabled,
    [styles.buttonPrimaryGrayVariant]: variant === ButtonVariant.PrimaryGray,
    [styles.buttonPrimaryPurpleVariant]:
      variant === ButtonVariant.PrimaryPurple,
    [styles.buttonOutlineBlueVariant]: variant === ButtonVariant.OutlineBlue,
    [styles.buttonWarningVariant]: variant === ButtonVariant.Warning,
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
      {loading ? (
        <Loader color={loaderColor} className={styles.buttonLoader} />
      ) : (
        children
      )}
    </button>
  );
};

export default forwardRef(Button);
