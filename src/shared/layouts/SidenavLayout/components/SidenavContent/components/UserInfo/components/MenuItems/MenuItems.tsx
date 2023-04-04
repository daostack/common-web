import React, { FC } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { logOut } from "@/pages/Auth/store/actions";
import { ROUTE_PATHS } from "@/shared/constants";
import { MenuItem } from "./components";
import { Item, ItemType } from "./types";
import styles from "./MenuItems.module.scss";

export enum MenuItemsPlacement {
  Top,
  Bottom,
}

interface MenuItemsProps {
  placement?: MenuItemsPlacement;
}

const MenuItems: FC<MenuItemsProps> = (props) => {
  const { placement = MenuItemsPlacement.Bottom } = props;
  const dispatch = useDispatch();
  const items: Item[] = [
    {
      key: "my-profile",
      text: "My profile",
      to: ROUTE_PATHS.PROFILE,
    },
    {
      key: "billing",
      text: "Billing",
      to: ROUTE_PATHS.BILLING,
    },
    {
      key: "log-out",
      className: styles.logoutItem,
      type: ItemType.Button,
      text: "Log out",
      onClick: () => {
        dispatch(logOut());
      },
    },
  ];

  return (
    <Menu.Items as={React.Fragment}>
      <ul
        className={classNames(styles.itemsWrapper, {
          [styles.itemsWrapperPlacementTop]:
            placement === MenuItemsPlacement.Top,
          [styles.itemsWrapperPlacementBottom]:
            placement === MenuItemsPlacement.Bottom,
        })}
      >
        {items.map((item) => (
          <Menu.Item key={item.key}>
            {({ active }) => <MenuItem item={item} active={active} />}
          </Menu.Item>
        ))}
      </ul>
    </Menu.Items>
  );
};

export default MenuItems;
