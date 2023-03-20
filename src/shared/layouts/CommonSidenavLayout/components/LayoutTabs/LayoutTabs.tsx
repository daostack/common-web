import React, { CSSProperties, FC, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { Tab, Tabs } from "@/shared/components";
import { InfoIcon, PeopleGroupIcon, WalletIcon } from "@/shared/icons";
import { getInboxPagePath, openSidenav } from "@/shared/utils";
import { LayoutTab } from "../../constants";
import { getActiveLayoutTab, getLayoutTabName } from "./utils";
import styles from "./LayoutTabs.module.scss";

interface LayoutTabsProps {
  className?: string;
  activeTab?: LayoutTab;
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
  const { className } = props;
  const history = useHistory();
  const activeTab =
    props.activeTab || getActiveLayoutTab(history.location.pathname);
  const tabs = TABS;

  const itemStyles = {
    "--items-amount": tabs.length,
  } as CSSProperties;

  const handleTabChange = (value: unknown) => {
    if (activeTab === value) {
      return;
    }

    switch (value) {
      case LayoutTab.Spaces:
        openSidenav();
        break;
      case LayoutTab.Inbox:
      case LayoutTab.Profile:
        history.push(getInboxPagePath());
        break;
      default:
        break;
    }
  };

  return (
    <Tabs
      className={classNames(styles.tabs, className)}
      style={itemStyles}
      value={activeTab}
      withIcons
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
