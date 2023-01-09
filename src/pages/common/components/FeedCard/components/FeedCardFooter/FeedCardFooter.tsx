import React from "react";
import classNames from "classnames";
import { MessageIcon } from "@/shared/icons";
import { LastActivity } from "../LastActivity";
import styles from "./FeedCardFooter.module.scss";

export interface FeedCardFooterProps {
  messageCount: number;
  lastActivity: number;
  unreadMessages?: number;
}

export const FeedCardFooter: React.FC<FeedCardFooterProps> = ({
  messageCount,
  lastActivity,
  unreadMessages,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <MessageIcon className={styles.messageIcon} />
        <p className={classNames(styles.text, styles.messageCount)}>
          {messageCount} Message{messageCount === 1 ? "" : "s"}
        </p>
      </div>
      <div className={styles.rightContent}>
        <p className={classNames(styles.text, styles.lastActivity)}>
          Last Activity: <LastActivity milliseconds={lastActivity} />
        </p>
        {unreadMessages && (
          <div className={styles.unreadMessages}>{unreadMessages}</div>
        )}
      </div>
    </div>
  );
};
