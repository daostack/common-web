import React, { CSSProperties, FC, ReactNode } from "react";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  BlocksIcon,
  GovernanceIcon,
  InfoIcon,
  PeopleGroupIcon,
  WalletIcon,
} from "@/shared/icons";
import { CommonTab } from "../../constants";
import { getCommonTabName } from "../../utils";
import styles from "./CommonTabs.module.scss";

interface CommonTabsProps {
  className?: string;
  activeTab: CommonTab;
  allowedTabs: CommonTab[];
  onTabChange: (tab: CommonTab) => void;
}

interface TabConfiguration {
  label: string;
  value: CommonTab;
  icon?: ReactNode;
}

const TABS: TabConfiguration[] = [
  {
    label: getCommonTabName(CommonTab.About),
    value: CommonTab.About,
    icon: <InfoIcon />,
  },
  {
    label: getCommonTabName(CommonTab.Feed),
    value: CommonTab.Feed,
    icon: <BlocksIcon />,
  },
  {
    label: getCommonTabName(CommonTab.Wallet),
    value: CommonTab.Wallet,
    icon: <WalletIcon />,
  },
  {
    label: getCommonTabName(CommonTab.Members),
    value: CommonTab.Members,
    icon: <PeopleGroupIcon />,
  },
  {
    label: getCommonTabName(CommonTab.Governance),
    value: CommonTab.Governance,
    icon: <GovernanceIcon />,
  },
];

const CommonTabs: FC<CommonTabsProps> = (props) => {
  const { className, activeTab, allowedTabs, onTabChange } = props;
  const isTabletView = useIsTabletView();
  const tabs = allowedTabs
    .map((tab) =>
      TABS.find((tabConfiguration) => tabConfiguration.value === tab),
    )
    .filter((tabConfiguration): tabConfiguration is TabConfiguration =>
      Boolean(tabConfiguration),
    );

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
          icon={
            tab.icon ? (
              <div className={styles.iconWrapper}>{tab.icon}</div>
            ) : undefined
          }
          includeDefaultMobileStyles={false}
        />
      ))}
    </Tabs>
  );
};

export default CommonTabs;
