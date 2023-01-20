import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { useCommonDataContext } from "../../providers";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { PendingJoinInfo } from "../PendingJoinInfo";
import styles from "./CommonTopNavigation.module.scss";

interface CommonTopNavigationProps {
  commonMember: (CommonMember & CirclesPermissions) | null;
  circles: Governance["circles"];
  isSubCommon: boolean;
  commonId: string;
}

const CommonTopNavigation: FC<CommonTopNavigationProps> = (props) => {
  const { commonMember, circles, isSubCommon, commonId } = props;
  const { isJoinPending } = useCommonDataContext();
  const circlesMap = commonMember?.circles.map;
  const centralEl = commonMember ? (
    <CommonMemberInfo
      circles={circles}
      circlesMap={circlesMap}
      commonId={commonId}
      commonMember={commonMember}
      isMobileVersion
    />
  ) : isJoinPending ? (
    <PendingJoinInfo isMobileVersion />
  ) : null;
  const rightEl = commonMember ? (
    <CommonMenuButton
      commonMember={commonMember}
      circles={circles}
      isSubCommon={isSubCommon}
      isMobileVersion
    />
  ) : (
    <div className={styles.emptyBlock} />
  );

  return (
    <TopNavigation className={styles.container}>
      <TopNavigationOpenSidenavButton />
      {centralEl}
      {rightEl}
    </TopNavigation>
  );
};

export default CommonTopNavigation;
