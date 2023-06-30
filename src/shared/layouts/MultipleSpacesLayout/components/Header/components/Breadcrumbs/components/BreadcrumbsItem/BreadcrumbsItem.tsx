import React, { FC, useRef } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { BreadcrumbsItemData } from "../../types";
import { renderMenuItemContent } from "./utils";
import styles from "./BreadcrumbsItem.module.scss";

const BreadcrumbsItem: FC<BreadcrumbsItemData> = (props) => {
  const { activeItemId, items } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const containerRef = useRef<HTMLLIElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const activeItem = items.find((item) => item.commonId === activeItemId);

  if (!activeItem) {
    return null;
  }

  const menuItems: ContextMenuItem[] = items.map((item) => ({
    id: item.commonId,
    text: item.name,
    onClick: () => history.push(getCommonPagePath(item.commonId)),
    className: classNames(styles.contextMenuItem, {
      [styles.contextMenuItemWithoutMembership]: !item.hasMembership,
    }),
    renderContent: () => renderMenuItemContent(item, activeItemId),
  }));

  const handleButtonClick = () => {
    if (containerRef.current) {
      const { x, y, height } = containerRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li ref={containerRef}>
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
