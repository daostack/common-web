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
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerStyles,
    items,
    activeItem,
    itemIdWithNewProjectCreation = "",
  } = props;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
      itemIdWithNewProjectCreation,
      treeItemTriggerStyles,
    }),
    [activeItem?.id, itemIdWithNewProjectCreation, treeItemTriggerStyles],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeRecursive className={className} items={items} />
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
