import React, { FC } from "react";
import classNames from "classnames";
import { useTreeContext } from "../../context";
import { Item } from "../../types";
import { TreeItem } from "../TreeItem";
import styles from "./TreeRecursive.module.scss";

interface TreeRecursiveProps {
  className?: string;
  items: Item[];
  parentName?: string;
  level?: number;
}

const TreeRecursive: FC<TreeRecursiveProps> = (props) => {
  const { className, items, parentName, level = 1 } = props;
  const { activeItemId } = useTreeContext();
  const isFirstLevel = level === 1;

  return (
    <ul
      className={classNames(styles.list, className)}
      role={isFirstLevel ? "tree" : "group"}
      aria-multiselectable={isFirstLevel ? false : undefined}
      aria-label={
        parentName && !isFirstLevel
          ? `Projects of ${parentName}`
          : "List of related to you projects"
      }
    >
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          level={level}
          isActive={item.id === activeItemId}
        >
          {item.items && item.items.length > 0 ? (
            <TreeRecursive
              items={item.items}
              parentName={item.name}
              level={level + 1}
            />
          ) : null}
        </TreeItem>
      ))}
    </ul>
  );
};

export default TreeRecursive;
