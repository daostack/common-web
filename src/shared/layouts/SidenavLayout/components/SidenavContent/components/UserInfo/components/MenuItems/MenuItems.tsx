import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import { ROUTE_PATHS } from "@/shared/constants";
import { MenuItem } from "./components";
import { Item, ItemType } from "./types";
import styles from "./MenuItems.module.scss";

const MenuItems: FC = () => {
  const items: Item[] = [
    {
      key: "my-profile",
      text: "My profile",
      to: ROUTE_PATHS.MY_ACCOUNT_PROFILE,
    },
    {
      key: "billing",
      text: "Billing",
      to: ROUTE_PATHS.MY_ACCOUNT_BILLING,
    },
    {
      key: "log-out",
      className: styles.logoutItem,
      type: ItemType.Button,
      text: "Log out",
      onClick: () => {
        console.log("Log out");
      },
    },
  ];

  return (
    <Menu.Items as={React.Fragment}>
      <ul className={styles.itemsWrapper}>
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
