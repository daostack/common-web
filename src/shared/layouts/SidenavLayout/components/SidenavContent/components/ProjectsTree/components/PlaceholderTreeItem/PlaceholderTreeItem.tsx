import React, { FC } from "react";
import classNames from "classnames";
import { useTreeContext } from "../../context";
import { getItemStyles } from "../TreeItem/utils";
import treeItemTriggerStyles from "../TreeItemTrigger/TreeItemTrigger.module.scss";
import styles from "./PlaceholderTreeItem.module.scss";

interface PlaceholderTreeItemProps {
  name: string;
  level?: number;
  isActive?: boolean;
}

const PlaceholderTreeItem: FC<PlaceholderTreeItemProps> = (props) => {
  const { name, level = 1, isActive = false } = props;
  const { treeItemTriggerClassName, treeItemTriggerNameClassName } =
    useTreeContext();
  const itemStyles = getItemStyles(level);

  return (
    <li
      className={classNames(
        treeItemTriggerStyles.item,
        {
          [treeItemTriggerStyles.itemActive]: isActive,
        },
        treeItemTriggerClassName,
      )}
      style={itemStyles}
      role="treeitem"
      aria-selected={isActive}
      aria-label={`Item of ${name}`}
    >
      <div className={styles.gap} />
      <span
        className={classNames(styles.image, treeItemTriggerStyles.image, {
          [treeItemTriggerStyles.imageRounded]: level !== 1,
        })}
        aria-hidden
      />
      <span
        className={classNames(
          treeItemTriggerStyles.name,
          treeItemTriggerNameClassName,
        )}
        title={name}
      >
        {name}
      </span>
    </li>
  );
};

export default PlaceholderTreeItem;
