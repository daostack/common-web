import React, { FC, useMemo } from "react";
import { LOADER_APPEARANCE_DELAY } from "@/shared/constants";
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
import { INITIAL_TREE_ITEMS_LEVEL } from "./constants";
import { useMenuItems } from "./hooks";
import styles from "./ProjectsTree.module.scss";

interface ProjectsTreeProps extends BaseProjectsTreeProps {
  parentItem: Item;
  commons: ProjectsStateItem[];
  currentCommonId?: string | null;
  onCommonClick: (commonId: string) => void;
  onCommonCreationClick?: () => void;
  onAddProjectClick?: (commonId: string) => void;
  onItemClick?: (itemId: string) => void;
  isLoading?: boolean;
  withScrollbar?: boolean;
  commonsMenuClassName?: string;
  loaderDelay?: number;
}

const ProjectsTree: FC<ProjectsTreeProps> = (props) => {
  const {
    className,
    treeItemTriggerStyles,
    parentItem,
    commons,
    items,
    activeItem,
    parentItemIds,
    currentCommonId,
    itemIdWithNewProjectCreation = "",
    onCommonClick,
    onCommonCreationClick,
    onAddProjectClick,
    onItemClick,
    isLoading = false,
    withScrollbar = true,
    commonsMenuClassName,
    loaderDelay = LOADER_APPEARANCE_DELAY,
  } = props;
  const menuItems = useMenuItems({
    stateItems: commons,
    activeStateItemId: currentCommonId,
    onCommonClick,
    onCommonCreationClick,
  });
  const isActiveCheckAllowed = !itemIdWithNewProjectCreation;
  const isParentItemActive =
    isActiveCheckAllowed && parentItem.id === activeItem?.id;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
      parentItemIds,
      onAddProjectClick,
      onItemClick,
    }),
    [
      activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
      parentItemIds,
      onAddProjectClick,
      onItemClick,
    ],
  );

  const itemsEl = (
    <>
      <TreeRecursive
        className={className}
        parentId={parentItem.id}
        parentName={parentItem.name}
        items={items}
        hasPermissionToAddProject={
          parentItem.hasPermissionToAddProject && isParentItemActive
        }
        level={INITIAL_TREE_ITEMS_LEVEL}
      />
      {isLoading && <Loader className={styles.loader} delay={loaderDelay} />}
    </>
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeItem
        className={styles.parentItem}
        treeItemTriggerClassName={styles.parentItemTrigger}
        item={{
          ...parentItem,
          rightContent: (
            <CommonDropdown
              items={menuItems}
              activeItemId={currentCommonId}
              isActive={isParentItemActive}
              menuItemsClassName={commonsMenuClassName}
            />
          ),
        }}
        isActive={isParentItemActive}
      />
      {withScrollbar ? <Scrollbar>{itemsEl}</Scrollbar> : itemsEl}
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
