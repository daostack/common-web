import React, { FC } from "react";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { CommonTab } from "../../constants";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { CommonTabs } from "../CommonTabs";
import styles from "./CommonManagement.module.scss";

interface CommonManagementProps {
  activeTab: CommonTab;
  circles: Governance["circles"];
  circlesMap?: (CommonMember & CirclesPermissions)["circles"]["map"];
  onTabChange: (tab: CommonTab) => void;
}

const CommonManagement: FC<CommonManagementProps> = (props) => {
  const { activeTab, circles, circlesMap, onTabChange } = props;

  return (
    <div className={styles.container}>
      <CommonTabs
        className={styles.tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <CommonMemberInfo
        className={styles.memberInfo}
        circles={circles}
        circlesMap={circlesMap}
      />
      <CommonMenuButton className={styles.commonMenuButton} />
    </div>
  );
};

export default CommonManagement;
