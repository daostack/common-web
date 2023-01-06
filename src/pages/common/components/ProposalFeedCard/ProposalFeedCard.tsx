import React, { memo, useEffect } from "react";
import { useCommonMember, useProposalUserVote } from "@/pages/OldCommon/hooks";
import {
  useDiscussionById,
  useProposalById,
  useUserById,
} from "@/shared/hooks/useCases";
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
  UserVoteInfo,
} from "./components";

interface ProposalFeedCardProps {
  commonId: string;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
}

const ProposalFeedCard: React.FC<ProposalFeedCardProps> = (props) => {
  const { commonId, item, governanceCircles } = props;
  const { fetchUser, data: user, fetched: isUserFetched } = useUserById();
  const {
    fetchDiscussion,
    data: discussion,
    fetched: isDiscussionFetched,
  } = useDiscussionById();
  const {
    fetchProposal,
    data: proposal,
    fetched: isProposalFetched,
  } = useProposalById();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const {
    data: userVote,
    loading: isUserVoteLoading,
    fetchProposalVote,
    setVote,
  } = useProposalUserVote();
  const isLoading =
    !isUserFetched ||
    !isDiscussionFetched ||
    !isProposalFetched ||
    !proposal ||
    isUserVoteLoading ||
    !isCommonMemberFetched;
  const circleVisibility = getVisibilityString(
    governanceCircles,
    item.circleVisibility,
  );
  const proposalId = item.data.id;

  useEffect(() => {
    fetchUser(item.userId);
  }, [item.userId]);

  useEffect(() => {
    if (item.data.discussionId) {
      fetchDiscussion(item.data.discussionId);
    }
  }, [item.data.discussionId]);

  useEffect(() => {
    fetchProposal(item.data.id);
  }, [item.data.id]);

  useEffect(() => {
    fetchProposalVote(proposalId);
  }, [fetchProposalVote, proposalId]);

  useEffect(() => {
    if (commonId) {
      fetchCommonMember(commonId, {});
    }
  }, [fetchCommonMember, commonId]);

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
      <FeedCardContent
        title={proposal.data.args.title}
        description={proposal.data.args.description}
      >
        <ProposalFeedVotingInfo
          proposal={proposal}
          governanceCircles={governanceCircles}
        />
        <ProposalFeedButtonContainer
          userVote={userVote}
          proposal={proposal}
          commonMember={commonMember}
        />
        <UserVoteInfo userVote={userVote} state={proposal.state} />
      </FeedCardContent>
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
      />
    </FeedCard>
  );
};

export default memo(ProposalFeedCard);
