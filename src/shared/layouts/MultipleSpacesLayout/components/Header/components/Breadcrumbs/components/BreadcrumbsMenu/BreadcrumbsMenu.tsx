import React, { forwardRef } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { AddProjectMenuItemContent, MenuItemContent } from "./components";
import styles from "./BreadcrumbsMenu.module.scss";

interface BreadcrumbsMenuProps {
  items: ProjectsStateItem[];
  activeItemId?: string;
  commonIdToAddProject?: string | null;
  isMainLevel?: boolean;
}

const BreadcrumbsMenu = forwardRef<ContextMenuRef, BreadcrumbsMenuProps>(
  (props, ref) => {
    const { items, activeItemId, commonIdToAddProject, isMainLevel } = props;
    const history = useHistory();
    const {
      getCommonPagePath,
      getCommonPageAboutTabPath,
      getProjectCreationPagePath,
    } = useRoutesContext();

    const menuItems: ContextMenuItem[] = items.map((item) => ({
      id: item.commonId,
      text: item.name,
      onClick: () =>
        history.push(
          item.hasMembership
            ? getCommonPagePath(item.commonId)
            : getCommonPageAboutTabPath(item.commonId),
        ),
      className: classNames(styles.contextMenuItem, {
        [styles.contextMenuItemWithoutMembership]: !item.hasMembership,
      }),
      renderContent: () => (
        <MenuItemContent
          item={item}
          isActive={item.commonId === activeItemId}
        />
      ),
    }));

    if (isMainLevel) {
      menuItems.push({
        id: "create-a-common",
        text: "Create a common",
        onClick: () => {
          console.log("Create a common");
        },
        className: classNames(
          styles.contextMenuItem,
          styles.contextMenuItemToAddProject,
        ),
        renderContent: () => (
          <AddProjectMenuItemContent text="Create a common" />
        ),
      });
    }
    if (commonIdToAddProject) {
      menuItems.push({
        id: "add-a-space",
        text: "Add a space",
        onClick: () =>
          history.push(getProjectCreationPagePath(commonIdToAddProject)),
        className: classNames(
          styles.contextMenuItem,
          styles.contextMenuItemToAddProject,
        ),
        renderContent: () => <AddProjectMenuItemContent text="Add a space" />,
      });
    }
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
