import React, { ReactNode } from "react";
import classNames from "classnames";
import { CheckIcon } from "@/shared/icons";
import { CommonAvatar } from "@/shared/ui-kit";
import { ProjectsStateItem } from "@/store/states";
import styles from "../BreadcrumbsItem.module.scss";

export const renderMenuItemContent = (
  item: ProjectsStateItem,
  activeItemId?: string,
): ReactNode => {
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
