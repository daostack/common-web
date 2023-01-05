import React, { useEffect } from "react";
import { useUserById } from "@/shared/hooks/useCases";
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
      {/*<FeedCardContent {...contentProps} />*/}
      {/*<FeedCardFooter {...footerProps} />*/}
    </FeedCard>
  );
};
