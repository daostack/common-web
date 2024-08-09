import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { Item } from "../../types";
import { TreeItemTrigger } from "../TreeItemTrigger";
import { getItemStyles } from "./utils";
import styles from "./TreeItem.module.scss";

interface TreeItemProps {
  className?: string;
  treeItemTriggerClassName?: string;
  item: Item;
  level?: number;
  isActive?: boolean;
  hasActiveChild?: boolean;
}

const TreeItem: FC<TreeItemProps> = (props) => {
  const {
    className,
    treeItemTriggerClassName,
    item,
    level = 1,
    isActive = false,
    hasActiveChild = false,
    children,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenedManually, setIsOpenedManually] = useState(false);
  const itemStyles = getItemStyles(level);
  const hasNestedContent = Boolean(children);

  useEffect(() => {
    if ((isActive || hasActiveChild) && hasNestedContent) {
      setIsOpen(true);
      return;
    }

    if (!isActive && !isOpenedManually && !hasActiveChild) {
      setIsOpen(false);
    }
  }, [isActive, hasNestedContent, isOpenedManually, hasActiveChild]);

  const handleTriggerToggle = useCallback(() => {
    if (!hasNestedContent) {
      return;
    }

    setIsOpenedManually(!isOpen);
    setIsOpen((value) => !value);
  }, [hasNestedContent]);

  return (
    <li
      className={classNames(styles.itemWrapper, className)}
      style={itemStyles}
      role="treeitem"
      aria-selected={isActive}
      aria-label={`Item of ${item.name}`}
    >
      <TreeItemTrigger
        className={treeItemTriggerClassName}
        item={item}
        level={level}
        isActive={isActive}
        isOpen={isOpen}
        onToggle={handleTriggerToggle}
      />
      {isOpen ? children : null}
    </li>
  );
};

export default TreeItem;
