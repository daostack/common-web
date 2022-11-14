import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { ROUTE_PATHS } from "@/shared/constants";
import styles from "./MenuItems.module.scss";

const MenuItems: FC = () => {
  return (
    <Menu.Items as={React.Fragment}>
      <ul className={styles.itemsWrapper}>
        <Menu.Item>
          {({ active }) => (
            <NavLink
              className={classNames(styles.item, {
                [styles.itemActive]: active,
              })}
              to={ROUTE_PATHS.MY_ACCOUNT_PROFILE}
            >
              My Account
            </NavLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={classNames(styles.item, {
                [styles.itemActive]: active,
              })}
            >
              Log out
            </button>
          )}
        </Menu.Item>
      </ul>
    </Menu.Items>
  );
};

export default MenuItems;
