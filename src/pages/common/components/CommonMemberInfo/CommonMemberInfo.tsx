import React, { FC } from "react";
import classNames from "classnames";
import { Avatar2Icon } from "@/shared/icons";
import styles from "./CommonMemberInfo.module.scss";

interface CommonMemberInfoProps {
  className?: string;
}

const CommonMemberInfo: FC<CommonMemberInfoProps> = (props) => {
  const { className } = props;
  const circleNames = "Circle 1";

  return (
    <div className={classNames(styles.container, className)}>
      <Avatar2Icon className={styles.avatarIcon} />
      <div className={styles.memberInfo}>
        <span className={styles.title}>You are a member</span>
        <span className={styles.circleNames} title={circleNames}>
          {circleNames}
        </span>
      </div>
    </div>
  );
};

export default CommonMemberInfo;
