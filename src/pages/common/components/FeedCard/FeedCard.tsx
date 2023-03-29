import React, { FC, useState, useEffect } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonCard } from "../CommonCard";
import { FeedCardPreview } from "./components";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  className?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  isLongPressed?: boolean;
  isHovering?: boolean;
  messageCount?: number;
  lastActivity?: number;
  unreadMessages?: number;
  onLongPress?: () => void;
  onClick?: () => void;
  title?: string;
  canBeExpanded?: boolean;
  lastMessage?: string;
  isPreviewMode?: boolean;
}

export const FeedCard: FC<FeedCardProps> = (props) => {
  const {
    className,
    isActive = false,
    isExpanded: isExpandedExternal = false,
    isLongPressed = false,
    isHovering = false,
    onLongPress,
    messageCount = 0,
    lastActivity = 0,
    unreadMessages = 0,
    canBeExpanded = true,
    onClick,
    children,
    title,
    lastMessage,
    isPreviewMode = true,
  } = props;
  const isTabletView = useIsTabletView();

  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setExpanded(false);
    }
  }, [isActive]);

  useEffect(() => {
    setExpanded(isExpandedExternal);
  }, [isExpandedExternal]);

  const handleClick = () => {
    if (!isTabletView) {
      setExpanded((expanded) => !expanded);
    }
    onClick && onClick();
  };

  const handleExpand = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    setExpanded((expanded) => !expanded);
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    }

    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(onLongPress ? handleLongPress : null, {
    threshold: 400,
    cancelOnMovement: true,
    onStart: () => setIsLongPressing(true),
    onFinish: () => setIsLongPressing(false),
    onCancel: () => setIsLongPressing(false),
  });

  return (
    <>
      {!isPreviewMode && (
        <FeedCardPreview
          messageCount={messageCount}
          lastActivity={lastActivity}
          unreadMessages={unreadMessages}
          isActive={isActive}
          isExpanded={isExpanded}
          canBeExpanded={canBeExpanded}
          onClick={handleClick}
          onExpand={handleExpand as () => void}
          title={title}
          lastMessage={lastMessage}
        />
      )}
      {((isExpanded && canBeExpanded) || isPreviewMode) && (
        <CommonCard
          className={classNames(
            styles.container,
            {
              [styles.containerActive]:
                (isActive || (isExpanded && isTabletView)) && !isPreviewMode,
              [styles.containerLongPressing]:
                (isLongPressing || isLongPressed) && !isPreviewMode,
              [styles.containerHovering]: isHovering && !isPreviewMode,
            },
            className,
          )}
          {...getLongPressProps()}
        >
          {children}
        </CommonCard>
      )}
    </>
  );
};
