import React, { FC, useEffect, useRef } from "react";
import classNames from "classnames";
import { useOutsideClick } from "@/shared/hooks";
import { MenuItem as Item } from "@/shared/interfaces";
import { MenuItem } from "../MenuItems/components";
import { Transition } from "../Transition";
import menuItemsStyles from "../MenuItems/MenuItems.module.scss";
import styles from "./DesktopStyleMenu.module.scss";

interface DesktopStyleMenuProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
}

const DesktopStyleMenu: FC<DesktopStyleMenuProps> = (props) => {
  const { className, isOpen, onClose, items } = props;
  const listRef = useRef(null);
  const { isOutside } = useOutsideClick(listRef);

  useEffect(() => {
    if (isOutside) {
      onClose();
    }
  }, [isOutside]);

  return (
    <Transition className={styles.transition} show={isOpen}>
      <ul
        ref={listRef}
        className={classNames(menuItemsStyles.itemsWrapper, className)}
      >
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </ul>
    </Transition>
  );
};

export default DesktopStyleMenu;
