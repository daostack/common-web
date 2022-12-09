import React, { FC, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Portal } from "@/shared/ui-kit";
import { Item } from "../../types";
import { MenuItems } from "./components";
import styles from "./MobileMenuButton.module.scss";

interface MobileMenuButtonProps {
  className?: string;
  triggerEl: ReactNode;
  items: Item[];
}

const MobileMenuButton: FC<MobileMenuButtonProps> = (props) => {
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
                className={styles.itemsWrapper}
                enter={styles.menuTransitionEnter}
                enterTo={styles.menuTransitionEnterActive}
                leave={styles.menuTransitionExit}
                leaveTo={styles.menuTransitionExitActive}
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

export default MobileMenuButton;
