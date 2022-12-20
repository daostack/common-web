import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { CommonTab } from "../../constants";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { CommonTabs } from "../CommonTabs";
import styles from "./CommonManagement.module.scss";

interface CommonManagementProps {
  commonId: string;
  activeTab: CommonTab;
  isSubCommon: boolean;
  circles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
  isAuthenticated?: boolean;
  onTabChange: (tab: CommonTab) => void;
}

const CommonManagement: FC<CommonManagementProps> = (props) => {
  const {
    activeTab,
    isSubCommon,
    circles,
    commonMember,
    isAuthenticated = false,
    onTabChange,
    commonId,
  } = props;
  const circlesMap = commonMember?.circles.map;

  return (
    <div className={styles.container}>
      <CommonTabs
        className={styles.tabs}
        activeTab={activeTab}
        isAuthenticated={isAuthenticated}
        onTabChange={onTabChange}
      />
      {commonMember && (
        <>
          <CommonMemberInfo
            className={styles.memberInfo}
            circles={circles}
            circlesMap={circlesMap}
            commonId={commonId}
            commonMember={commonMember}
          />
          <CommonMenuButton
            commonMember={commonMember}
            circles={circles}
            isSubCommon={isSubCommon}
            styles={{
              container: styles.commonMenuButtonContainer,
              button: styles.commonMenuButton,
              menuItems: styles.commonMenuItems,
            }}
          />
        </>
      )}
    </div>
  );
};

export default CommonManagement;
