import React, { FC } from "react";
import classNames from "classnames";
import styles from "./EmptyLayout.module.scss";

const EmptyLayout: FC = (props) => {
  const { children } = props;

  return <div className={classNames(styles.container)}>{children}</div>;
};

export default EmptyLayout;
