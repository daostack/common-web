import React, { ForwardRefRenderFunction, forwardRef } from "react";
import classNames from "classnames";
import "./index.scss";

type ButtonIconProps = JSX.IntrinsicElements["button"];

const ButtonIcon: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonIconProps
> = (props, ref) => {
  return (
    <button
      ref={ref}
      tabIndex={0}
      type="button"
      {...props}
      className={classNames("button-icon", props.className)}
    />
  );
};

export default forwardRef(ButtonIcon);
