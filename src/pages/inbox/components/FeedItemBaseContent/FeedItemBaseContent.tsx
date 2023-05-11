import React, { FC, MouseEventHandler, useRef, useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { FeedItemBaseContentProps } from "@/pages/common";
import { ButtonIcon, Image } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
import {
  ContextMenu,
  ContextMenuRef,
  TextEditorWithReinitialization as TextEditor,
  TimeAgo,
  checkIsTextEditorValueEmpty,
} from "@/shared/ui-kit";
import styles from "./FeedItemBaseContent.module.scss";

export const FeedItemBaseContent: FC<FeedItemBaseContentProps> = (props) => {
  const {
    lastActivity,
    unreadMessages,
    isMobileView,
    isActive = false,
    isExpanded = false,
    canBeExpanded = true,
    title,
    lastMessage,
    onClick,
    onExpand,
    menuItems,
    image,
    imageAlt,
    isProject,
  } = props;
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const isContextMenuEnabled = Boolean(menuItems && menuItems.length > 0);

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

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerActive]: isActive || (isExpanded && isMobileView),
        [styles.containerExpanded]: isExpanded && canBeExpanded,
        [styles.containerLongPressing]: isLongPressing || isLongPressed,
      })}
      onClick={!isLongPressed ? onClick : undefined}
      onContextMenu={handleContextMenu}
      {...getLongPressProps()}
    >
      {isMobileView && canBeExpanded && (
        <ButtonIcon onClick={onExpand}>
          <RightArrowThinIcon
            className={classNames(styles.expandIcon, {
              [styles.expandIconActive]: isExpanded && canBeExpanded,
            })}
          />
        </ButtonIcon>
      )}
      <Image
        className={classNames(styles.image, {
          [styles.imageNonRounded]: !isProject,
          [styles.imageRounded]: isProject,
        })}
        src={image}
        alt={imageAlt || ""}
        placeholderElement={null}
        aria-hidden
      />
      <div className={styles.content}>
        <div className={styles.topContent}>
          <p
            className={classNames(styles.text, styles.title, {
              [styles.titleActive]: isActive,
            })}
          >
            {title || "Loading..."}
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
          {lastMessage && !checkIsTextEditorValueEmpty(lastMessage) ? (
            <TextEditor
              className={styles.lastMessageContainer}
              editorClassName={classNames(styles.text, styles.lastMessage, {
                [styles.lastMessageActive]:
                  isActive || (isExpanded && isMobileView),
              })}
              value={lastMessage}
              elementStyles={{
                mention: isActive ? styles.mentionText : "",
              }}
              readOnly
            />
          ) : (
            <div />
          )}
          {Boolean(unreadMessages) && (
            <div
              className={classNames(styles.unreadMessages, {
                [styles.unreadMessagesLong]: Number(unreadMessages) > 9,
                [styles.unreadMessagesActive]: isActive,
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
