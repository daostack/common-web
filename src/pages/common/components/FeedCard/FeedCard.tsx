import React, { FC, useEffect, useRef, MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useFeedItemContext } from "@/pages/common";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ContextMenuItem } from "@/shared/interfaces";
import { selectRecentStreamId } from "@/store/states";
import { CommonCard } from "../CommonCard";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  className?: string;
  feedItemId: string;
  isHovering?: boolean;
  lastActivity?: number;
  unreadMessages?: number;
  onClick?: () => void;
  title?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  canBeExpanded?: boolean;
  lastMessage?: string;
  isPreviewMode?: boolean;
  menuItems?: ContextMenuItem[];
  itemId?: string;
}

const MOBILE_HEADER_HEIGHT = 52;
const DESKTOP_HEADER_HEIGHT = 72;

export const FeedCard: FC<FeedCardProps> = (props) => {
  const {
    className,
    feedItemId,
    isHovering = false,
    lastActivity = 0,
    unreadMessages = 0,
    isActive = false,
    isExpanded = false,
    canBeExpanded = true,
    onClick,
    children,
    title,
    lastMessage,
    isPreviewMode = true,
    menuItems,
    itemId,
  } = props;
  const isTabletView = useIsTabletView();
  const recentStreamId = useSelector(selectRecentStreamId);
  const { setExpandedFeedItemId, renderFeedItemBaseContent, feedCardSettings } =
    useFeedItemContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpanding = () => {
    if (setExpandedFeedItemId) {
      setExpandedFeedItemId(isExpanded ? null : feedItemId);
    }
  };

  useEffect(() => {
    if (recentStreamId === itemId) {
      toggleExpanding();
    }
  }, [recentStreamId, itemId]);

  function scrollToTargetAdjusted() {
    const headerOffset = isTabletView
      ? MOBILE_HEADER_HEIGHT
      : DESKTOP_HEADER_HEIGHT;
    const elementPosition =
      containerRef.current?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (isExpanded && containerRef?.current) {
      scrollToTargetAdjusted();
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (!isTabletView) {
      toggleExpanding();
    }
    onClick && onClick();
  };

  const handleExpand: MouseEventHandler = (event) => {
    event.stopPropagation();
    toggleExpanding();
  };

  return (
    <div ref={containerRef}>
      {!isPreviewMode &&
        renderFeedItemBaseContent?.({
          lastActivity,
          unreadMessages,
          isMobileView: isTabletView,
          isActive,
          isExpanded,
          canBeExpanded,
          onClick: handleClick,
          onExpand: handleExpand,
          title,
          lastMessage,
          menuItems,
        })}
      {((isExpanded && canBeExpanded) || isPreviewMode) && (
        <CommonCard
          className={classNames(
            styles.container,
            {
              [styles.containerActive]:
                (isActive || (isExpanded && isTabletView)) && !isPreviewMode,
              [styles.containerHovering]:
                isHovering &&
                (feedCardSettings?.withHovering ?? !isPreviewMode),
            },
            className,
            feedCardSettings?.commonCardClassName,
          )}
          hideCardStyles={feedCardSettings?.shouldHideCardStyles ?? true}
        >
          {children}
        </CommonCard>
      )}
    </div>
  );
};
