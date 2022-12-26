import React, { FC } from "react";
import styles from "./Toolbar.module.scss";

const Toolbar: FC = (props) => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
};

export default Toolbar;
