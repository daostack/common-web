import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { BreadcrumbItem } from "../../types";
import styles from "./Breadcrumb.module.scss";

interface BreadcrumbProps {
  className?: string;
  item: BreadcrumbItem;
  isLastItem: boolean;
}

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { className: outerClassName, item, isLastItem } = props;
  const className = classNames(styles.item, outerClassName, {
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
