import React, { FC, memo } from "react";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Circles,
  Common,
  CommonFeed,
  CommonFeedType,
  CommonLink,
  CommonMember,
  DirectParent,
} from "@/shared/models";
import { checkIsItemVisibleForUser } from "@/shared/utils";
import { useFeedItemSubscription } from "../../hooks";
import { DiscussionFeedCard } from "../DiscussionFeedCard";
import { ProposalFeedCard } from "../ProposalFeedCard";
import { ProjectFeedItem } from "./components";
import { useFeedItemContext } from "./context";

interface FeedItemProps {
  commonId?: string;
  commonName: string;
  commonMember?: CommonMember | null;
  commonImage: string;
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
  onActiveItemDataChange?: (data: FeedLayoutItemChangeData) => void;
  directParent?: DirectParent | null;
  commonDescription?: string;
  commonGallery?: CommonLink[];
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    commonName,
    commonImage,
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
    commonDescription,
    commonGallery,
  } = props;
  const { onFeedItemUpdate, getLastMessage, getNonAllowedItems, onUserSelect } =
    useFeedItemContext();
  useFeedItemSubscription(item.id, commonId, onFeedItemUpdate);

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

  const generalProps = {
    item,
    commonId,
    commonName,
    commonImage,
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
    onActiveItemDataChange,
    directParent,
    onUserSelect,
  };

  if (item.data.type === CommonFeedType.Discussion) {
    return (
      <DiscussionFeedCard
        {...generalProps}
        commonDescription={commonDescription}
        commonGallery={commonGallery}
      />
    );
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard sizeKey={sizeKey} {...generalProps} />;
  }

  if (item.data.type === CommonFeedType.Project) {
    return <ProjectFeedItem item={item} isMobileVersion={isMobileVersion} />;
  }

  return null;
};

export default memo(FeedItem);
