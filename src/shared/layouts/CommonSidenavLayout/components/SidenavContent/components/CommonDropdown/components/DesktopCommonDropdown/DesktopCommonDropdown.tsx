import React, { FC, MouseEventHandler, useState } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Check2Icon, Menu2Icon } from "@/shared/icons";
import { MenuItem, MenuItemType } from "@/shared/interfaces";
import { DesktopMenu } from "@/shared/ui-kit";
import { CREATE_COMMON_ITEM_ID } from "../../../ProjectsTree";
import styles from "./DesktopCommonDropdown.module.scss";

interface DesktopCommonDropdownProps {
  items: MenuItem[];
  activeItemId?: string | null;
}

const DesktopCommonDropdown: FC<DesktopCommonDropdownProps> = (props) => {
  const { items, activeItemId } = props;
  const [menuRerenderHack, setMenuRerenderHack] = useState(false);

  const handleItemClick = () => {
    setMenuRerenderHack((value) => !value);
  };

  const finalItems = items.map((item) => ({
    ...item,
    className: classNames(item.className, styles.menuItem, {
      [styles.menuItemForCommonCreation]: item.id === CREATE_COMMON_ITEM_ID,
    }),
    activeClassName: classNames(item.activeClassName, styles.menuItemActive),
    text: (
      <>
        <span
          className={styles.menuItemText}
          title={typeof item.text === "string" ? item.text : ""}
        >
          {item.text}
        </span>
        {item.id === activeItemId && (
          <Check2Icon className={styles.checkIcon} />
        )}
      </>
    ),
    onClick: (event) => {
      event.preventDefault();
      handleItemClick();

      if (item.type !== MenuItemType.Link) {
        item.onClick(event);
      }
    },
  }));

  const onClick: MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  const triggerEl = (
    <ButtonIcon onClick={onClick}>
      <Menu2Icon className={styles.icon} />
    </ButtonIcon>
  );

  return (
    <div className={styles.container}>
      <DesktopMenu
        key={String(menuRerenderHack)}
        menuItemsClassName={styles.menuItems}
        triggerEl={triggerEl}
        items={finalItems}
      />
    </div>
  );
};

export default DesktopCommonDropdown;
