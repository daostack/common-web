import React from "react";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import styles from "./FeedCardContent.module.scss";

export interface FeedCardContentProps {
  title: string;
  subtitle?: string;
  description: string;
}

export const FeedCardContent: React.FC<FeedCardContentProps> = ({
  children,
  ...props
}) => {
  return (
    <div className={styles.container}>
      <FeedGeneralInfo {...props} />
      {children}
    </div>
  );
};
