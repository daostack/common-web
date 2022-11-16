import React, { CSSProperties, FC, MouseEventHandler, useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { Image } from "@/shared/components/Image";
import { SmallArrowIcon } from "@/shared/icons";
import { Item } from "../../types";
import styles from "./TreeItem.module.scss";

interface TreeItemProps {
  item: Item;
  level?: number;
  isActive?: boolean;
}

const TreeItem: FC<TreeItemProps> = (props) => {
  const { item, level = 1, isActive = false, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const itemStyles = {
    "--tree-level": level,
  } as CSSProperties;
  const hasNestedContent = Boolean(children);

  const onIconClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (hasNestedContent) {
      event.stopPropagation();
      event.preventDefault();
      setIsOpen((value) => !value);
    }
  };

  return (
    <div className={styles.itemWrapper} style={itemStyles}>
      <NavLink
        className={classNames(styles.item, {
          [styles.itemActive]: isActive,
        })}
        to={item.path}
      >
        <ButtonIcon
          className={classNames(styles.arrowIconButton, {
            [styles.arrowIconButtonHidden]: !hasNestedContent,
          })}
          onClick={onIconClick}
          aria-label={`${isOpen ? "Close" : "Open"} ${item.name}'s projects`}
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
        />
        <span className={styles.name}>{item.name}</span>
      </NavLink>
      {isOpen ? children : null}
    </div>
  );
};

export default TreeItem;
