import React from "react";
import { CommonCard } from "../CommonCard";
import styles from "./FeedCard.module.scss";

export const FeedCard: React.FC = ({ children }) => {
  return <CommonCard className={styles.container}>{children}</CommonCard>;
};
