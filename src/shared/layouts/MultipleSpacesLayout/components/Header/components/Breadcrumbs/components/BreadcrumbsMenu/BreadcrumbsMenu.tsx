import React, { forwardRef } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { MenuItemContent } from "./components";
import styles from "./BreadcrumbsMenu.module.scss";

interface BreadcrumbsMenuProps {
  items: ProjectsStateItem[];
  activeItemId?: string;
}

const BreadcrumbsMenu = forwardRef<ContextMenuRef, BreadcrumbsMenuProps>(
  (props, ref) => {
    const { items, activeItemId } = props;
    const history = useHistory();
    const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();

    const renderMenuItemContent = (item: ProjectsStateItem): ReactNode => {
      const isActive = item.commonId === activeItemId;

      return (
        <>
          <CommonAvatar
            className={classNames(styles.contextMenuItemImage, {
              [styles.contextMenuItemImageRounded]: item.directParent,
              [styles.contextMenuItemImageNonRounded]: !item.directParent,
            })}
            name={item.name}
            src={item.image}
          />
          <span className={styles.contextMenuItemName}>{item.name}</span>
          {isActive && (
            <CheckIcon
              className={styles.contextMenuItemCheckIcon}
              fill="currentColor"
            />
          )}
        </>
      );
    };

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
