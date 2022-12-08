import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import { Item } from "../../../../types";
import { MenuItem } from "./components";
import styles from "./MenuItems.module.scss";

interface MenuItemsProps {
  items: Item[];
}

const MenuItems: FC<MenuItemsProps> = (props) => {
  const { items } = props;

  return (
    <Menu.Items as={React.Fragment}>
      <ul className={styles.itemsWrapper}>
        {items.map((item) => (
          <Menu.Item key={item.id}>
            {({ active }) => <MenuItem item={item} active={active} />}
          </Menu.Item>
        ))}
      </ul>
    </Menu.Items>
  );
};

export default MenuItems;
