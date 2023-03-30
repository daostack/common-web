import React, { FC } from "react";
import {
  DiscussionFeedCard,
  ProposalFeedCard,
} from "@/pages/common/components";
import { CommonFeed, CommonFeedType, Governance } from "@/shared/models";
import { checkIsItemVisibleForUser } from "@/shared/utils";
import { useFeedItemSubscription } from "../../../../../../../../hooks";

interface FeedItemProps {
  commonId: string;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  userCircleIds: string[];
  commonMemberUserId?: string;
  isMobileVersion?: boolean;
  governanceId?: string;
  isPreviewMode?: boolean;
  isActive?: boolean;
  sizeKey?: string;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    item,
    governanceCircles,
    userCircleIds,
    isMobileVersion = false,
    governanceId,
    isPreviewMode = false,
    isActive = false,
    sizeKey,
    commonMemberUserId,
  } = props;
  useFeedItemSubscription(commonId, item.id);

  if (
    !checkIsItemVisibleForUser(
      item.circleVisibility,
      userCircleIds,
      item.userId,
      commonMemberUserId,
    )
  ) {
    return null;
  }

  if (item.data.type === CommonFeedType.Discussion) {
    return (
      <DiscussionFeedCard
        item={item}
        governanceCircles={governanceCircles}
        isMobileVersion={isMobileVersion}
        commonId={commonId}
        governanceId={governanceId}
        isPreviewMode={isPreviewMode}
      />
    );
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return (
      <ProposalFeedCard
        commonId={commonId}
        item={item}
        governanceCircles={governanceCircles}
        governanceId={governanceId}
        isPreviewMode={isPreviewMode}
        sizeKey={isActive ? sizeKey : undefined}
      />
    );
  }

  return null;
};

export default FeedItem;
