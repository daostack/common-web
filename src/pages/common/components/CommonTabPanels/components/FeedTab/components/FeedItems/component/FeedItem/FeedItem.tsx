import React, { FC } from "react";
import {
  DiscussionFeedCard,
  ProposalFeedCard,
} from "@/pages/common/components";
import { CommonFeed, CommonFeedType, Governance } from "@/shared/models";

interface FeedItemProps {
  commonId: string;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  userCircleIds: string[];
  isMobileVersion?: boolean;
  governanceId?: string;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    item,
    governanceCircles,
    userCircleIds,
    isMobileVersion = false,
    governanceId,
  } = props;

  if (item.data.type === CommonFeedType.Discussion) {
    if (item.circleVisibility.length > 0) {
      if (
        !item.circleVisibility.some((circleId) =>
          userCircleIds.includes(circleId),
        )
      ) {
        return null;
      }
    }

    return (
      <DiscussionFeedCard
        item={item}
        governanceCircles={governanceCircles}
        isMobileVersion={isMobileVersion}
        commonId={commonId}
        governanceId={governanceId}
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
      />
    );
  }

  return null;
};

export default FeedItem;
