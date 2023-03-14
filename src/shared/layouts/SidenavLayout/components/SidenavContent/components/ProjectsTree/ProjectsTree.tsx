import React, { FC, useMemo } from "react";
import { TreeRecursive } from "./components";
import { TreeContext, TreeContextValue } from "./context";
import { Item } from "./types";

interface ProjectsTreeProps {
  className?: string;
  treeItemTriggerClassName?: string;
  treeItemTriggerNameClassName?: string;
  items: Item[];
  activeItem: Item | null;
  itemIdWithNewProjectCreation?: string;
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerClassName,
    treeItemTriggerNameClassName,
    items,
    activeItem,
    itemIdWithNewProjectCreation = "",
  } = props;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
      itemIdWithNewProjectCreation,
      treeItemTriggerClassName,
      treeItemTriggerNameClassName,
    }),
    [
      activeItem?.id,
      itemIdWithNewProjectCreation,
      treeItemTriggerClassName,
      treeItemTriggerNameClassName,
    ],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeRecursive className={className} items={items} />
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
