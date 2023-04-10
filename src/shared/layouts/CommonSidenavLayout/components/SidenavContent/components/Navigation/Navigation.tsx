import React, { FC } from "react";
import { useLocation } from "react-router";
import classNames from "classnames";
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
  const inboxCounter = 3;
  const items: NavigationItemOptions[] = [
    {
      text: "Inbox",
      route: ROUTE_PATHS.INBOX,
      icon: <InboxIcon className={styles.icon} />,
      isActive: matchRoute(location.pathname, ROUTE_PATHS.INBOX, {
        exact: true,
      }),
      notificationsAmount: inboxCounter || null,
      tooltipContent: (
        <>
          We’re building a new Inbox section for your messages.
          <br />
          Stay tuned for updates!
        </>
      ),
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
