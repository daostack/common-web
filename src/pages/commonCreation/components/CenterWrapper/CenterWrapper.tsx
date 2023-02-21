import React, { FC } from "react";
import styles from "./CenterWrapper.module.scss";

const CenterWrapper: FC = (props) => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
};

export default CenterWrapper;
