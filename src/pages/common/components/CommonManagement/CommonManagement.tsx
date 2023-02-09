import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { CommonTab } from "../../constants";
import { useCommonDataContext } from "../../providers";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { CommonTabs } from "../CommonTabs";
import { PendingJoinInfo } from "../PendingJoinInfo";
import styles from "./CommonManagement.module.scss";

interface CommonManagementProps {
  commonId: string;
  activeTab: CommonTab;
  allowedTabs: CommonTab[];
  isSubCommon: boolean;
  circles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
  onTabChange: (tab: CommonTab) => void;
}

const CommonManagement: FC<CommonManagementProps> = (props) => {
  const {
    activeTab,
    allowedTabs,
    isSubCommon,
    circles,
    commonMember,
    onTabChange,
    commonId,
  } = props;
  const { isJoinPending } = useCommonDataContext();
  const circlesMap = commonMember?.circles.map;

  return (
    <div className={styles.container}>
      <CommonTabs
        className={styles.tabs}
        activeTab={activeTab}
        allowedTabs={allowedTabs}
        onTabChange={onTabChange}
      />
      {!commonMember && isJoinPending && (
        <PendingJoinInfo className={styles.memberInfo} />
      )}
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
