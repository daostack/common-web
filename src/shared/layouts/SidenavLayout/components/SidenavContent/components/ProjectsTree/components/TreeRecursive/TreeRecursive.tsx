import React, { FC } from "react";
import { Item } from "../../types";
import { TreeItem } from "../TreeItem";
import styles from "./TreeRecursive.module.scss";

interface TreeRecursiveProps {
  items: Item[];
  level?: number;
}

const TreeRecursive: FC<TreeRecursiveProps> = (props) => {
  const { items, level = 1 } = props;

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>
          <TreeItem item={item} level={level}>
            {item.items && item.items.length > 0 ? (
              <TreeRecursive items={item.items} level={level + 1} />
            ) : null}
          </TreeItem>
        </li>
      ))}
    </ul>
  );
};

export default TreeRecursive;
