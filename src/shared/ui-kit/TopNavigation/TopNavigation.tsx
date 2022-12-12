import React, { FC } from "react";
import classNames from "classnames";
import styles from "./TopNavigation.module.scss";

interface TopNavigationProps {
  className?: string;
}

const TopNavigation: FC<TopNavigationProps> = (props) => {
  const { className, children } = props;

  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};

export default TopNavigation;
