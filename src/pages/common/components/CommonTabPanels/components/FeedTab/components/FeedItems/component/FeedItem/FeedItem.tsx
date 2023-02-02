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
  isMobileVersion?: boolean;
  governanceId?: string;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    item,
    governanceCircles,
    isMobileVersion = false,
    governanceId,
  } = props;

  if (item.data.type === CommonFeedType.Discussion) {
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
