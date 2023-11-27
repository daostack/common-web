import React, { forwardRef, memo, useEffect } from "react";
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
import { ProposalFeedCard } from "../ProposalFeedCard";
import { ProjectFeedItem } from "./components";
import { useFeedItemContext } from "./context";
import { FeedItemRef } from "./types";

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
    onActiveItemDataChange,
    directParent,
  } = props;
  const {
    onFeedItemUpdate,
    onFeedItemUnfollowed,
    getLastMessage,
    getNonAllowedItems,
    onUserSelect,
  } = useFeedItemContext();
  const feedItemFollow = useFeedItemFollow(
    { feedItemId: item.id, commonId },
    { withSubscription: true },
  );
  useFeedItemSubscription(item.id, commonId, onFeedItemUpdate);

  useEffect(() => {
    if (
      feedItemFollow.isUserFeedItemFollowDataFetched &&
      !feedItemFollow.userFeedItemFollowData
    ) {
      onFeedItemUnfollowed?.(item.id);
    }
  }, [
    feedItemFollow.isUserFeedItemFollowDataFetched,
    feedItemFollow.userFeedItemFollowData,
  ]);

  if (
    shouldCheckItemVisibility &&
    !checkIsItemVisibleForUser(
      item.circleVisibility,
      userCircleIds,
      item.userId,
      currentUserId,
    )
  ) {
    return null;
  }

  const handleActiveItemDataChange = (data: FeedLayoutItemChangeData) => {
    onActiveItemDataChange?.(data, commonId);
  };

  const generalProps = {
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
    feedItemFollow,
    onUserSelect,
  };

  if (item.data.type === CommonFeedType.Discussion) {
    return <DiscussionFeedCard {...generalProps} />;
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard sizeKey={sizeKey} {...generalProps} />;
  }

  if (item.data.type === CommonFeedType.Project) {
    return <ProjectFeedItem item={item} isMobileVersion={isMobileVersion} />;
  }

  return null;
});

export default memo(FeedItem);
