import React, { FC } from "react";
import classNames from "classnames";
import { useTreeContext } from "../../context";
import { Item } from "../../types";
import { PlaceholderTreeItem } from "../PlaceholderTreeItem";
import { TreeItem } from "../TreeItem";
import styles from "./TreeRecursive.module.scss";

interface TreeRecursiveProps {
  className?: string;
  items: Item[];
  parentId?: string;
  parentName?: string;
  level?: number;
}

const TreeRecursive: FC<TreeRecursiveProps> = (props) => {
  const { className, items, parentId, parentName, level = 1 } = props;
  const { activeItemId, itemIdWithNewProjectCreation, isActiveCheckAllowed } =
    useTreeContext();
  const isFirstLevel = level === 1;

  return (
    <ul
      className={classNames(styles.list, className)}
      role={isFirstLevel ? "tree" : "group"}
      aria-multiselectable={isFirstLevel ? false : undefined}
      aria-label={
        parentName && !isFirstLevel
          ? `Spaces of ${parentName}`
          : "List of related to you spaces"
      }
    >
      {Boolean(itemIdWithNewProjectCreation) &&
        parentId === itemIdWithNewProjectCreation && (
          <PlaceholderTreeItem
            imageClassName={styles.newProjectImage}
            name="New space"
            level={level}
            isActive
          />
        )}
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          level={level}
          isActive={isActiveCheckAllowed && item.id === activeItemId}
        >
          {(item.items && item.items.length > 0) ||
          item.id === itemIdWithNewProjectCreation ? (
            <TreeRecursive
              items={item.items || []}
              parentId={item.id}
              parentName={item.name}
              level={level + 1}
            />
          ) : null}
        </TreeItem>
      ))}
    </ul>
  );
};

export default TreeRecursive;
