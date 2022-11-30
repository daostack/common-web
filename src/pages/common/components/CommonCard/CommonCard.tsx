import React, { FC } from "react";
import styles from "./CommonCard.module.scss";

const CommonCard: FC = (props) => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
};

export default CommonCard;
