import React, { CSSProperties, FC, useState } from "react";
import { Item } from "../../types";
import { TreeItemTrigger } from "../TreeItemTrigger";
import styles from "./TreeItem.module.scss";

interface TreeItemProps {
  item: Item;
  level?: number;
  isActive?: boolean;
}

const TreeItem: FC<TreeItemProps> = (props) => {
  const { item, level = 1, isActive = false, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const itemStyles = {
    "--tree-level": level,
  } as CSSProperties;
  const hasNestedContent = Boolean(children);

  const handleTriggerToggle = () => {
    setIsOpen((value) => !value);
  };

  return (
    <li
      className={styles.itemWrapper}
      style={itemStyles}
      role="treeitem"
      aria-selected={isActive}
      aria-label={`Item of ${item.name}`}
    >
      <TreeItemTrigger
        item={item}
        level={level}
        isActive={isActive}
        isOpen={isOpen}
        onToggle={hasNestedContent ? handleTriggerToggle : undefined}
      />
      {isOpen ? children : null}
    </li>
  );
};

export default TreeItem;
