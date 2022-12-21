import React, { FC } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { Avatar2Icon, RightArrowThinIcon } from "@/shared/icons";
import styles from "./PopoverButton.module.scss";

interface PopoverButtonProps {
  className?: string;
  circleNames: string;
  isMobileVersion?: boolean;
}

export const PopoverButton: FC<PopoverButtonProps> = (props) => {
  const { className, circleNames, isMobileVersion } = props;

  return (
    <Popover.Button
      as="div"
      className={classNames(styles.popoverButton, className)}
    >
      <div className={styles.contentWrapper}>
        {!isMobileVersion && <Avatar2Icon className={styles.avatarIcon} />}
        <div className={styles.memberInfo}>
          <span className={styles.title}>You are a member</span>
          <span className={styles.circleNames} title={circleNames}>
            {circleNames}
          </span>
        </div>
      </div>
      <RightArrowThinIcon className={styles.popoverArrowIcon} />
    </Popover.Button>
  );
};
