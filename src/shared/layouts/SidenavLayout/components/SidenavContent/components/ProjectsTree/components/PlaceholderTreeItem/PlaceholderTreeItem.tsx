import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import classNames from "classnames";
import { useTreeContext } from "../../context";
import { getItemStyles } from "../TreeItem/utils";
import treeItemTriggerStyles from "../TreeItemTrigger/TreeItemTrigger.module.scss";
import styles from "./PlaceholderTreeItem.module.scss";

interface PlaceholderTreeItemProps {
  className?: string;
  name: string;
  level?: number;
  isActive?: boolean;
  icon?: ReactNode;
}

const PlaceholderTreeItem: FC<PlaceholderTreeItemProps> = (props) => {
  const { className, name, level = 1, isActive = false, icon } = props;
  const { treeItemTriggerStyles: treeItemTriggerStylesFromContext } =
    useTreeContext();
  const itemStyles = getItemStyles(level);
  let iconEl: ReactNode | null = null;

  if (isValidElement(icon)) {
    iconEl = cloneElement(icon, {
      ...icon.props,
      className: classNames(styles.icon, icon.props.className),
    });
  }

  return (
    <li
      className={classNames(
        treeItemTriggerStyles.item,
        {
          [treeItemTriggerStyles.itemActive]: isActive,
        },
        className,
        treeItemTriggerStylesFromContext?.container,
      )}
      style={itemStyles}
      role="treeitem"
      aria-selected={isActive}
      aria-label={`Item of ${name}`}
    >
      <div className={styles.gap} />
      {iconEl || (
        <span
          className={classNames(
            styles.image,
            treeItemTriggerStyles.image,
            {
              [classNames(
                treeItemTriggerStyles.imageNonRounded,
                treeItemTriggerStylesFromContext?.imageNonRounded,
              )]: level === 1,
              [treeItemTriggerStyles.imageRounded]: level !== 1,
            },
            treeItemTriggerStylesFromContext?.image,
          )}
          aria-hidden
        />
      )}
      <span
        className={classNames(
          treeItemTriggerStyles.name,
          treeItemTriggerStylesFromContext?.name,
        )}
        title={name}
      >
        {name}
      </span>
    </li>
  );
};

export default PlaceholderTreeItem;
