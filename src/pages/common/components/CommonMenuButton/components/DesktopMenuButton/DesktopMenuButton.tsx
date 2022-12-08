import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { Menu, Transition } from "@headlessui/react";
import { MenuItems } from "./components";
import styles from "./DesktopMenuButton.module.scss";

interface DesktopMenuButtonProps {
  className?: string;
  triggerEl: ReactNode;
}

const DesktopMenuButton: FC<DesktopMenuButtonProps> = (props) => {
  const { className, triggerEl } = props;

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
          <MenuItems />
        </Transition>
      </Menu>
    </div>
  );
};

export default DesktopMenuButton;
