import React, { FC, MouseEventHandler, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import {
  FeedCardTags,
  FeedItemBaseContentProps,
  useFeedItemContext,
} from "@/pages/common";
import { useRoutesContext } from "@/shared/contexts";
import { NotionIcon } from "@/shared/icons";
import { PredefinedTypes } from "@/shared/models";
import {
  ContextMenu,
  ContextMenuRef,
  TextEditorWithReinitialization as TextEditor,
  TimeAgo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  checkIsTextEditorValueEmpty,
} from "@/shared/ui-kit";
import { CommonAvatar } from "@/shared/ui-kit/CommonAvatar";
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
    type,
    menuItems,
    seenOnce,
    seen,
    ownerId,
    commonName,
    renderImage,
    image,
    imageAlt,
    isImageRounded,
    isProject,
    discussionPredefinedType,
    dmUserIds,
    commonId,
    hasUnseenMention,
    groupMessage,
    createdBy,
    hoverTitle,
    notion,
  } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const { onUserSelect } = useFeedItemContext();
  const isContextMenuEnabled = Boolean(menuItems && menuItems.length > 0);
  const finalTitle =
    discussionPredefinedType === PredefinedTypes.General && commonName
      ? commonName
      : title;
  const shouldImageBeRounded =
    typeof isImageRounded === "boolean" ? isImageRounded : isProject;
  const imageClassName = classNames(styles.image, {
    [styles.imageNonRounded]: !shouldImageBeRounded,
    [styles.imageRounded]: shouldImageBeRounded,
  });

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

  const handleAvatarClick = () => {
    if (onUserSelect && dmUserIds && !groupMessage) {
      onUserSelect(dmUserIds[0]);
    } else if (commonId) {
      history.push(getCommonPagePath(commonId));
    }
  };

  const lastMessageClassName = classNames(styles.text, styles.lastMessage, {
    [styles.lastMessageActive]: isActive || (isExpanded && isMobileView),
  });

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
      <div onClick={handleAvatarClick}>
        {renderImage?.(imageClassName) || (
          <CommonAvatar
            name={commonName}
            src={image}
            className={imageClassName}
            alt={imageAlt}
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.topContent}>
          <div
            className={classNames(styles.text, styles.title, {
              [styles.titleActive]: isActive,
            })}
          >
            <span
              title={typeof hoverTitle === "string" ? hoverTitle : undefined}
            >
              {finalTitle || "Loading..."}
            </span>
            {Boolean(notion) && (
              <Tooltip placement="top-start">
                <TooltipTrigger asChild>
                  <div className={styles.tooltipTriggerContainer}>
                    <NotionIcon />
                  </div>
                </TooltipTrigger>
                <TooltipContent className={styles.tooltipContent}>
                  <span>Notion sync</span>
                  <span>Database: {notion?.title}</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
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
              editorClassName={lastMessageClassName}
              value={lastMessage}
              elementStyles={{
                mention: isActive ? styles.mentionText : "",
              }}
              readOnly
            />
          ) : (
            groupMessage &&
            createdBy && (
              <span className={lastMessageClassName}>
                {`${createdBy} created this group chat`}
              </span>
            )
          )}
          <div className={styles.bottomContentRight}>
            <FeedCardTags
              unreadMessages={unreadMessages}
              type={type}
              seenOnce={seenOnce}
              seen={seen}
              ownerId={ownerId}
              isActive={isActive}
              isPinned={false}
              hasUnseenMention={hasUnseenMention}
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
