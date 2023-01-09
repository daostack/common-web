import React, { FC, memo, useEffect } from "react";
import { useDiscussionById, useUserById } from "@/shared/hooks/useCases";
import { CommonFeed, DateFormat, Governance } from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
} from "../FeedCard";
import { getVisibilityString } from "../FeedCard";
import { LoadingFeedCard } from "../LoadingFeedCard";
import { useMenuItems } from "./hooks";

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
  const menuItems = useMenuItems();
  const isLoading = !isUserFetched || !isDiscussionFetched;
  const circleVisibility = getVisibilityString(
    governanceCircles,
    discussion?.circleVisibility,
  );

  useEffect(() => {
    fetchUser(item.userId);
  }, [item.userId]);

  useEffect(() => {
    fetchDiscussion(item.data.id);
  }, [item.data.id]);

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
        menuItems={menuItems}
      />
      <FeedCardContent
        title={discussion?.title}
        description={discussion?.message}
      />
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
      />
    </FeedCard>
  );
};

export default memo(DiscussionFeedCard);
