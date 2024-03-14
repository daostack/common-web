import React, { ReactNode } from "react";
import { CommonFeed, CommonLink, DiscussionNotion } from "@/shared/models";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import { FeedNotionInfo } from "../FeedNotionInfo";
import styles from "./FeedCardContent.module.scss";

export type FeedCardContentProps = JSX.IntrinsicElements["div"] & {
  item?: CommonFeed;
  subtitle?: ReactNode;
  description?: string;
  images?: CommonLink[];
  notion?: DiscussionNotion;
  onClick: () => void;
};

export const FeedCardContent: React.FC<FeedCardContentProps> = (props) => {
  const {
    children,
    item,
    description,
    subtitle,
    images,
    notion,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  return (
    <div
      className={styles.container}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!!notion && <FeedNotionInfo notion={notion} />}
      <FeedGeneralInfo
        item={item}
        description={description}
        subtitle={subtitle}
        images={images}
      />
      {children}
    </div>
  );
};
