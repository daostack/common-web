import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import styles from "./CommonTopNavigation.module.scss";

interface CommonTopNavigationProps {
  commonMember: (CommonMember & CirclesPermissions) | null;
  circles: Governance["circles"];
  isSubCommon: boolean;
  commonId: string;
}

const CommonTopNavigation: FC<CommonTopNavigationProps> = (props) => {
  const { commonMember, circles, isSubCommon, commonId } = props;
  const circlesMap = commonMember?.circles.map;
  const commonAction = commonMember ? (
    <>
      <CommonMemberInfo
        className={styles.memberInfo}
        circles={circles}
        circlesMap={circlesMap}
        commonId={commonId}
        commonMember={commonMember}
        isMobileVersion
      />
      <CommonMenuButton
        commonMember={commonMember}
        circles={circles}
        isSubCommon={isSubCommon}
        isMobileVersion
      />
    </>
  ) : null;

  return (
    <TopNavigation className={styles.container}>
      <TopNavigationOpenSidenavButton />
      {commonAction}
    </TopNavigation>
  );
};

export default CommonTopNavigation;
