import React, { FC, useMemo } from "react";
import { TreeRecursive } from "./components";
import {
  TreeContext,
  TreeContextValue,
  TreeItemTriggerStyles,
} from "./context";
import { Item } from "./types";

export interface ProjectsTreeProps {
  className?: string;
  treeItemTriggerStyles?: TreeItemTriggerStyles;
  items: Item[];
  activeItem: Item | null;
  itemIdWithNewProjectCreation?: string;
  parentItemIds: string[];
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerStyles,
    items,
    activeItem,
    parentItemIds,
    itemIdWithNewProjectCreation = "",
  } = props;
  const isActiveCheckAllowed = !itemIdWithNewProjectCreation;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
      parentItemIds,
    }),
    [
      activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
      parentItemIds,
    ],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeRecursive className={className} items={items} />
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
