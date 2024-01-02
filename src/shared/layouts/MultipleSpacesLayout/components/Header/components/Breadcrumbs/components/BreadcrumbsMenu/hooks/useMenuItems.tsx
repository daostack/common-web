import React from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { ContextMenuItem } from "@/shared/interfaces";
import { ProjectsStateItem } from "@/store/states";
import { AddProjectMenuItemContent, MenuItemContent } from "../components";
import styles from "../BreadcrumbsMenu.module.scss";

interface Options {
  items: ProjectsStateItem[];
  activeItemId?: string;
  commonIdToAddProject?: string | null;
  onCommonCreate?: () => void;
}

export const useMenuItems = (options: Options): ContextMenuItem[] => {
  const { items, activeItemId, commonIdToAddProject, onCommonCreate } = options;
  const history = useHistory();
  const { getCommonPagePath, getProjectCreationPagePath } = useRoutesContext();

  const menuItems: ContextMenuItem[] = items.map((item) => ({
    id: item.commonId,
    text: item.name,
    onClick: () => history.push(getCommonPagePath(item.commonId)),
    className: classNames(styles.contextMenuItem, {
      [styles.contextMenuItemWithoutMembership]: !item.hasMembership,
    }),
    renderContent: () => (
      <MenuItemContent item={item} isActive={item.commonId === activeItemId} />
    ),
  }));

  if (onCommonCreate) {
    menuItems.push({
      id: "create-a-common",
      text: "Create a common",
      onClick: onCommonCreate,
      className: classNames(
        styles.contextMenuItem,
        styles.contextMenuItemToAddProject,
      ),
      renderContent: () => <AddProjectMenuItemContent text="Create a common" />,
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

  return menuItems;
};
