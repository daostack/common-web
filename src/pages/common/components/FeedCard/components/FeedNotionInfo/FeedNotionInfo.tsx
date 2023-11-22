import React from "react";
import { NotionIcon } from "@/shared/icons";
import { DiscussionNotion } from "@/shared/models";
import styles from "./FeedNotionInfo.module.scss";

interface FeedNotionInfoProps {
  notion: DiscussionNotion;
}

export const FeedNotionInfo: React.FC<FeedNotionInfoProps> = (props) => {
  const { notion } = props;

  const linkToNotionPageEl = (
    <a
      className={styles.link}
      href={`https://www.notion.so/${notion?.pageId.split("-").join("")}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Notion pageID: {notion?.pageId}
    </a>
  );

  return (
    <div className={styles.notionInfo}>
      <NotionIcon width={24} height={24} />
      {linkToNotionPageEl}
    </div>
  );
};
