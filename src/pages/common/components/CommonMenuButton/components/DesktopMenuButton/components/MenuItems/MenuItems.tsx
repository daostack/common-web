import React, { FC } from "react";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { Item } from "../../../../types";
import { MenuItem } from "./components";
import styles from "./MenuItems.module.scss";

interface MenuItemsProps {
  className?: string;
  items: Item[];
}

const MenuItems: FC<MenuItemsProps> = (props) => {
  const { className, items } = props;

  return (
    <Menu.Items as={React.Fragment}>
      <ul className={classNames(styles.itemsWrapper, className)}>
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
