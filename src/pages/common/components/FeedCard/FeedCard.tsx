import React, {
  useEffect,
  useRef,
  MouseEventHandler,
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
} from "react";
import { useCollapse } from "react-collapsed";
import classNames from "classnames";
import { useFeedItemContext } from "@/pages/common";
import { usePreloadDiscussionMessagesById } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonFeedType, CommonNotion, PredefinedTypes } from "@/shared/models";
import { Loader, TextEditorValue } from "@/shared/ui-kit";
import { CommonCard } from "../CommonCard";
import { FeedCardRef } from "./types";
import styles from "./FeedCard.module.scss";

type FeedCardProps = PropsWithChildren<{
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
  lastMessage?: TextEditorValue;
  isPreviewMode?: boolean;
  commonName?: string;
  commonId?: string;
  image?: string;
  imageAlt?: string;
  isProject?: boolean;
  isPinned?: boolean;
  isFollowing?: boolean;
  isLoading?: boolean;
  type?: CommonFeedType;
  menuItems?: ContextMenuItem[];
  seenOnce?: boolean;
  seen?: boolean;
  ownerId?: string;
  discussionPredefinedType?: PredefinedTypes;
  hasFiles?: boolean;
  hasImages?: boolean;
  hasUnseenMention?: boolean;
  notion?: CommonNotion;
  originalCommonIdForLinking?: string;
  linkedCommonIds?: string[];
  circleVisibility?: string[];
  discussionId?: string | null;
}>;

const MOBILE_HEADER_HEIGHT = 52;
const DESKTOP_HEADER_HEIGHT = 72;
const MOBILE_TAB_NAVIGATION_HEIGHT = 65;
const COLLAPSE_DURATION = 300;
const OFFSET_FROM_BOTTOM_FOR_SCROLLING = 10;
const EXTRA_WAITING_TIME_FOR_TIMEOUT = 10;

export const FeedCard = forwardRef<FeedCardRef, FeedCardProps>((props, ref) => {
  const {
    className,
    feedItemId,
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
    commonName,
    commonId,
    image,
    imageAlt,
    isProject,
    isPinned,
    isFollowing,
    isLoading = false,
    type,
    menuItems,
    seenOnce,
    seen,
    hasUnseenMention,
    ownerId,
    discussionPredefinedType,
    hasImages,
    hasFiles,
    notion,
    originalCommonIdForLinking,
    linkedCommonIds,
    circleVisibility,
    discussionId,
  } = props;
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTabletView = useIsTabletView();
  const { setExpandedFeedItemId, renderFeedItemBaseContent, feedCardSettings } =
    useFeedItemContext();
  const isContentVisible = (isExpanded && canBeExpanded) || isPreviewMode;
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: isContentVisible,
    duration: COLLAPSE_DURATION,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const { preloadDiscussionMessages } = usePreloadDiscussionMessagesById({
    commonId,
    discussionId,
  });

  useEffect(() => {
    if (!commonId || !circleVisibility) {
      return;
    }

    preloadDiscussionMessages(commonId, circleVisibility);
  }, [commonId, circleVisibility]);
  const toggleExpanding = () => {
    if (setExpandedFeedItemId) {
      setExpandedFeedItemId(isExpanded ? null : feedItemId);
    }
  };

  const scrollToTargetTop = (headerOffset: number) => {
    const elementPosition =
      containerRef.current?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToTargetAdjusted = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const headerOffset = isTabletView
        ? MOBILE_HEADER_HEIGHT
        : DESKTOP_HEADER_HEIGHT;
      const tabNavigationOffset = isTabletView
        ? MOBILE_TAB_NAVIGATION_HEIGHT
        : 0;
      const itemHeight =
        containerRef.current?.getBoundingClientRect().height || 0;
      const itemBottom = containerRef.current?.getBoundingClientRect().bottom;
      const visibleSpaceForItems =
        window.innerHeight - headerOffset - tabNavigationOffset;
      scrollTimeoutRef.current = null;

      if (!itemBottom || itemHeight > visibleSpaceForItems) {
        scrollToTargetTop(headerOffset);
        return;
      }

      const itemPositionDifference =
        window.innerHeight - tabNavigationOffset - itemBottom;

      if (itemPositionDifference < 0) {
        window.scrollBy({
          top: -itemPositionDifference + OFFSET_FROM_BOTTOM_FOR_SCROLLING,
          behavior: "smooth",
        });
      }
    }, COLLAPSE_DURATION + EXTRA_WAITING_TIME_FOR_TIMEOUT);
  };

  useEffect(() => {
    if (isExpanded && containerRef?.current) {
      scrollToTargetAdjusted();
      return;
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, [isExpanded]);

  const handleClick = () => {
    onClick?.();

    if (!isTabletView && isActive) {
      toggleExpanding();
    }
  };

  const handleExpand: MouseEventHandler = (event) => {
    event.stopPropagation();
    toggleExpanding();
  };

  useImperativeHandle(ref, () => ({
    scrollToItem: scrollToTargetAdjusted,
  }));

  return (
    <div ref={containerRef}>
      {!isPreviewMode && (
        <div {...getToggleProps()}>
          {renderFeedItemBaseContent?.({
            lastActivity,
            unreadMessages,
            isMobileView: isTabletView,
            isActive,
            isExpanded,
            canBeExpanded,
            onClick: handleClick,
            onExpand: handleExpand,
            title,
            lastMessage: !isLoading ? lastMessage : undefined,
            menuItems,
            commonName,
            commonId,
            image,
            imageAlt,
            isProject,
            isPinned,
            isFollowing,
            type,
            seenOnce,
            seen,
            ownerId,
            discussionPredefinedType,
            hasFiles,
            hasImages,
            hasUnseenMention,
            notion,
            originalCommonIdForLinking,
            linkedCommonIds,
          })}
        </div>
      )}
      <div {...getCollapseProps()}>
        <CommonCard
          className={classNames(
            styles.container,
            {
              [styles.containerActive]:
                (isActive || (isExpanded && isTabletView)) && !isPreviewMode,
            },
            className,
            feedCardSettings?.commonCardClassName,
          )}
          hideCardStyles={feedCardSettings?.shouldHideCardStyles ?? true}
        >
          {isLoading ? <Loader className={styles.loader} /> : children}
        </CommonCard>
      </div>
    </div>
  );
});
