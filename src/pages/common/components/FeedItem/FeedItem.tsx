import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useFeedItemFollow } from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Circles,
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  CommonNotion,
  DirectParent,
} from "@/shared/models";
import { checkIsItemVisibleForUser } from "@/shared/utils";
import { useFeedItemSubscription } from "../../hooks";
import { DiscussionFeedCard } from "../DiscussionFeedCard";
import { OptimisticDiscussionFeedCard } from "../OptimisticDiscussionFeedCard";
import { ProposalFeedCard } from "../ProposalFeedCard";
import { ProjectFeedItem } from "./components";
import { useFeedItemContext } from "./context";
import { FeedItemRef, GetNonAllowedItemsOptions } from "./types";

interface FeedItemProps {
  commonId?: string;
  commonName: string;
  commonMember?: (CommonMember & CirclesPermissions) | null;
  commonImage: string;
  commonNotion?: CommonNotion;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  isProject?: boolean;
  isPinned?: boolean;
  item: CommonFeed;
  governanceCircles?: Circles;
  userCircleIds: string[];
  currentUserId?: string;
  isMobileVersion?: boolean;
  isPreviewMode?: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  sizeKey?: string;
  shouldCheckItemVisibility?: boolean;
  onActiveItemDataChange?: (
    data: FeedLayoutItemChangeData,
    commonId?: string,
  ) => void;
  directParent?: DirectParent | null;
  rootCommonId?: string;
  shouldPreLoadMessages?: boolean;
  level?: number;
  withoutMenu?: boolean;
  onFeedItemUpdate?: (item: CommonFeed, isRemoved: boolean) => void;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
}

const FeedItem = forwardRef<FeedItemRef, FeedItemProps>((props, ref) => {
  const {
    commonId,
    commonName,
    commonImage,
    commonNotion,
    pinnedFeedItems,
    commonMember,
    isProject = false,
    isPinned = false,
    item,
    governanceCircles,
    userCircleIds,
    isMobileVersion = false,
    isPreviewMode = false,
    isActive = false,
    isExpanded = false,
    sizeKey,
    currentUserId,
    shouldCheckItemVisibility = true,
    onActiveItemDataChange: outerOnActiveItemDataChange,
    directParent,
    rootCommonId,
    shouldPreLoadMessages = false,
    withoutMenu,
    level,
    onFeedItemUpdate: outerOnFeedItemUpdate,
    getNonAllowedItems: outerGetNonAllowedItems,
  } = props;
  const {
    onFeedItemUpdate,
    onFeedItemUnfollowed,
    getLastMessage,
    getNonAllowedItems: contextGetNonAllowedItems,
    onUserSelect,
    onFeedItemClick,
    onInternalLinkClick,
    onActiveItemDataChange: contextOnActiveItemDataChange,
  } = useFeedItemContext();
  const feedItemFollow = useFeedItemFollow(
    { feedItemId: item.id, commonId },
    { withSubscription: true },
  );
  useFeedItemSubscription(
    item.id,
    commonId,
    outerOnFeedItemUpdate || onFeedItemUpdate,
  );
  const onActiveItemDataChange =
    outerOnActiveItemDataChange || contextOnActiveItemDataChange;
  const getNonAllowedItems =
    outerGetNonAllowedItems || contextGetNonAllowedItems;

  const handleUserClick = useCallback(
    (userId: string) => {
      if (onUserSelect) {
        onUserSelect(userId, commonId);
      }
    },
    [onUserSelect, commonId],
  );

  const handleActiveItemDataChange = useCallback(
    (data: FeedLayoutItemChangeData) => {
      if (onActiveItemDataChange) {
        onActiveItemDataChange(data, commonId);
      }
    },
    [onActiveItemDataChange, commonId],
  );

  useEffect(() => {
    if (
      feedItemFollow.isUserFeedItemFollowDataFetched &&
      !feedItemFollow.userFeedItemFollowData
    ) {
      if (onFeedItemUnfollowed) {
        onFeedItemUnfollowed(item.id);
      }
    }
  }, [
    feedItemFollow.isUserFeedItemFollowDataFetched,
    feedItemFollow.userFeedItemFollowData,
    item.id,
    onFeedItemUnfollowed,
  ]);


  const generalProps = useMemo(
    () => ({
      ref,
      item,
      commonId,
      commonName,
      commonImage,
      commonNotion,
      pinnedFeedItems,
      isActive,
      isExpanded,
      isProject,
      isPinned,
      governanceCircles,
      isPreviewMode,
      getLastMessage,
      commonMember,
      getNonAllowedItems,
      isMobileVersion,
      onActiveItemDataChange: handleActiveItemDataChange,
      directParent,
      rootCommonId,
      feedItemFollow,
      onUserSelect,
      shouldPreLoadMessages,
      withoutMenu,
      onUserClick: handleUserClick,
      onFeedItemClick,
      onInternalLinkClick,
    }),
    [
      ref,
      item,
      commonId,
      commonName,
      commonImage,
      commonNotion,
      pinnedFeedItems,
      isActive,
      isExpanded,
      isProject,
      isPinned,
      governanceCircles,
      isPreviewMode,
      getLastMessage,
      commonMember,
      getNonAllowedItems,
      isMobileVersion,
      handleActiveItemDataChange,
      directParent,
      rootCommonId,
      feedItemFollow,
      onUserSelect,
      shouldPreLoadMessages,
      withoutMenu,
      handleUserClick,
      onFeedItemClick,
      onInternalLinkClick,
    ],
  );


  if (
    shouldCheckItemVisibility &&
    !checkIsItemVisibleForUser({
      itemCircleVisibility: item.circleVisibility,
      userCircleIds,
      itemUserId: item.userId,
      currentUserId,
      itemDataType: item.data.type,
    })
  ) {
    return null;
  }

  if (item.data.type === CommonFeedType.OptimisticDiscussion) {
    return (
      <OptimisticDiscussionFeedCard
        {...generalProps}
        discussion={item.optimisticData}
      />
    );
  }

  if (item.data.type === CommonFeedType.Discussion) {
    return <DiscussionFeedCard {...generalProps} />;
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard sizeKey={sizeKey} {...generalProps} />;
  }

  if (item.data.type === CommonFeedType.Project) {
    return (
      <ProjectFeedItem
        item={item}
        isMobileVersion={isMobileVersion}
        level={level}
      />
    );
  }

  return null;
});

export default memo(FeedItem);
