import React, { FC, MouseEventHandler, useRef, useState, useMemo } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { ButtonIcon } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
import {
  ContextMenu,
  ContextMenuRef,
  TextEditor,
  TimeAgo,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { CustomText } from "@/shared/ui-kit/TextEditor/types";
import { FeedItemBaseContentProps } from "../../../FeedItem";
import { FeedCardTags } from "../FeedCardTags";
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
    type,
    menuItems,
    seenOnce,
    ownerId,
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

  const lastMessageValue = useMemo(() => {
    try {
      const [lastMessageUser, lastMessageContent] = (lastMessage ?? "").split(
        ": ",
      );

      const parsedContent = parseStringToTextEditorValue(lastMessageContent);
      (parsedContent?.[0] as { children: CustomText[] })?.children.unshift({
        text: `${lastMessageUser}: `,
      });

      return parsedContent;
    } catch (err) {
      return parseStringToTextEditorValue();
    }
  }, [lastMessage]);

  if (!title && !lastActivity) {
    return null;
  }

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
              [styles.lastActivityActive]: isActive,
            })}
          >
            <TimeAgo milliseconds={lastActivity} />
          </p>
        </div>
        <div className={styles.bottomContent}>
          {lastMessage ? (
            <TextEditor
              className={styles.lastMessageContainer}
              editorClassName={classNames(styles.text, styles.lastMessage, {
                [styles.lastMessageActive]: isActive,
              })}
              value={lastMessageValue}
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
            />
          </div>
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
