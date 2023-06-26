import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import classNames from "classnames";
import {
  authentificated,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { InboxIcon } from "@/shared/icons";
import { matchRoute } from "@/shared/utils";
import { NavigationItem } from "./components";
import { NavigationItemOptions } from "./types";
import styles from "./Navigation.module.scss";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const { getInboxPagePath } = useRoutesContext();
  const isAuthenticated = useSelector(authentificated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const inboxPagePath = getInboxPagePath() as ROUTE_PATHS;
  const items: NavigationItemOptions[] = [
    {
      text: `Inbox${
        userStreamsWithNotificationsAmount
          ? ` (${userStreamsWithNotificationsAmount})`
          : ""
      }`,
      route: inboxPagePath,
      icon: <InboxIcon className={styles.icon} />,
      isActive: matchRoute(location.pathname, inboxPagePath, {
        exact: true,
      }),
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
