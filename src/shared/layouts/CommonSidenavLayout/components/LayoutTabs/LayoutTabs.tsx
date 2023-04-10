import React, { CSSProperties, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { selectUserNotificationsAmount } from "@/pages/Auth/store/selectors";
import { Tab, Tabs } from "@/shared/components";
import { Avatar2Icon, InboxIcon, Hamburger2Icon } from "@/shared/icons";
import {
  getInboxPagePath,
  getProfilePagePath,
  openSidenav,
} from "@/shared/utils";
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
  icon: ReactNode;
  notificationsAmount?: number | null;
}

const LayoutTabs: FC<LayoutTabsProps> = (props) => {
  const { className } = props;
  const history = useHistory();
  const userNotificationsAmount = useSelector(selectUserNotificationsAmount());
  const finalUserNotificationsAmount =
    userNotificationsAmount && userNotificationsAmount > 99
      ? 99
      : userNotificationsAmount;
  const activeTab =
    props.activeTab || getActiveLayoutTab(history.location.pathname);
  const tabs: TabConfiguration[] = [
    {
      label: getLayoutTabName(LayoutTab.Spaces),
      value: LayoutTab.Spaces,
      icon: <Hamburger2Icon />,
    },
    {
      label: getLayoutTabName(LayoutTab.Inbox),
      value: LayoutTab.Inbox,
      icon: <InboxIcon />,
      notificationsAmount: finalUserNotificationsAmount || null,
    },
    {
      label: getLayoutTabName(LayoutTab.Profile),
      value: LayoutTab.Profile,
      icon: <Avatar2Icon className={styles.avatarIcon} color="currentColor" />,
    },
  ];

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
        history.push(getInboxPagePath());
        break;
      case LayoutTab.Profile:
        history.push(getProfilePagePath());
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
            <div className={styles.iconWrapper}>
              {tab.icon}
              {typeof tab.notificationsAmount === "number" && (
                <span className={styles.iconBadge}>
                  {tab.notificationsAmount}
                </span>
              )}
            </div>
          }
          includeDefaultMobileStyles={false}
        />
      ))}
    </Tabs>
  );
};

export default LayoutTabs;
