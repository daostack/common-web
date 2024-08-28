import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { SmallArrowIcon } from "@/shared/icons";
import { CommonAvatar } from "@/shared/ui-kit";
import { TreeItemTriggerStyles } from "../../context";
import { Item } from "../../types";
import styles from "./TreeItemTriggerContent.module.scss";

interface TreeItemTriggerContentProps {
  treeItemTriggerStyles?: TreeItemTriggerStyles;
  item: Item;
  level: number;
  isActive: boolean;
  isOpen: boolean;
  onToggle?: () => void;
  handleToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const TreeItemTriggerContent: FC<TreeItemTriggerContentProps> = (props) => {
  const { treeItemTriggerStyles, item, level, isOpen, handleToggle, onToggle } =
    props;

  return (
    <>
      <ButtonIcon
        className={classNames(styles.arrowIconButton, {
          [styles.arrowIconButtonHidden]: !onToggle,
        })}
        onClick={handleToggle}
        aria-label={`${isOpen ? "Hide" : "Show"} ${item.name}'s spaces`}
        aria-hidden={!onToggle}
      >
        {item.items && item.items?.length > 0 && (
          <SmallArrowIcon
            className={classNames(styles.arrowIcon, {
              [styles.arrowIconOpen]: isOpen,
            })}
          />
        )}
      </ButtonIcon>

      <CommonAvatar
        name={item.name}
        src={item.image}
        className={classNames(styles.image, {
          [classNames(
            styles.imageNonRounded,
            treeItemTriggerStyles?.imageNonRounded,
          )]: level === 1,
          [styles.imageRounded]: level !== 1,
        })}
      />

      <span className={classNames(styles.name, treeItemTriggerStyles?.name)}>
        {item.name}
      </span>
      {item.nameRightContent}
      {item.rightContent}
      {!!item.notificationsAmount && (
        <span
          className={styles.notificationsAmount}
          title={`Notifications amount: ${item.notificationsAmount}`}
          aria-label={`Notifications amount: ${item.notificationsAmount}`}
        >
          {item.notificationsAmount}
        </span>
      )}
    </>
  );
};

export default TreeItemTriggerContent;
