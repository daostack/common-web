import React, { FC } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { NavigationItem } from "./components";
import { NavigationItemOptions } from "./types";
import styles from "./Navigation.module.scss";

const ITEMS: NavigationItemOptions[] = [
  {
    text: "About",
    route: ROUTE_PATHS.HOME,
  },
  {
    text: "Commons",
    route: ROUTE_PATHS.COMMON_LIST,
  },
  {
    text: "Notifications",
    route: ROUTE_PATHS.HOME,
    disabled: true,
  },
];

const Navigation: FC = () => {
  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {ITEMS.map((item, index) => (
          <li key={index} className={styles.listItem}>
            <NavigationItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
