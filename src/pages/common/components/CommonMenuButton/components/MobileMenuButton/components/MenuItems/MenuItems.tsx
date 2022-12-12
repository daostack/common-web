import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import { emptyFunction } from "@/shared/utils";
import { CommonMenuItem } from "../../../../../../constants";
import { Item } from "../../../../types";
import { MenuItem } from "./components";
import styles from "./MenuItems.module.scss";

interface MenuItemsProps {
  items: Item[];
}

const MenuItems: FC<MenuItemsProps> = (props) => {
  const items = props.items.concat({
    id: CommonMenuItem.Cancel,
    text: "Cancel",
    onClick: emptyFunction,
  });

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
