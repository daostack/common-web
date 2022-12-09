import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { CommonMenuButton } from "../CommonMenuButton";
import styles from "./CommonTopNavigation.module.scss";

interface CommonTopNavigationProps {
  commonMember: (CommonMember & CirclesPermissions) | null;
  circles: Governance["circles"];
  isSubCommon: boolean;
}

const CommonTopNavigation: FC<CommonTopNavigationProps> = (props) => {
  const { commonMember, circles, isSubCommon } = props;
  const commonAction = commonMember ? (
    <CommonMenuButton
      commonMember={commonMember}
      circles={circles}
      isSubCommon={isSubCommon}
      isMobileVersion
      styles={{ container: styles.rightItem }}
    />
  ) : null;

  return (
    <TopNavigation className={styles.container}>
      <TopNavigationOpenSidenavButton />
      {commonAction}
    </TopNavigation>
  );
};

export default CommonTopNavigation;
