import React, { FC } from "react";
import classNames from "classnames";
import { Avatar2Icon } from "@/shared/icons";
import styles from "./PendingJoinInfo.module.scss";

interface PendingJoinInfoProps {
  className?: string;
  isMobileVersion?: boolean;
}

const PendingJoinInfo: FC<PendingJoinInfoProps> = (props) => {
  const { className, isMobileVersion } = props;

  return (
    <div className={classNames(styles.container, className)}>
      {!isMobileVersion && <Avatar2Icon className={styles.avatarIcon} />}
      <div className={styles.content}>
        <span className={styles.title}>Join request in process...</span>
        <span className={styles.status}>Pending</span>
      </div>
    </div>
  );
};

export default PendingJoinInfo;
