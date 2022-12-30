import React from "react";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
  FeedCardContentProps,
  FeedCardHeaderProps,
  FeedCardFooterProps,
} from "../FeedCard";

interface DiscussionFeedCardProps {
  headerProps: FeedCardHeaderProps;
  contentProps: FeedCardContentProps;
  footerProps: FeedCardFooterProps;
}

export const DiscussionFeedCard: React.FC<DiscussionFeedCardProps> = ({
  headerProps,
  contentProps,
  footerProps,
}) => {
  return (
    <FeedCard>
      <FeedCardHeader {...headerProps} />
      <FeedCardContent {...contentProps} />
      <FeedCardFooter {...footerProps} />
    </FeedCard>
  );
};
