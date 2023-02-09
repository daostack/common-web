import React, { FC } from "react";
import styles from "./Separator.module.scss";

const Separator: FC = (props) => {
  const { children } = props;

  return (
    <div className={styles.container}>
      <div className={styles.line} />
      <span className={styles.content}>{children}</span>
      <div className={styles.line} />
    </div>
  );
};

export default Separator;
