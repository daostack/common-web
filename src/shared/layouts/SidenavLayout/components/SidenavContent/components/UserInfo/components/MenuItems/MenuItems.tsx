import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { logOut } from "@/pages/Auth/store/actions";
import { Theme } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import {
  Avatar3Icon,
  BillingIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/shared/icons";
import ThemeIcon from "@/shared/icons/theme.icon";
import { changeTheme } from "@/shared/store/actions";
import { selectTheme } from "@/shared/store/selectors";
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
  const theme = useSelector(selectTheme);

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
      key: "theme",
      type: ItemType.Button,
      text: "Light/Dark mode",
      icon: <ThemeIcon />,
      onClick: () => {
        dispatch(changeTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark));
      },
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
