import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
  useUserById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  CommonNotion,
  DirectParent,
  Discussion,
  Governance,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { getUserName, InternalLinkData } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import { FeedCard } from "../FeedCard";
import {
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "../FeedItem";
import { OptimisticFeedCardContent } from "./components";

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
  discussion?: Discussion;
  directParent?: DirectParent | null;
  rootCommonId?: string;
  feedItemFollow: FeedItemFollowState;
  shouldPreLoadMessages: boolean;
  withoutMenu?: boolean;
  onUserClick?: (userId: string) => void;
  onFeedItemClick: (feedItemId: string) => void;
  onInternalLinkClick: (data: InternalLinkData) => void;
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
    governanceCircles,
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
    directParent,
    feedItemFollow,
    shouldPreLoadMessages,
    onUserClick,
    onFeedItemClick,
    onInternalLinkClick,
    type,
  } = props;

  const { fetchUser: fetchDiscussionCreator, data: discussionCreator } =
    useUserById();
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
  const [isHovering, setHovering] = useState(false);
  const onHover = (isMouseEnter: boolean): void => {
    setHovering(isMouseEnter);
  };
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
    fetchDiscussionCreator(item.userId);
  }, [item.userId]);

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

  const lastMessage = useMemo(() => {
    return getLastMessage({
      commonFeedType: item.data.type,
      lastMessage: item.data.lastMessage,
      discussion,
      currentUserId: userId,
      feedItemCreatorName: getUserName(discussionCreator),
      commonName,
      isProject,
      hasFiles: item.data.hasFiles,
      hasImages: item.data.hasImages,
    });
  }, [
    item.data.type,
    item.data.lastMessage,
    discussion,
    userId,
    discussionCreator,
    commonName,
    isProject,
    item.data.hasFiles,
    item.data.hasImages,
  ]);

  return (
    <>
      <FeedCard
        ref={ref}
        feedItemId={item.id}
        isHovering={isHovering}
        lastActivity={item.updatedAt.seconds * 1000}
        unreadMessages={feedItemUserMetadata?.count || 0}
        isActive={isActive}
        isExpanded={isExpanded}
        onClick={handleOpenChat}
        title={cardTitle}
        lastMessage={lastMessage}
        isPreviewMode={false}
        isPinned={false}
        commonName={commonName}
        commonId={commonId}
        image={commonImage}
        imageAlt={`${commonName}'s image`}
        isProject={isProject}
        isFollowing={feedItemFollow.isFollowing}
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
      >
        {(isExpanded || isActive) && (
          <OptimisticFeedCardContent
            item={item}
            governanceCircles={governanceCircles}
            isMobileVersion={isMobileVersion}
            commonId={commonId}
            directParent={directParent}
            onUserSelect={onUserClick && (() => onUserClick(item.userId))}
            discussionCreator={discussionCreator}
            isHome={isHome}
            menuItems={menuItems}
            discussionImages={discussion?.images ?? []}
            discussionMessage={discussion?.message}
            common={common}
            discussionNotion={discussionNotion}
            handleOpenChat={handleOpenChat}
            onHover={onHover}
            isLoading={false}
            type={type}
          />
        )}
      </FeedCard>
    </>
  );
});

export default OptimisticFeedCard;
