import React, { FC } from "react";
import classNames from "classnames";
import { BoldPlusIcon } from "@/shared/icons";
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
  hasPermissionToAddProject?: boolean;
  level?: number;
}

const TreeRecursive: FC<TreeRecursiveProps> = (props) => {
  const {
    className,
    items,
    parentId,
    parentName,
    hasPermissionToAddProject,
    level = 1,
  } = props;
  const {
    activeItemId,
    itemIdWithNewProjectCreation,
    isActiveCheckAllowed,
    onAddProjectClick,
  } = useTreeContext();
  const isFirstLevel = level === 1;
  const isTreeWithNewSpaceCreation =
    Boolean(itemIdWithNewProjectCreation) &&
    parentId === itemIdWithNewProjectCreation;
  const shouldDisplayAddSpaceItem =
    hasPermissionToAddProject &&
    !isTreeWithNewSpaceCreation &&
    parentId &&
    onAddProjectClick;

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
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          level={level}
          isActive={isActiveCheckAllowed && item.id === activeItemId}
        >
          {(item.items && item.items.length > 0) ||
          item.id === itemIdWithNewProjectCreation ||
          item.hasPermissionToAddProject ? (
            <TreeRecursive
              items={item.items || []}
              parentId={item.id}
              parentName={item.name}
              hasPermissionToAddProject={item.hasPermissionToAddProject}
              level={level + 1}
            />
          ) : null}
        </TreeItem>
      ))}
      {isTreeWithNewSpaceCreation && (
        <PlaceholderTreeItem
          imageClassName={styles.newProjectImage}
          name="New space"
          level={level}
          isActive
        />
      )}
      {shouldDisplayAddSpaceItem && (
        <PlaceholderTreeItem
          className={styles.addProjectItem}
          name="Add a space"
          level={level}
          icon={<BoldPlusIcon className={styles.plusIcon} />}
          onClick={() => onAddProjectClick(parentId)}
        />
      )}
    </ul>
  );
};

export default TreeRecursive;
