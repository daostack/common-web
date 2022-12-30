import React from "react";
import classNames from "classnames";
import { Colors } from "@/shared/constants";
import { MessageIcon } from "@/shared/icons";
import styles from "./FeedCardFooter.module.scss";

export interface FeedCardFooterProps {
  messageCount: number;
  lastActivity: string;
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
        <MessageIcon color={Colors.primary400} />
        <p className={classNames(styles.text, styles.messageCount)}>
          {messageCount} Messages
        </p>
      </div>
      <div className={styles.rightContent}>
        <p className={classNames(styles.text, styles.lastActivity)}>
          Last Activity: {lastActivity}
        </p>
        {unreadMessages && (
          <div className={styles.unreadMessages}>{unreadMessages}</div>
        )}
      </div>
    </div>
  );
};
