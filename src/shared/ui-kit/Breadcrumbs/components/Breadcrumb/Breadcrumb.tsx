import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { BreadcrumbItem } from "../../types";
import styles from "./Breadcrumb.module.scss";

interface BreadcrumbProps {
  item: BreadcrumbItem;
  isLastItem: boolean;
}

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { item, isLastItem } = props;
  const className = classNames(styles.item, {
    [styles.itemLast]: isLastItem,
    [styles.itemLink]: item.url,
  });

  return item.url ? (
    <NavLink className={className} to={item.url}>
      {item.text}
    </NavLink>
  ) : (
    <span className={className}>{item.text}</span>
  );
};

export default Breadcrumb;
