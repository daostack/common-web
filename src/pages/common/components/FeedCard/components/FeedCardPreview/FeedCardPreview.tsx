import React, { FC, MouseEventHandler, useRef } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef, TimeAgo } from "@/shared/ui-kit";
import styles from "./FeedCardPreview.module.scss";

type FeedCardPreviewProps = {
  className?: string;
  messageCount: number;
  lastActivity: number;
  unreadMessages?: number;
  isActive?: boolean;
  isExpanded?: boolean;
  title?: string;
  lastMessage?: string;
  canBeExpanded?: boolean;
  onClick?: () => void;
  onExpand?: () => void;
  menuItems?: ContextMenuItem[];
} & JSX.IntrinsicElements["div"];

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
    menuItems,
    ...restProps
  } = props;
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const isTabletView = useIsTabletView();

  const handleContextMenu: MouseEventHandler = (event) => {
    if (!isTabletView) {
      event.preventDefault();
      contextMenuRef.current?.open(event.clientX, event.clientY);
    }
  };

  if (!title && !lastActivity) {
    return null;
  }

  return (
    <div
      {...restProps}
      className={classNames(
        styles.container,
        {
          [styles.containerActive]: isActive || (isExpanded && isTabletView),
          [styles.containerExpanded]: isExpanded && canBeExpanded,
        },
        restProps.className,
      )}
      onClick={onClick}
      onContextMenu={handleContextMenu}
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
              {lastMessage}
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
      {menuItems && <ContextMenu ref={contextMenuRef} menuItems={menuItems} />}
    </div>
  );
};
