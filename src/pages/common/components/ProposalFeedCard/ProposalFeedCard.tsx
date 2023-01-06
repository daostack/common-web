import React, { memo, useEffect } from "react";
import { useDiscussionById, useUserById } from "@/shared/hooks/useCases";
import { CommonFeed, DateFormat, Governance } from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
  getVisibilityString,
} from "../FeedCard";
import { LoadingFeedCard } from "../LoadingFeedCard";
import {
  ProposalFeedVotingInfo,
  ProposalFeedButtonContainer,
} from "./components";

interface ProposalFeedCardProps {
  item: CommonFeed;
  governanceCircles: Governance["circles"];
}

const ProposalFeedCard: React.FC<ProposalFeedCardProps> = (props) => {
  const { item, governanceCircles } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const {
    fetchDiscussion,
    data: discussion,
    fetched: isDiscussionFetched,
  } = useDiscussionById();
  const isLoading = !isUserFetched || !isDiscussionFetched;
  const circleVisibility = getVisibilityString(
    governanceCircles,
    item.circleVisibility,
  );

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
        type="Proposal"
        circleVisibility={circleVisibility}
      />
      <FeedCardContent>
        {/*<ProposalFeedVotingInfo />*/}
        {/*<ProposalFeedButtonContainer />*/}
      </FeedCardContent>
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
      />
    </FeedCard>
  );
};

export default memo(ProposalFeedCard);
