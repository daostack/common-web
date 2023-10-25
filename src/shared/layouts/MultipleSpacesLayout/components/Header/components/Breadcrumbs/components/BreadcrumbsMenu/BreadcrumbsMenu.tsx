import React, { forwardRef } from "react";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { useMenuItems } from "./hooks";
import styles from "./BreadcrumbsMenu.module.scss";

interface BreadcrumbsMenuProps {
  items: ProjectsStateItem[];
  activeItemId?: string;
  commonIdToAddProject?: string | null;
  isLoading?: boolean;
  onCommonCreate?: () => void;
}

const BreadcrumbsMenu = forwardRef<ContextMenuRef, BreadcrumbsMenuProps>(
  (props, ref) => {
    const {
      items,
      activeItemId,
      commonIdToAddProject,
      isLoading = false,
      onCommonCreate,
    } = props;
    const menuItems = useMenuItems({
      items,
      activeItemId,
      commonIdToAddProject,
      onCommonCreate,
    });

    if (menuItems.length === 0 && !isLoading) {
      return null;
    }

    return (
      <ContextMenu
        ref={ref}
        menuItems={menuItems}
        listClassName={styles.contextMenuList}
        isLoading={isLoading}
      />
    );
  },
);

export default BreadcrumbsMenu;
