import React, { FC, memo } from "react";
import {
  Circles,
  CommonFeed,
  CommonFeedType,
  CommonMember,
} from "@/shared/models";
import { checkIsItemVisibleForUser } from "@/shared/utils";
import { useFeedItemSubscription } from "../../hooks";
import { DiscussionFeedCard } from "../DiscussionFeedCard";
import { ProposalFeedCard } from "../ProposalFeedCard";
import { useFeedItemContext } from "./context";

interface FeedItemProps {
  commonId?: string;
  commonName: string;
  commonMember?: CommonMember | null;
  commonImage: string;
  isProject?: boolean;
  item: CommonFeed;
  governanceCircles?: Circles;
  userCircleIds: string[];
  currentUserId?: string;
  isMobileVersion?: boolean;
  isPreviewMode?: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  sizeKey?: string;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    commonName,
    commonImage,
    commonMember,
    isProject = false,
    item,
    governanceCircles,
    userCircleIds,
    isMobileVersion = false,
    isPreviewMode = false,
    isActive = false,
    isExpanded = false,
    sizeKey,
    currentUserId,
  } = props;
  const { onFeedItemUpdate, getLastMessage } = useFeedItemContext();
  useFeedItemSubscription(item.id, commonId, onFeedItemUpdate);

  if (
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
    isActive,
    isExpanded,
    isProject,
    governanceCircles,
    isPreviewMode,
    getLastMessage,
    commonMember,
  };

  if (item.data.type === CommonFeedType.Discussion) {
    return (
      <DiscussionFeedCard isMobileVersion={isMobileVersion} {...generalProps} />
    );
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard sizeKey={sizeKey} {...generalProps} />;
  }

  return null;
};

export default memo(FeedItem);
