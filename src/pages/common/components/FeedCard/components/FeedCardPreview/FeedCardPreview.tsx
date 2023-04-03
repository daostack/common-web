import React, { FC, MouseEventHandler, useRef, useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { ButtonIcon } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import { ContextMenuItem } from "@/shared/interfaces";
import { ContextMenu, ContextMenuRef, TimeAgo } from "@/shared/ui-kit";
import styles from "./FeedCardPreview.module.scss";

interface FeedCardPreviewProps {
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
    menuItems,
  } = props;
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const isTabletView = useIsTabletView();
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const isContextMenuEnabled = Boolean(menuItems && menuItems.length > 0);

  const handleLongPress = (event) => {
    let x = 0;
    let y = 0;

    if (event.touches) {
      const touch = event.touches[0];
      x = touch?.clientX || 0;
      y = touch?.clientY || 0;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    setIsLongPressed(true);
    contextMenuRef.current?.open(x, y);
    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(
    isTabletView && isContextMenuEnabled ? handleLongPress : null,
    {
      threshold: 400,
      cancelOnMovement: true,
      onStart: () => setIsLongPressing(true),
      onFinish: () => setIsLongPressing(false),
      onCancel: () => setIsLongPressing(false),
    },
  );

  const handleContextMenu: MouseEventHandler = (event) => {
    event.preventDefault();

    if (!isTabletView && isContextMenuEnabled) {
      contextMenuRef.current?.open(event.clientX, event.clientY);
    }
  };

  const handleContextMenuOpenChange = (open: boolean) => {
    if (!open) {
      setIsLongPressed(false);
    }
  };

  if (!title && !lastActivity) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerActive]: isActive || (isExpanded && isTabletView),
        [styles.containerExpanded]: isExpanded && canBeExpanded,
        [styles.containerLongPressing]: isLongPressing || isLongPressed,
      })}
      onClick={!isLongPressed ? onClick : undefined}
      onContextMenu={handleContextMenu}
      {...getLongPressProps()}
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
      {menuItems && menuItems.length > 0 && (
        <ContextMenu
          ref={contextMenuRef}
          menuItems={menuItems}
          onOpenChange={handleContextMenuOpenChange}
        />
      )}
    </div>
  );
};
