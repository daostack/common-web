import React, { useEffect } from "react";
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

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles: Governance["circles"];
}

export const DiscussionFeedCard: React.FC<DiscussionFeedCardProps> = (
  props,
) => {
  const { item, governanceCircles } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const {
    fetchDiscussion,
    data: discussion,
    fetched: isDiscussionFetched,
  } = useDiscussionById();
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

  return (
    <FeedCard>
      {isUserFetched && (
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
      )}
      <FeedCardContent
        title={discussion?.title || ""}
        description={discussion?.message || ""}
      />
      {isDiscussionFetched && (
        <FeedCardFooter
          messageCount={discussion?.messageCount || 0}
          lastActivity={formatDate(
            new Date(item.updatedAt.seconds * 1000),
            DateFormat.FullTime,
          )}
        />
      )}
    </FeedCard>
  );
};
