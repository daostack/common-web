import React, { CSSProperties, FC, ReactNode } from "react";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InfoIcon } from "@/shared/icons";
import { CommonTab } from "../../constants";
import { getCommonTabName } from "../../utils";
import styles from "./CommonTabs.module.scss";

interface CommonTabsProps {
  className?: string;
  activeTab: CommonTab;
  isAuthenticated?: boolean;
  onTabChange: (tab: CommonTab) => void;
}

const TABS: { label: string; value: CommonTab; icon?: ReactNode }[] = [
  {
    label: getCommonTabName(CommonTab.About),
    value: CommonTab.About,
    icon: <InfoIcon className={styles.icon} />,
  },
  {
    label: getCommonTabName(CommonTab.Feed),
    value: CommonTab.Feed,
    icon: <InfoIcon className={styles.icon} />,
  },
  {
    label: getCommonTabName(CommonTab.Wallet),
    value: CommonTab.Wallet,
    icon: <InfoIcon className={styles.icon} />,
  },
  {
    label: getCommonTabName(CommonTab.Members),
    value: CommonTab.Members,
    icon: <InfoIcon className={styles.icon} />,
  },
  {
    label: getCommonTabName(CommonTab.Governance),
    value: CommonTab.Governance,
    icon: <InfoIcon className={styles.icon} />,
  },
];

// Tabs available for unauthenticated user: about, governance
const UNAUTHENTICATED_TABS = [TABS[0], TABS[4]];

const CommonTabs: FC<CommonTabsProps> = (props) => {
  const { className, activeTab, isAuthenticated = false, onTabChange } = props;
  const isTabletView = useIsTabletView();
  const tabs = isAuthenticated ? TABS : UNAUTHENTICATED_TABS;
  const itemStyles = {
    "--items-amount": tabs.length,
  } as CSSProperties;

  const handleTabChange = (value: unknown) => {
    onTabChange(value as CommonTab);
  };

  return (
    <Tabs
      className={classNames(styles.tabs, className, {
        [styles.tabsFixed]: isTabletView,
      })}
      style={itemStyles}
      value={activeTab}
      withIcons={isTabletView}
      onChange={handleTabChange}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          className={styles.tab}
          label={tab.label}
          value={tab.value}
          icon={tab.icon}
          includeDefaultMobileStyles={false}
        />
      ))}
    </Tabs>
  );
};

export default CommonTabs;
