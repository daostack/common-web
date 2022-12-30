import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { Menu, Transition } from "@headlessui/react";
import { MenuItem as Item } from "@/shared/interfaces";
import { MenuItems } from "./components";
import styles from "./DesktopMenu.module.scss";

interface DesktopMenuProps {
  className?: string;
  menuItemsClassName?: string;
  triggerEl: ReactNode;
  items: Item[];
}

const DesktopMenu: FC<DesktopMenuProps> = (props) => {
  const { className, menuItemsClassName, triggerEl, items } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <Menu>
        <Menu.Button as={React.Fragment}>{triggerEl}</Menu.Button>
        <Transition
          enter={styles.menuTransitionEnter}
          enterTo={styles.menuTransitionEnterActive}
          leave={styles.menuTransitionExit}
          leaveTo={styles.menuTransitionExitActive}
        >
          <MenuItems className={menuItemsClassName} items={items} />
        </Transition>
      </Menu>
    </div>
  );
};

export default DesktopMenu;
