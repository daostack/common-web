import React from "react";
import classNames from "classnames";
import { MessageIcon } from "@/shared/icons";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./FeedCardFooter.module.scss";

export type FeedCardFooterProps = JSX.IntrinsicElements["div"] & {
  messageCount: number;
  lastActivity: number;
  unreadMessages?: number;
  onMessagesClick?: () => void;
  onClick: () => void;
};

export const FeedCardFooter: React.FC<FeedCardFooterProps> = ({
  messageCount,
  lastActivity,
  unreadMessages,
  onMessagesClick,
  onClick,
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.leftContent} onClick={onMessagesClick}>
        <MessageIcon className={styles.messageIcon} />
        <p className={classNames(styles.text, styles.messageCount)}>
          {messageCount} Message{messageCount === 1 ? "" : "s"}
        </p>
      </div>
      <div className={styles.rightContent}>
        <p className={classNames(styles.text, styles.lastActivity)}>
          Last Activity: <TimeAgo milliseconds={lastActivity} />
        </p>
        {Boolean(unreadMessages) && (
          <div className={styles.unreadMessages}>{unreadMessages}</div>
        )}
      </div>
    </div>
  );
};
