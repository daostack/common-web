import React, { useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { MessageIcon } from "@/shared/icons";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./FeedCardFooter.module.scss";

export type FeedCardFooterProps = JSX.IntrinsicElements["div"] & {
  messageCount: number;
  lastActivity: number;
  unreadMessages?: number;
  onMessagesClick?: () => void;
  onLongPress: () => void;
};

export const FeedCardFooter: React.FC<FeedCardFooterProps> = ({
  messageCount,
  lastActivity,
  unreadMessages,
  onMessagesClick,
  onLongPress,
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const handleLongPress = () => {
    onLongPress();

    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(handleLongPress, {
    threshold: 400,
    cancelOnMovement: true,
    onStart: () => setIsLongPressing(true),
    onFinish: () => setIsLongPressing(false),
    onCancel: () => setIsLongPressing(false),
  });

  return (
    <div
      className={classNames(styles.container, {
        [styles.longPressingWrapper]: isLongPressing,
      })}
      {...getLongPressProps()}
    >
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
        {unreadMessages && (
          <div className={styles.unreadMessages}>{unreadMessages}</div>
        )}
      </div>
    </div>
  );
};
