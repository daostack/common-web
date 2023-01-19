import React, { ReactNode } from "react";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import styles from "./FeedCardContent.module.scss";

export interface FeedCardContentProps {
  title?: string;
  subtitle?: ReactNode;
  description?: string;
  image?: string;
}

export const FeedCardContent: React.FC<FeedCardContentProps> = (props) => {
  const { children, title, description, subtitle, image } = props;

  return (
    <div className={styles.container}>
      <FeedGeneralInfo
        title={title}
        description={description}
        subtitle={subtitle}
        image={image}
      />
      {children}
    </div>
  );
};
