import React, { FC, ReactNode } from "react";
import { Menu } from "@headlessui/react";
import { Transition } from "@/shared/components";
import { MenuItem as Item, ModalTransition } from "@/shared/interfaces";
import { Portal } from "@/shared/ui-kit";
import { MenuItems } from "./components";
import styles from "./MobileMenu.module.scss";

interface MobileMenuProps {
  className?: string;
  triggerEl: ReactNode;
  items: Item[];
}

const MobileMenu: FC<MobileMenuProps> = (props) => {
  const { className, triggerEl, items } = props;

  return (
    <div className={className}>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button as={React.Fragment}>{triggerEl}</Menu.Button>
            <Portal>
              <Transition
                show={open}
                transition={ModalTransition.BottomToTop}
                className={styles.itemsWrapper}
              >
                {open && <MenuItems items={items} />}
              </Transition>
            </Portal>
          </>
        )}
      </Menu>
    </div>
  );
};

export default MobileMenu;
