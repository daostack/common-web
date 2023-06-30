import React, { FC, useRef } from "react";
import { ContextMenuRef } from "@/shared/ui-kit";
import { BreadcrumbsItemData } from "../../types";
import { BreadcrumbsMenu } from "../BreadcrumbsMenu";
import styles from "./BreadcrumbsItem.module.scss";

const BreadcrumbsItem: FC<BreadcrumbsItemData> = (props) => {
  const { activeItemId, items } = props;
  const containerRef = useRef<HTMLLIElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const activeItem = items.find((item) => item.commonId === activeItemId);

  if (!activeItem) {
    return null;
  }

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
      <BreadcrumbsMenu
        ref={contextMenuRef}
        items={items}
        activeItemId={activeItemId}
      />
    </li>
  );
};

export default BreadcrumbsItem;
