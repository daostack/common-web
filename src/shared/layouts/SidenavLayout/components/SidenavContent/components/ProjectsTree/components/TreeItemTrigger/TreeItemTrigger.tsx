import React, { FC, MouseEventHandler } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { Image } from "@/shared/components/Image";
import { SmallArrowIcon } from "@/shared/icons";
import { Item } from "../../types";
import styles from "./TreeItemTrigger.module.scss";

interface TreeItemTriggerProps {
  item: Item;
  level: number;
  isActive: boolean;
  isOpen: boolean;
  onToggle?: () => void;
}

const TreeItemTrigger: FC<TreeItemTriggerProps> = (props) => {
  const { item, level, isActive, isOpen, onToggle } = props;
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
      className={classNames(styles.item, {
        [styles.itemActive]: isActive,
      })}
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
        className={classNames(styles.image, {
          [styles.imageRounded]: level !== 1,
        })}
        src={item.image}
        alt={`${item.name}'s image`}
        aria-hidden
      />
      <span
        className={classNames(styles.name, {
          [styles.nameWithoutMembership]: !hasMembership,
        })}
      >
        {item.name}
      </span>
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
