import React, { ReactNode } from "react";
import { CommonLink } from "@/shared/models";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import styles from "./FeedCardContent.module.scss";

export type FeedCardContentProps = JSX.IntrinsicElements["div"] & {
  title?: string;
  subtitle?: ReactNode;
  description?: string;
  images?: CommonLink[];
  onClick: () => void;
};

export const FeedCardContent: React.FC<FeedCardContentProps> = (props) => {
  const { children, title, description, subtitle, images, onClick } = props;

  return (
    <div className={styles.container} onClick={onClick}>
      <FeedGeneralInfo
        title={title}
        description={description}
        subtitle={subtitle}
        images={images}
      />
      {children}
    </div>
  );
};
