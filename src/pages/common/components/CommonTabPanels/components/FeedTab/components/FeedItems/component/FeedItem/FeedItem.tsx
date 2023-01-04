import React, { FC } from "react";
import { ProposalFeedCard } from "@/pages/common/components/ProposalFeedCard";
import { CommonFeed, CommonFeedType } from "@/shared/models";

interface FeedItemProps {
  item: CommonFeed;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const { item } = props;

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard item={item} />;
  }

  return null;
};

export default FeedItem;
