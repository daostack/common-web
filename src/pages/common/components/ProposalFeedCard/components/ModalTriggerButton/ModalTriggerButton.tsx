import React, { FC } from "react";
import classNames from "classnames";
import { SmallArrowIcon } from "@/shared/icons";
import styles from "./ModalTriggerButton.module.scss";

interface ModalTriggerButtonProps {
  className?: string;
  onClick?: () => void;
}

export const ModalTriggerButton: FC<ModalTriggerButtonProps> = (props) => {
  const { className, children } = props;

  return (
    <button className={classNames(styles.button, className)}>
      {children}
      <SmallArrowIcon className={styles.icon} />
    </button>
  );
};
