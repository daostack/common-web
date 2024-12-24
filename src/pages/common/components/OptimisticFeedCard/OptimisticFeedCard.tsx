import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { debounce } from "lodash";
import { selectUser } from "@/pages/Auth/store/selectors";
import { InboxItemType } from "@/shared/constants";
import {
  FeedItemFollowState,
  useCommon,
  useFeedItemUserMetadata,
  usePreloadDiscussionMessagesById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  CommonNotion,
  DirectParent,
  DiscussionWithOptimisticData,
  Governance,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { InternalLinkData } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import { FeedCard } from "../FeedCard";
import {
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "../FeedItem";

interface OptimisticFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  commonName: string;
  commonImage: string;
  commonNotion?: CommonNotion;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  commonMember?: CommonMember | null;
  isProject: boolean;
  isPinned: boolean;
  isPreviewMode: boolean;
  isActive: boolean;
  isExpanded: boolean;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeData) => void;
  discussion?: DiscussionWithOptimisticData;
  directParent?: DirectParent | null;
  rootCommonId?: string;
  feedItemFollow: FeedItemFollowState;
  shouldPreLoadMessages: boolean;
  withoutMenu?: boolean;
  onUserClick?: (userId: string) => void;
  onFeedItemClick: (feedItemId: string) => void;
  onInternalLinkClick: (data: InternalLinkData) => void;
  onExpand?: (isExpanded: boolean) => void;
  type: CommonFeedType;
}

const OptimisticFeedCard = forwardRef<
  FeedItemRef,
  OptimisticFeedCardProps
>((props, ref) => {
  const {
    setChatItem,
    feedItemIdForAutoChatOpen,
    shouldAllowChatAutoOpen,
    nestedItemData,
  } = useChatContext();
  const {
    item,
    isMobileVersion = false,
    commonId,
    commonName,
    commonImage,
    commonNotion: outerCommonNotion,
    isProject,
    discussion,
    isPreviewMode,
    isActive,
    isExpanded,
    getLastMessage,
    onActiveItemDataChange,
    shouldPreLoadMessages,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
    onExpand,
  } = props;

  const isHome = false;
  const discussionNotion = undefined;
  const {
    data: feedItemUserMetadata,
    fetched: isFeedItemUserMetadataFetched,
    fetchFeedItemUserMetadata,
  } = useFeedItemUserMetadata();
  const shouldLoadCommonData =
    isHome || (discussionNotion && !outerCommonNotion);
  const { data: common } = useCommon(shouldLoadCommonData ? commonId : "");
  const preloadDiscussionMessagesData = usePreloadDiscussionMessagesById({
    commonId,
    discussionId: discussion?.id,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
  });
  const menuItems = [];
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const cardTitle = discussion?.title;
  const commonNotion = outerCommonNotion ?? common?.notion;

  const handleOpenChat = useCallback(() => {
    if (discussion && !isPreviewMode) {
      setChatItem({
        feedItemId: item.id,
        discussion,
        circleVisibility: item.circleVisibility,
        lastSeenItem: feedItemUserMetadata?.lastSeen,
        lastSeenAt: feedItemUserMetadata?.lastSeenAt,
        count: feedItemUserMetadata?.count,
        seenOnce: feedItemUserMetadata?.seenOnce,
        seen: feedItemUserMetadata?.seen,
        hasUnseenMention: feedItemUserMetadata?.hasUnseenMention,
        nestedItemData: nestedItemData && {
          ...nestedItemData,
          feedItem: {
            type: InboxItemType.FeedItemFollow,
            itemId: item.id,
            feedItem: item,
          },
        },
      });
    }
  }, [
    discussion,
    item.id,
    item.circleVisibility,
    feedItemUserMetadata?.lastSeen,
    feedItemUserMetadata?.lastSeenAt,
    feedItemUserMetadata?.count,
    feedItemUserMetadata?.seenOnce,
    feedItemUserMetadata?.seen,
    feedItemUserMetadata?.hasUnseenMention,
    nestedItemData,
    isPreviewMode,
  ]);

  const preloadDiscussionMessages = useMemo(
    () =>
      debounce<typeof preloadDiscussionMessagesData.preloadDiscussionMessages>(
        (...args) =>
          preloadDiscussionMessagesData.preloadDiscussionMessages(...args),
        6000,
      ),
    [preloadDiscussionMessagesData.preloadDiscussionMessages],
  );

  useEffect(() => {
    if (commonId) {
      fetchFeedItemUserMetadata({
        userId: userId || "",
        commonId,
        feedObjectId: item.id,
      });
    }
  }, [userId, commonId, item.id]);

  useEffect(() => {
    if (
      (!isActive ||
        shouldAllowChatAutoOpen === null ||
        shouldAllowChatAutoOpen) &&
      isFeedItemUserMetadataFetched &&
      item.id === feedItemIdForAutoChatOpen &&
      !isMobileVersion
    ) {
      handleOpenChat();
    }
  }, [isFeedItemUserMetadataFetched, shouldAllowChatAutoOpen]);

  useEffect(() => {
    if (isActive && shouldAllowChatAutoOpen !== null) {
      handleOpenChat();
    }
  }, [isActive, shouldAllowChatAutoOpen, handleOpenChat]);

  useEffect(() => {
    if (isActive && cardTitle) {
      onActiveItemDataChange?.({
        itemId: item.id,
        title: cardTitle,
      });
    }
  }, [isActive, cardTitle]);

  useEffect(() => {
    if (
      shouldPreLoadMessages &&
      !isActive &&
      commonId &&
      item.circleVisibility
    ) {
      preloadDiscussionMessages(item.circleVisibility);
    }
  }, [shouldPreLoadMessages, isActive]);

  useUpdateEffect(() => {
    if (
      shouldPreLoadMessages &&
      !isActive &&
      commonId &&
      item.circleVisibility
    ) {
      preloadDiscussionMessages(item.circleVisibility, true);
    }
  }, [item.data.lastMessage?.content]);

  return (
    <FeedCard
      ref={ref}
      feedItemId={item.id}
      isHovering={false}
      lastActivity={item.updatedAt.seconds * 1000}
      unreadMessages={feedItemUserMetadata?.count || 0}
      isActive={isActive}
      isExpanded={isExpanded}
      onExpand={onExpand}
      onClick={handleOpenChat}
      title={cardTitle}
      lastMessage={getLastMessage({ lastMessage: discussion?.lastMessageContent, isProject: false, commonName, commonFeedType: CommonFeedType.Discussion})}
      isPreviewMode={false}
      isPinned={false}
      commonName={commonName}
      commonId={commonId}
      image={commonImage}
      imageAlt={`${commonName}'s image`}
      isProject={isProject}
      isFollowing={true}
      isLoading={false}
      menuItems={menuItems}
      seenOnce={true}
      seen={true}
      ownerId={item.userId}
      discussionPredefinedType={discussion?.predefinedType}
      notion={discussionNotion && commonNotion}
      hasUnseenMention={
        isFeedItemUserMetadataFetched &&
        feedItemUserMetadata?.hasUnseenMention
      }
      originalCommonIdForLinking={discussion?.commonId}
      linkedCommonIds={[]}
    />
  );
});

export default OptimisticFeedCard;
