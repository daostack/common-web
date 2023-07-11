import React, { forwardRef } from "react";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { useMenuItems } from "./hooks";
import styles from "./BreadcrumbsMenu.module.scss";

interface BreadcrumbsMenuProps {
  items: ProjectsStateItem[];
  activeItemId?: string;
  commonIdToAddProject?: string | null;
  onCommonCreate?: () => void;
}

const BreadcrumbsMenu = forwardRef<ContextMenuRef, BreadcrumbsMenuProps>(
  (props, ref) => {
    const { items, activeItemId, commonIdToAddProject, onCommonCreate } = props;
    const menuItems = useMenuItems({
      items,
      activeItemId,
      commonIdToAddProject,
      onCommonCreate,
    });

    if (menuItems.length === 0) {
      return null;
    }

    return (
      <ContextMenu
        ref={ref}
        menuItems={menuItems}
        listClassName={styles.contextMenuList}
      />
    );
  },
);

export default BreadcrumbsMenu;
