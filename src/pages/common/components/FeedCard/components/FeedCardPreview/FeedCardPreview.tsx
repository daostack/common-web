import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonFeed } from "@/shared/models";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./FeedCardPreview.module.scss";

interface FeedCardPreviewProps {
  className?: string;
  messageCount: number;
  lastActivity: number;
  unreadMessages?: number;
  isActive?: boolean;
  isExpanded?: boolean;
  title?: string;
  lastMessage?: CommonFeed["data"]["lastMessage"];
  canBeExpanded?: boolean;
  onClick?: () => void;
  onExpand?: () => void;
}

export const FeedCardPreview: FC<FeedCardPreviewProps> = (props) => {
  const {
    lastActivity,
    unreadMessages,
    isActive = false,
    isExpanded = false,
    canBeExpanded = true,
    title,
    lastMessage,
    onClick,
    onExpand,
  } = props;
  const isTabletView = useIsTabletView();

  if (!title && !lastActivity) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerActive]: isActive || (isExpanded && isTabletView),
        [styles.containerExpanded]: isExpanded && canBeExpanded,
      })}
      onClick={onClick}
    >
      {isTabletView && canBeExpanded && (
        <ButtonIcon onClick={onExpand}>
          <RightArrowThinIcon
            className={classNames(styles.expandIcon, {
              [styles.expandIconActive]: isExpanded && canBeExpanded,
            })}
          />
        </ButtonIcon>
      )}
      <div className={styles.content}>
        <div className={styles.topContent}>
          <p className={classNames(styles.text, styles.title)}>{title}</p>
          <p className={classNames(styles.text, styles.lastActivity)}>
            <TimeAgo milliseconds={lastActivity} />
          </p>
        </div>
        <div className={styles.bottomContent}>
          {lastMessage ? (
            <p className={classNames(styles.text, styles.lastMessage)}>
              {lastMessage.userName}: {lastMessage.content}
            </p>
          ) : (
            <div />
          )}
          {Boolean(unreadMessages) && (
            <div
              className={classNames(styles.unreadMessages, {
                [styles.unreadMessagesLong]: Number(unreadMessages) > 9,
              })}
            >
              {unreadMessages}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
