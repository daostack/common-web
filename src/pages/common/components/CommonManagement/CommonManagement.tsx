import React, { FC } from "react";
import { CommonTab } from "../../constants";
import { CommonMemberInfo } from "../CommonMemberInfo";
import { CommonMenuButton } from "../CommonMenuButton";
import { CommonTabs } from "../CommonTabs";
import styles from "./CommonManagement.module.scss";

interface CommonManagementProps {
  activeTab: CommonTab;
  onTabChange: (tab: CommonTab) => void;
}

const CommonManagement: FC<CommonManagementProps> = (props) => {
  const { activeTab, onTabChange } = props;

  return (
    <div className={styles.container}>
      <CommonTabs
        className={styles.tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <CommonMemberInfo className={styles.memberInfo} />
      <CommonMenuButton className={styles.commonMenuButton} />
    </div>
  );
};

export default CommonManagement;
