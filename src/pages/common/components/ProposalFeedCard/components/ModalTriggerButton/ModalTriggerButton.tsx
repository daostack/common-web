import React, { ForwardRefRenderFunction, forwardRef } from "react";
import classNames from "classnames";
import { SmallArrowIcon } from "@/shared/icons";
import styles from "./ModalTriggerButton.module.scss";

type ModalTriggerButtonProps = JSX.IntrinsicElements["button"];

const ModalTriggerButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  ModalTriggerButtonProps
> = (props, ref) => {
  const { className, children, ...restProps } = props;

  return (
    <button
      {...restProps}
      ref={ref}
      className={classNames(styles.button, className)}
    >
      {children}
      <SmallArrowIcon className={styles.icon} />
    </button>
  );
};

export default forwardRef(ModalTriggerButton);
