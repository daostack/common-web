import React from "react";
import styles from "./FeedCard.module.scss";

export const FeedCard: React.FC = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
