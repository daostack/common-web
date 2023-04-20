import React, { FC, useMemo } from "react";
import { BoldPlusIcon } from "@/shared/icons";
import { Loader } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { Scrollbar } from "../../../../../SidenavLayout/components/SidenavContent";
import {
  Item,
  ProjectsTreeProps as BaseProjectsTreeProps,
  PlaceholderTreeItem,
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
  onCommonCreationClick: () => void;
  onAddProjectClick: (commonId: string) => void;
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
    onCommonCreationClick,
    onAddProjectClick,
    isLoading = false,
  } = props;
  const menuItems = useMenuItems({
    stateItems: commons,
    onCommonClick,
    onCommonCreationClick,
  });
  const isActiveCheckAllowed = !itemIdWithNewProjectCreation;
  const contextValue = useMemo<TreeContextValue>(
    () => ({
      activeItemId: activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
    }),
    [
      activeItem?.id,
      itemIdWithNewProjectCreation,
      isActiveCheckAllowed,
      treeItemTriggerStyles,
    ],
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeItem
        className={styles.parentItem}
        treeItemTriggerClassName={styles.parentItemTrigger}
        item={{
          ...parentItem,
          rightContent: (
            <CommonDropdown items={menuItems} activeItemId={currentCommonId} isActive={parentItem.id === activeItem?.id} />
          ),
        }}
        isActive={isActiveCheckAllowed && parentItem.id === activeItem?.id}
      />
      <Scrollbar>
        <TreeRecursive className={className} items={items} level={2} />
        {parentItem.hasPermissionToAddProject &&
          !itemIdWithNewProjectCreation && (
            <PlaceholderTreeItem
              className={styles.addProjectItem}
              name="Add a space"
              level={2}
              icon={<BoldPlusIcon className={styles.plusIcon} />}
              onClick={() => onAddProjectClick(parentItem.id)}
            />
          )}
        {itemIdWithNewProjectCreation && (
          <PlaceholderTreeItem
            imageClassName={styles.newProjectImage}
            name="New space"
            level={2}
            isActive
          />
        )}
        {isLoading && <Loader className={styles.loader} />}
      </Scrollbar>
    </TreeContext.Provider>
  );
};

export default ProjectsTree;
