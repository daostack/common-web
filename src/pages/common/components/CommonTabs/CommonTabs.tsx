import React, { FC } from "react";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { CommonTab } from "../../constants";
import styles from "./CommonTabs.module.scss";

interface CommonTabsProps {
  className?: string;
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
  const { className, activeTab, onTabChange } = props;

  const handleTabChange = (value: unknown) => {
    onTabChange(value as CommonTab);
  };

  return (
    <Tabs
      className={classNames(styles.tabs, className)}
      value={activeTab}
      onChange={handleTabChange}
    >
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
