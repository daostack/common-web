import React, { FC } from "react";
import { Tab, Tabs } from "@/shared/components";
import { CommonTab } from "../../constants";
import styles from "./CommonTabs.module.scss";

interface CommonTabsProps {
  activeTab: CommonTab;
  onTabChange: (tab: CommonTab) => void;
}

const TABS: { label: string; value: CommonTab }[] = [
  { label: "About", value: CommonTab.About },
  { label: "Feed", value: CommonTab.Feed },
  { label: "Wallet", value: CommonTab.Wallet },
  { label: "Members", value: CommonTab.Members },
  { label: "Governance", value: CommonTab.Governance },
];

const CommonTabs: FC<CommonTabsProps> = (props) => {
  const { activeTab, onTabChange } = props;

  const handleTabChange = (value: unknown) => {
    onTabChange(value as CommonTab);
  };

  return (
    <Tabs className={styles.tabs} value={activeTab} onChange={handleTabChange}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          className={styles.tab}
          label={tab.label}
          value={tab.value}
          includeDefaultMobileStyles={false}
        />
      ))}
    </Tabs>
  );
};

export default CommonTabs;
