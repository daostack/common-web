import React, { CSSProperties, FC, ReactNode } from "react";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InfoIcon, PeopleGroupIcon, WalletIcon } from "@/shared/icons";
import { LayoutTab } from "../../constants";
import { getLayoutTabName } from "./utils";
import styles from "./LayoutTabs.module.scss";

interface LayoutTabsProps {
  className?: string;
  activeTab: LayoutTab;
  onTabChange: (tab: LayoutTab) => void;
}

interface TabConfiguration {
  label: string;
  value: LayoutTab;
  icon?: ReactNode;
}

const TABS: TabConfiguration[] = [
  {
    label: getLayoutTabName(LayoutTab.Spaces),
    value: LayoutTab.Spaces,
    icon: <InfoIcon />,
  },
  {
    label: getLayoutTabName(LayoutTab.Inbox),
    value: LayoutTab.Inbox,
    icon: <WalletIcon />,
  },
  {
    label: getLayoutTabName(LayoutTab.Profile),
    value: LayoutTab.Profile,
    icon: <PeopleGroupIcon />,
  },
];

const LayoutTabs: FC<LayoutTabsProps> = (props) => {
  const { className, activeTab, onTabChange } = props;
  const isTabletView = useIsTabletView();
  const tabs = TABS;

  const itemStyles = {
    "--items-amount": tabs.length,
  } as CSSProperties;

  const handleTabChange = (value: unknown) => {
    onTabChange(value as LayoutTab);
  };

  return (
    <Tabs
      className={classNames(styles.tabs, className)}
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

export default LayoutTabs;
