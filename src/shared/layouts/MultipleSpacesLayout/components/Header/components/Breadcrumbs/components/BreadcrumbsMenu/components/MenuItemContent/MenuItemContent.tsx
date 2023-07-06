import React, { FC } from "react";
import classNames from "classnames";
import { CheckIcon } from "@/shared/icons";
import { CommonAvatar } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import styles from "./MenuItemContent.module.scss";

interface MenuItemContentProps {
  item: ProjectsStateItem;
  isActive: boolean;
}

const MenuItemContent: FC<MenuItemContentProps> = (props) => {
  const { item, isActive } = props;

  return (
    <>
      <CommonAvatar
        className={classNames(styles.contextMenuItemImage, {
          [styles.contextMenuItemImageRounded]: item.directParent,
          [styles.contextMenuItemImageNonRounded]: !item.directParent,
        })}
        name={item.name}
        src={item.image}
      />
      <span className={styles.contextMenuItemName}>{item.name}</span>
      {isActive && (
        <CheckIcon
          className={styles.contextMenuItemCheckIcon}
          fill="currentColor"
        />
      )}
    </>
  );
};

export default MenuItemContent;
