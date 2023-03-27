import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { Menu } from "@headlessui/react";
import { MenuItem as Item } from "@/shared/interfaces";
import { MenuItems, Transition, Trigger } from "./components";
import styles from "./DesktopMenu.module.scss";

interface DesktopMenuProps {
  className?: string;
  menuItemsClassName?: string;
  triggerEl: ReactNode;
  items: Item[];
  shouldPreventDefaultOnClose?: boolean;
}

const DesktopMenu: FC<DesktopMenuProps> = (props) => {
  const {
    className,
    menuItemsClassName,
    triggerEl,
    items,
    shouldPreventDefaultOnClose,
  } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <Menu>
        {({ open, close }) => (
          <>
            <Menu.Button as={React.Fragment}>
              <Trigger
                triggerEl={triggerEl}
                isOpen={open}
                onClose={close}
                shouldPreventDefaultOnClose={shouldPreventDefaultOnClose}
              />
            </Menu.Button>
            <Transition show={open}>
              {open && (
                <MenuItems className={menuItemsClassName} items={items} />
              )}
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default DesktopMenu;
