import React, { FC, memo, useEffect } from "react";
import { useDiscussionById, useUserById } from "@/shared/hooks/useCases";
import { CommonFeed, DateFormat, Governance } from "@/shared/models";
import {
  formatDate,
  getCirclesWithLowestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
} from "../FeedCard";
import { LoadingFeedCard } from "../LoadingFeedCard";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles: Governance["circles"];
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { item, governanceCircles } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const {
    fetchDiscussion,
    data: discussion,
    fetched: isDiscussionFetched,
  } = useDiscussionById();
  const isLoading = !isUserFetched || !isDiscussionFetched;
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles ? Object.values(governanceCircles) : null,
    item.circleVisibility,
  );
  const circleNames = getCirclesWithLowestTier(filteredByIdCircles)
    .map(({ name }) => name)
    .join(", ");
  const circleVisibility = circleNames ? `Private, ${circleNames}` : "Public";

  useEffect(() => {
    fetchUser(item.userId);
  }, [item.userId]);

  useEffect(() => {
    if (item.data.discussionId) {
      fetchDiscussion(item.data.discussionId);
    }
  }, [item.data.discussionId]);

  if (isLoading) {
    return <LoadingFeedCard />;
  }

  return (
    <FeedCard>
      <FeedCardHeader
        avatar={user?.photoURL}
        title={getUserName(user)}
        createdAt={`Created: ${formatDate(
          new Date(item.createdAt.seconds * 1000),
          DateFormat.SuperShortSecondary,
        )}`}
        type="Discussion"
        circleVisibility={circleVisibility}
      />
      <FeedCardContent
        title={discussion?.title}
        description={discussion?.message}
      />
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={formatDate(
          new Date(item.updatedAt.seconds * 1000),
          DateFormat.FullTime,
        )}
      />
    </FeedCard>
  );
};

export default memo(DiscussionFeedCard);
