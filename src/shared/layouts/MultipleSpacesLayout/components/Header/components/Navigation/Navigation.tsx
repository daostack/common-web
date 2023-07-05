import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import classNames from "classnames";
import {
  authentificated,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { InboxItemType, ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { BlocksIcon, InboxIcon } from "@/shared/icons";
import {
  CommonSidenavLayoutTab,
  getActiveLayoutTab,
} from "@/shared/layouts/CommonSidenavLayout";
import {
  selectMultipleSpacesLayoutBreadcrumbs,
  selectMultipleSpacesLayoutPreviousBreadcrumbs,
} from "@/store/states";
import { NavigationItem } from "./components";
import { NavigationItemOptions } from "./types";
import styles from "./Navigation.module.scss";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const { getCommonPagePath, getInboxPagePath } = useRoutesContext();
  const isAuthenticated = useSelector(authentificated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const currentBreadcrumbs = useSelector(selectMultipleSpacesLayoutBreadcrumbs);
  const previousBreadcrumbs = useSelector(
    selectMultipleSpacesLayoutPreviousBreadcrumbs,
  );
  const breadcrumbs = previousBreadcrumbs || currentBreadcrumbs;
  const activeTab = getActiveLayoutTab(location.pathname);
  const commonPagePath = (
    breadcrumbs?.type === InboxItemType.FeedItemFollow
      ? getCommonPagePath(breadcrumbs.activeCommonId)
      : ""
  ) as ROUTE_PATHS;
  const inboxPagePath = getInboxPagePath() as ROUTE_PATHS;
  const items: NavigationItemOptions[] = [
    {
      text: "My spaces",
      route: commonPagePath,
      icon: <BlocksIcon className={styles.icon} />,
      isActive: activeTab === CommonSidenavLayoutTab.Spaces,
      isDisabled: !isAuthenticated,
    },
    {
      text: `Inbox${
        userStreamsWithNotificationsAmount
          ? ` (${userStreamsWithNotificationsAmount})`
          : ""
      }`,
      route: inboxPagePath,
      icon: <InboxIcon className={styles.icon} />,
      isActive: activeTab === CommonSidenavLayoutTab.Inbox,
      isDisabled: !isAuthenticated,
      tooltipContent: !isAuthenticated ? (
        <>Inbox will be enabled once you log in 🙂</>
      ) : null,
    },
  ];

  return (
    <nav className={classNames(styles.container, className)}>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>
            <NavigationItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
