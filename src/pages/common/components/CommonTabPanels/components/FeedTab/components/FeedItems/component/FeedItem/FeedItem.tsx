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
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const { commonId, item, governanceCircles } = props;

  if (item.data.type === CommonFeedType.Discussion) {
    return (
      <DiscussionFeedCard item={item} governanceCircles={governanceCircles} />
    );
  }
  if (item.data.type === CommonFeedType.Proposal) {
    return (
      <ProposalFeedCard
        commonId={commonId}
        item={item}
        governanceCircles={governanceCircles}
      />
    );
  }

  return null;
};

export default FeedItem;
