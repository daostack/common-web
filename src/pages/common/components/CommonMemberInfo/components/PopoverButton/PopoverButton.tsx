import React, { FC } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { Avatar2Icon } from "@/shared/icons";
import styles from "./PopoverButton.module.scss";

interface PopoverButtonProps {
  className?: string;
  circleNames: string;
}

export const PopoverButton: FC<PopoverButtonProps> = (props) => {
  const { className, circleNames } = props;

  return (
    <Popover.Button
      as="div"
      className={classNames(styles.popoverButton, className)}
    >
      <Avatar2Icon className={styles.avatarIcon} />
      <div className={styles.memberInfo}>
        <span className={styles.title}>You are a member</span>
        <span className={styles.circleNames} title={circleNames}>
          {circleNames}
        </span>
      </div>
    </Popover.Button>
  );
};
