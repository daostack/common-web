import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import classNames from "classnames";
import {
  authentificated,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
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
  const isAuthenticated = useSelector(authentificated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const items: NavigationItemOptions[] = [
    {
      text: "Inbox",
      route: ROUTE_PATHS.INBOX,
      icon: <InboxIcon className={styles.icon} />,
      isActive: matchRoute(location.pathname, ROUTE_PATHS.INBOX, {
        exact: true,
      }),
      isDisabled: !isAuthenticated,
      notificationsAmount: userStreamsWithNotificationsAmount || null,
      tooltipContent: !isAuthenticated ? (
        <>Inbox is only allowed for authenticated users.</>
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
