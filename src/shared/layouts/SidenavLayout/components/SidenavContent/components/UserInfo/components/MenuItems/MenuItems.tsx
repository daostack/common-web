import React, { FC } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { logOut } from "@/pages/Auth/store/actions";
import { useRoutesContext } from "@/shared/contexts";
import {
  Avatar3Icon,
  BillingIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/shared/icons";
import { MenuItem } from "./components";
import { Item, ItemType } from "./types";
import styles from "./MenuItems.module.scss";

export enum MenuItemsPlacement {
  Top,
  Bottom,
}

export interface MenuItemsStyles {
  wrapper?: string;
}

interface MenuItemsProps {
  placement?: MenuItemsPlacement;
  styles?: MenuItemsStyles;
}

const MenuItems: FC<MenuItemsProps> = (props) => {
  const { placement = MenuItemsPlacement.Bottom, styles: outerStyles } = props;
  const dispatch = useDispatch();
  const { getProfilePagePath, getBillingPagePath, getSettingsPagePath } =
    useRoutesContext();
  const items: Item[] = [
    {
      key: "my-profile",
      text: "My profile",
      icon: <Avatar3Icon />,
      to: getProfilePagePath(),
    },
    {
      key: "settings",
      text: "Settings",
      icon: <SettingsIcon />,
      to: getSettingsPagePath(),
    },
    {
      key: "billing",
      text: "Billing",
      icon: <BillingIcon />,
      to: getBillingPagePath(),
    },
    {
      key: "log-out",
      type: ItemType.Button,
      text: "Log out",
      icon: <LogoutIcon />,
      onClick: () => {
        dispatch(logOut());
      },
    },
  ];

  return (
    <Menu.Items as={React.Fragment}>
      <ul
        className={classNames(styles.itemsWrapper, outerStyles?.wrapper, {
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
