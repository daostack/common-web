import React, { CSSProperties, FC } from "react";
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
  isOpen?: boolean;
}

const TreeItem: FC<TreeItemProps> = (props) => {
  const { item, level = 1, isActive = false, isOpen = false, children } = props;
  const itemStyles = {
    "--tree-level": level,
  } as CSSProperties;

  return (
    <div className={styles.itemWrapper} style={itemStyles}>
      <div
        className={classNames(styles.item, {
          [styles.itemActive]: isActive,
        })}
      >
        <ButtonIcon
          className={styles.arrowIconButton}
          aria-label={`${isOpen ? "Close" : "Open"} ${item.name}'s projects`}
        >
          <SmallArrowIcon />
        </ButtonIcon>
        <Image
          className={classNames(styles.image, {
            [styles.imageRounded]: level !== 1,
          })}
          src={item.image}
          alt={`${item.name}'s image`}
        />
        <span className={styles.name}>{item.name}</span>
      </div>
      {children}
    </div>
  );
};

export default TreeItem;
