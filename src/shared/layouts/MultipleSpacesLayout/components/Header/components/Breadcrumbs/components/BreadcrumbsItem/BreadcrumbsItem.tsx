import React, { FC, useRef } from "react";
import classNames from "classnames";
import { CheckIcon } from "@/shared/icons";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonAvatar } from "@/shared/ui-kit";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";
import { BreadcrumbsItemData } from "../../types";
import styles from "./BreadcrumbsItem.module.scss";

const BreadcrumbsItem: FC<BreadcrumbsItemData> = (props) => {
  const { activeItemId, items } = props;
  const containerRef = useRef<HTMLLIElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const activeItem = items.find((item) => item.commonId === activeItemId);

  if (!activeItem) {
    return null;
  }

  const renderMenuItemContent = (item: ProjectsStateItem) => {
    const isActive = item.commonId === activeItemId;

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

  const menuItems: ContextMenuItem[] = items.map((item) => ({
    id: item.commonId,
    text: item.name,
    onClick: emptyFunction,
    className: classNames(styles.contextMenuItem, {
      [styles.contextMenuItemWithoutMembership]: !item.hasMembership,
    }),
    renderContent: () => renderMenuItemContent(item),
  }));

  const handleButtonClick = () => {
    if (containerRef.current) {
      const { x, y, height } = containerRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li ref={containerRef} className={styles.container}>
      <button className={styles.button} onClick={handleButtonClick}>
        {activeItem.name}
      </button>
      {menuItems.length > 0 && (
        <ContextMenu
          ref={contextMenuRef}
          menuItems={menuItems}
          listClassName={styles.contextMenuList}
        />
      )}
    </li>
  );
};

export default BreadcrumbsItem;
