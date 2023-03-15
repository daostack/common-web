import React, { FC, useMemo } from "react";
import { Loader } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { Scrollbar } from "../../../../../SidenavLayout/components/SidenavContent";
import {
  Item,
  ProjectsTreeProps as BaseProjectsTreeProps,
  TreeContext,
  TreeContextValue,
  TreeItem,
  TreeRecursive,
} from "../../../../../SidenavLayout/components/SidenavContent/components/ProjectsTree";
import { CommonDropdown } from "../CommonDropdown";
import { useMenuItems } from "./hooks";
import styles from "./ProjectsTree.module.scss";

interface ProjectsTreeProps extends BaseProjectsTreeProps {
  parentItem: Item;
  commons: ProjectsStateItem[];
  currentCommonId?: string | null;
  onCommonClick: (commonId: string) => void;
  isLoading?: boolean;
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerStyles,
    parentItem,
    commons,
    items,
    activeItem,
    currentCommonId,
    itemIdWithNewProjectCreation = "",
    onCommonClick,
    isLoading = false,
  } = props;
  const menuItems = useMenuItems({
    stateItems: commons,
    onCommonClick,
  });
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
      <TreeItem
        treeItemTriggerClassName={styles.parentItemTrigger}
        item={{
          ...parentItem,
          rightContent: (
            <CommonDropdown items={menuItems} activeItemId={currentCommonId} />
          ),
        }}
        isActive={parentItem.id === activeItem?.id}
      />
      <Scrollbar>
        <TreeRecursive className={className} items={items} level={2} />
        {isLoading && <Loader className={styles.loader} />}
      </Scrollbar>
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
