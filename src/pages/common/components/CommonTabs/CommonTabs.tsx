import React, { FC } from "react";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { CommonTab } from "../../constants";
import { getCommonTabName } from "../../utils";
import styles from "./CommonTabs.module.scss";

interface CommonTabsProps {
  className?: string;
  activeTab: CommonTab;
  isAuthenticated?: boolean;
  onTabChange: (tab: CommonTab) => void;
}

const TABS: { label: string; value: CommonTab }[] = [
  { label: getCommonTabName(CommonTab.About), value: CommonTab.About },
  { label: getCommonTabName(CommonTab.Feed), value: CommonTab.Feed },
  { label: getCommonTabName(CommonTab.Wallet), value: CommonTab.Wallet },
  { label: getCommonTabName(CommonTab.Members), value: CommonTab.Members },
  {
    label: getCommonTabName(CommonTab.Governance),
    value: CommonTab.Governance,
  },
];

const UNAUTHENTICATED_TABS = [TABS[0]];

const CommonTabs: FC<CommonTabsProps> = (props) => {
  const { className, activeTab, isAuthenticated = false, onTabChange } = props;
  const tabs = isAuthenticated ? TABS : UNAUTHENTICATED_TABS;

  const handleTabChange = (value: unknown) => {
    onTabChange(value as CommonTab);
  };

  return (
    <Tabs
      className={classNames(styles.tabs, className)}
      value={activeTab}
      onChange={handleTabChange}
    >
      {tabs.map((tab) => (
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
