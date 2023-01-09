import React, { FC } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { Avatar2Icon, RightArrowThinIcon } from "@/shared/icons";
import styles from "./PopoverButton.module.scss";

interface PopoverButtonProps {
  className?: string;
  circleNames: string;
  isMobileVersion?: boolean;
  pendingCircleName?: string;
}

export const PopoverButton: FC<PopoverButtonProps> = (props) => {
  const { className, circleNames, isMobileVersion, pendingCircleName } = props;

  return (
    <Popover.Button
      as="div"
      className={classNames(styles.popoverButton, className)}
    >
      <div className={styles.contentWrapper}>
        {!isMobileVersion && <Avatar2Icon className={styles.avatarIcon} />}
        <div className={styles.memberInfo}>
          <span className={styles.title}>
            {pendingCircleName ? "Join circle request..." : "You are a member"}
          </span>
          <span className={styles.circleNames} title={circleNames}>
            {circleNames} {pendingCircleName ? `-> ${pendingCircleName}` : ""}
          </span>
        </div>
      </div>
      <RightArrowThinIcon className={styles.popoverArrowIcon} />
    </Popover.Button>
  );
};
