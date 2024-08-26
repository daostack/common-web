import React, {
  useEffect,
  useRef,
  MouseEventHandler,
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import { useCollapse } from "react-collapsed";
import classNames from "classnames";
import { useFeedItemContext } from "@/pages/common";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonFeedType, CommonNotion, PredefinedTypes } from "@/shared/models";
import { Loader, TextEditorValue } from "@/shared/ui-kit";
import { CommonCard } from "../CommonCard";
import {
  MOBILE_HEADER_HEIGHT,
  DESKTOP_HEADER_HEIGHT,
  MOBILE_TAB_NAVIGATION_HEIGHT,
  COLLAPSE_DURATION,
  OFFSET_FROM_BOTTOM_FOR_SCROLLING,
  EXTRA_WAITING_TIME_FOR_TIMEOUT,
} from "./constants";
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
}>;

const FeedCard = (props, ref) => {
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

  const toggleExpanding = useCallback(() => {
    if (setExpandedFeedItemId) {
      setExpandedFeedItemId(isExpanded ? null : feedItemId);
    }
  }, [setExpandedFeedItemId, isExpanded, feedItemId]);

  const scrollToTargetTop = (
    headerOffset: number,
    elementPositionOffset: number,
  ) => {
    const elementPosition =
      (containerRef.current?.getBoundingClientRect().top ?? 0) -
      elementPositionOffset;

    if (isTabletView) {
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      return;
    }

    const itemsContainerEl = document.getElementsByClassName("Pane Pane1")[0];

    if (itemsContainerEl) {
      itemsContainerEl.scrollBy({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTargetAdjusted = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const paneEl = document.getElementsByClassName("Pane Pane1")[0];
    let itemsContainerEl: typeof window | typeof paneEl = window;
    let itemsContainerHeight = window.innerHeight;

    if (!isTabletView) {
      if (!paneEl) {
        return;
      }

      itemsContainerEl = paneEl;
      itemsContainerHeight = paneEl.clientHeight;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const headerOffset = isTabletView ? MOBILE_HEADER_HEIGHT : 0;
      const elementPositionOffset = isTabletView ? 0 : DESKTOP_HEADER_HEIGHT;
      const tabNavigationOffset = isTabletView
        ? MOBILE_TAB_NAVIGATION_HEIGHT
        : 0;
      const itemHeight =
        containerRef.current?.getBoundingClientRect().height || 0;
      const itemBottom =
        (containerRef.current?.getBoundingClientRect().bottom || 0) -
        elementPositionOffset;
      const visibleSpaceForItems =
        itemsContainerHeight - headerOffset - tabNavigationOffset;
      scrollTimeoutRef.current = null;

      if (
        !itemBottom ||
        itemHeight > visibleSpaceForItems ||
        itemBottom - itemHeight < 0
      ) {
        scrollToTargetTop(headerOffset, elementPositionOffset);
        return;
      }

      const itemPositionDifference =
        itemsContainerHeight - tabNavigationOffset - itemBottom;

      if (itemPositionDifference < 0) {
        itemsContainerEl.scrollBy({
          top: -itemPositionDifference + OFFSET_FROM_BOTTOM_FOR_SCROLLING,
          behavior: "smooth",
        });
      }
    }, COLLAPSE_DURATION + EXTRA_WAITING_TIME_FOR_TIMEOUT);
  }, [isTabletView]);

  useEffect(() => {
    if (isExpanded && containerRef?.current) {
      scrollToTargetAdjusted();
      return;
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, [isExpanded, scrollToTargetAdjusted]);

  const handleClick = useCallback(() => {
    onClick?.();

    if (!isTabletView && isActive) {
      toggleExpanding();
    }
  }, [onClick, isTabletView, isActive, toggleExpanding]);

  const handleExpand: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      toggleExpanding();
    },
    [toggleExpanding],
  );

  useImperativeHandle(
    ref,
    () => ({
      itemId: feedItemId,
      scrollToItem: scrollToTargetAdjusted,
    }),
    [feedItemId, scrollToTargetAdjusted],
  );

  const feedItemBaseContent = useMemo(() => {
    return renderFeedItemBaseContent?.({
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
    });
  }, [
    lastActivity,
    unreadMessages,
    isTabletView,
    isActive,
    isExpanded,
    canBeExpanded,
    handleClick,
    handleExpand,
    title,
    lastMessage,
    isLoading,
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
    renderFeedItemBaseContent,
  ]);

  return (
    <div ref={containerRef}>
      {!isPreviewMode && <div {...getToggleProps()}>{feedItemBaseContent}</div>}
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
};

export default forwardRef<FeedCardRef, FeedCardProps>(FeedCard);
