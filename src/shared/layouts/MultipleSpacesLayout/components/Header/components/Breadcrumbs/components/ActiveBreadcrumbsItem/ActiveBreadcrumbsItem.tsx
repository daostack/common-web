import React, { FC, useRef } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";
import { ButtonIcon, UserAvatar } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { RightArrowThinIcon } from "@/shared/icons";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import { renderMenuItemContent } from "../BreadcrumbsItem";
import breadcrumbsItemStyles from "../BreadcrumbsItem/BreadcrumbsItem.module.scss";
import styles from "./ActiveBreadcrumbsItem.module.scss";

interface ActiveBreadcrumbsItemProps {
  name: string;
  image?: string;
  items?: ProjectsStateItem[];
}

const ActiveBreadcrumbsItem: FC<ActiveBreadcrumbsItemProps> = (props) => {
  const { name, image, items = [] } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const itemsButtonRef = useRef<HTMLButtonElement>(null);
  const contextMenuRef = useRef<ContextMenuRef>(null);

  const menuItems: ContextMenuItem[] = items.map((item) => ({
    id: item.commonId,
    text: item.name,
    onClick: () => history.push(getCommonPagePath(item.commonId)),
    className: classNames(breadcrumbsItemStyles.contextMenuItem, {
      [breadcrumbsItemStyles.contextMenuItemWithoutMembership]:
        !item.hasMembership,
    }),
    renderContent: () => renderMenuItemContent(item),
  }));

  const handleButtonClick = () => {
    if (itemsButtonRef.current) {
      const { x, y, height } = itemsButtonRef.current.getBoundingClientRect();
      contextMenuRef.current?.open(x, y + height);
    }
  };

  return (
    <li className={styles.container}>
      {image && (
        <UserAvatar
          className={styles.image}
          photoURL={image}
          nameForRandomAvatar={name}
          userName={name}
        />
      )}
      <span className={styles.name}>{name}</span>
      {items.length > 0 && (
        <ButtonIcon
          ref={itemsButtonRef}
          className={styles.itemsButton}
          onClick={handleButtonClick}
        >
          <RightArrowThinIcon className={styles.itemsIcon} />
        </ButtonIcon>
      )}
      {menuItems.length > 0 && (
        <ContextMenu
          ref={contextMenuRef}
          menuItems={menuItems}
          listClassName={breadcrumbsItemStyles.contextMenuList}
        />
      )}
    </li>
  );
};

export default ActiveBreadcrumbsItem;
