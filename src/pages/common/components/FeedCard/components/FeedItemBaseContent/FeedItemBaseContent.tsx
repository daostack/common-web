import React, { FC, MouseEventHandler, useRef, useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { PredefinedTypes } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
  ContextMenu,
  ContextMenuRef,
  TextEditorWithReinitialization as TextEditor,
  TimeAgo,
} from "@/shared/ui-kit";
import { FeedItemBaseContentProps } from "../../../FeedItem";
import { FeedCardTags } from "../FeedCardTags";
import styles from "./FeedItemBaseContent.module.scss";

export const FeedItemBaseContent: FC<FeedItemBaseContentProps> = (props) => {
  const {
    className,
    titleWrapperClassName,
    lastActivity,
    unreadMessages,
    isMobileView,
    isActive = false,
    isExpanded = false,
    canBeExpanded = true,
    title,
    lastMessage,
    onClick,
    type,
    menuItems,
    seenOnce,
    ownerId,
    renderLeftContent,
    isPinned,
    isFollowing,
    isLoading = false,
    discussionPredefinedType,
  } = props;
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const isContextMenuEnabled = Boolean(menuItems && menuItems.length > 0);
  const isHome = discussionPredefinedType === PredefinedTypes.General;

  // Here we get either MouseEven, or TouchEven, but I was struggling with importing them from react
  // and use here to have correct types.
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
    isMobileView && isContextMenuEnabled ? handleLongPress : null,
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

    if (!isMobileView && isContextMenuEnabled) {
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
      className={classNames(
        styles.container,
        {
          [styles.containerActive]: isActive || (isExpanded && isMobileView),
          [styles.containerExpanded]: isExpanded && canBeExpanded,
          [styles.containerLongPressing]: isLongPressing || isLongPressed,
        },
        className,
      )}
      onClick={!isLongPressed ? onClick : undefined}
      onContextMenu={handleContextMenu}
      {...getLongPressProps()}
    >
      {renderLeftContent?.()}
      <div className={styles.content}>
        <div className={styles.topContent}>
          <p
            className={classNames(
              styles.text,
              styles.title,
              titleWrapperClassName,
            )}
          >
            {isLoading || !title ? "Loading..." : title}
          </p>
          <p
            className={classNames(styles.text, styles.lastActivity, {
              [styles.lastActivityActive]:
                isActive || (isExpanded && isMobileView),
            })}
          >
            <TimeAgo milliseconds={lastActivity} />
          </p>
        </div>
        <div className={styles.bottomContent}>
          {!isHome && (
            <>
              {lastMessage && !checkIsTextEditorValueEmpty(lastMessage) ? (
                <TextEditor
                  className={styles.lastMessageContainer}
                  editorClassName={classNames(styles.text, styles.lastMessage, {
                    [styles.lastMessageActive]:
                      isActive || (isExpanded && isMobileView),
                  })}
                  elementStyles={{
                    mention: isActive ? styles.mentionText : "",
                  }}
                  value={lastMessage}
                  readOnly
                />
              ) : (
                <div />
              )}
              <div className={classNames(styles.bottomContentRight)}>
                <FeedCardTags
                  unreadMessages={unreadMessages}
                  type={type}
                  seenOnce={seenOnce}
                  ownerId={ownerId}
                  isActive={isActive}
                  isPinned={isPinned}
                  isFollowing={isFollowing}
                />
              </div>
            </>
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
