import React from "react";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import styles from "./FeedCardContent.module.scss";

export interface FeedCardContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export const FeedCardContent: React.FC<FeedCardContentProps> = (props) => {
  const { children, title, description, subtitle } = props;

  return (
    <div className={styles.container}>
      {title && description && (
        <FeedGeneralInfo
          title={title}
          description={description}
          subtitle={subtitle}
        />
      )}
      {children}
    </div>
  );
};
