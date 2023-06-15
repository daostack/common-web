import React, { FC, MouseEventHandler } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { Image } from "@/shared/components/Image";
import { SmallArrowIcon } from "@/shared/icons";
import { getRandomUserAvatarURL } from "@/shared/utils";
import { useTreeContext } from "../../context";
import { Item } from "../../types";
import styles from "./TreeItemTrigger.module.scss";

interface TreeItemTriggerProps {
  className?: string;
  item: Item;
  level: number;
  isActive: boolean;
  isOpen: boolean;
  onToggle?: () => void;
}

const TreeItemTrigger: FC<TreeItemTriggerProps> = (props) => {
  const { className, item, level, isActive, isOpen, onToggle } = props;
  const { treeItemTriggerStyles } = useTreeContext();
  const { hasMembership = true } = item;

  const handleToggle: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onToggle) {
      event.stopPropagation();
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <NavLink
      className={classNames(
        styles.item,
        {
          [classNames(
            styles.itemActive,
            treeItemTriggerStyles?.containerActive,
          )]: isActive,
          [styles.itemWithoutMembership]: !hasMembership,
        },
        className,
        treeItemTriggerStyles?.container,
      )}
      to={item.path}
      title={item.name}
      aria-label={`Go to ${item.name}`}
    >
      <ButtonIcon
        className={classNames(styles.arrowIconButton, {
          [styles.arrowIconButtonHidden]: !onToggle,
        })}
        onClick={handleToggle}
        aria-label={`${isOpen ? "Hide" : "Show"} ${item.name}'s projects`}
        aria-hidden={!onToggle}
      >
        <SmallArrowIcon
          className={classNames(styles.arrowIcon, {
            [styles.arrowIconOpen]: isOpen,
          })}
        />
      </ButtonIcon>
      <Image
        className={classNames(
          styles.image,
          {
            [classNames(
              styles.imageNonRounded,
              treeItemTriggerStyles?.imageNonRounded,
            )]: level === 1,
            [styles.imageRounded]: level !== 1,
          },
          treeItemTriggerStyles?.image,
        )}
        src={item.image}
        alt={`${item.name}'s image`}
        aria-hidden
        placeholderElement={
          <Image
            className={styles.image}
            src={getRandomUserAvatarURL(item.name)}
            alt={item.name}
          />
        }
      />
      <span className={classNames(styles.name, treeItemTriggerStyles?.name)}>
        {item.name}
      </span>
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
    </NavLink>
  );
};

export default TreeItemTrigger;
