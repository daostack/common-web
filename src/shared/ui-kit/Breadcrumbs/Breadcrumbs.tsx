import React, { FC } from "react";
import { Breadcrumb } from "./components";
import { BreadcrumbItem } from "./types";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
  const { items } = props;

  return (
    <nav aria-label="Breadcrumbs navigation">
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li className={styles.listItem} key={item.id || item.text}>
              <Breadcrumb item={item} isLastItem={isLastItem} />
              {!isLastItem && <>&nbsp;/&nbsp;</>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
