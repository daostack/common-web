import React, { FC } from "react";
import classNames from "classnames";
import { Avatar2Icon } from "@/shared/icons";
import { CommonMember, Governance } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import styles from "./CommonMemberInfo.module.scss";

interface CommonMemberInfoProps {
  className?: string;
  circles: Governance["circles"];
  circlesMap?: CommonMember["circles"]["map"];
}

const CommonMemberInfo: FC<CommonMemberInfoProps> = (props) => {
  const { className, circles, circlesMap } = props;
  const governanceCircles = Object.values(circles || {});
  const circleIds = Object.values(circlesMap || {});
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles,
    circleIds,
  );
  const circleNames = getCirclesWithHighestTier(filteredByIdCircles)
    .map(({ name }) => name)
    .join(", ");

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
