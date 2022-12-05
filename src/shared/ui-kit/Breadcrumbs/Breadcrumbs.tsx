import React, { FC } from "react";
import classNames from "classnames";
import { Breadcrumb } from "./components";
import { BreadcrumbItem } from "./types";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbsStyles {
  listItemWrapper?: string;
  item?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  styles?: BreadcrumbsStyles;
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
  const { items, styles: outerStyles } = props;

  return (
    <nav aria-label="Breadcrumbs navigation">
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li
              className={classNames(
                styles.listItem,
                outerStyles?.listItemWrapper,
              )}
              key={item.id || index}
            >
              <Breadcrumb
                className={outerStyles?.item}
                item={item}
                isLastItem={isLastItem}
              />
              {!isLastItem && <>&nbsp;/&nbsp;</>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
