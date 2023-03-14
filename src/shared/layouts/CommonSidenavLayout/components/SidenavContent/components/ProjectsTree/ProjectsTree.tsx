import React, { FC, useMemo } from "react";
import { Loader } from "@/shared/ui-kit";
import { Scrollbar } from "../../../../../SidenavLayout/components/SidenavContent";
import {
  Item,
  ProjectsTreeProps as BaseProjectsTreeProps,
  TreeContext,
  TreeContextValue,
  TreeItem,
  TreeRecursive,
} from "../../../../../SidenavLayout/components/SidenavContent/components/ProjectsTree";
import styles from "./ProjectsTree.module.scss";

interface ProjectsTreeProps extends BaseProjectsTreeProps {
  parentItem: Item;
  isLoading?: boolean;
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerStyles,
    parentItem,
    items,
    activeItem,
    itemIdWithNewProjectCreation = "",
    isLoading = false,
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
      <TreeItem item={parentItem} isActive={parentItem.id === activeItem?.id} />
      <Scrollbar>
        <TreeRecursive className={className} items={items} level={2} />
        {isLoading && <Loader className={styles.loader} />}
      </Scrollbar>
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
