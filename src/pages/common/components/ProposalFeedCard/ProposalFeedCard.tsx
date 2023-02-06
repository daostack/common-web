import React, { memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember, useProposalUserVote } from "@/pages/OldCommon/hooks";
import {
  useDiscussionById,
  useFeedItemUserMetadata,
  useProposalById,
  useUserById,
} from "@/shared/hooks/useCases";
import { CommonFeed, Governance } from "@/shared/models";
import { checkIsCountdownState, getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
  getVisibilityString,
  FeedCountdown,
} from "../FeedCard";
import { LoadingFeedCard } from "../LoadingFeedCard";
import {
  ProposalFeedVotingInfo,
  ProposalFeedButtonContainer,
  UserVoteInfo,
} from "./components";
import { useProposalSpecificData } from "./hooks";
import {
  checkIsVotingAllowed,
  checkUserPermissionsToVote,
  getProposalDescriptionString,
  getProposalSubtitle,
  getProposalTitleString,
  getProposalTypeString,
} from "./utils";

interface ProposalFeedCardProps {
  commonId: string;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  governanceId?: string;
}

const ProposalFeedCard: React.FC<ProposalFeedCardProps> = (props) => {
  const { commonId, item, governanceCircles, governanceId } = props;
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { activeItemDiscussionId, setChatItem } = useChatContext();
  const {
    fetchUser: fetchFeedItemUser,
    data: feedItemUser,
    fetched: isFeedItemUserFetched,
  } = useUserById();
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
  const {
    data: proposalSpecificData,
    fetched: isProposalSpecificDataFetched,
    fetchData: fetchProposalSpecificData,
  } = useProposalSpecificData();
  const {
    data: feedItemUserMetadata,
    fetched: isFeedItemUserMetadataFetched,
    fetchFeedItemUserMetadata,
  } = useFeedItemUserMetadata();
  const isLoading =
    !isFeedItemUserFetched ||
    !isDiscussionFetched ||
    !isProposalFetched ||
    !proposal ||
    isUserVoteLoading ||
    !isCommonMemberFetched ||
    !isProposalSpecificDataFetched ||
    !isFeedItemUserMetadataFetched;
  const circleVisibility = getVisibilityString(
    governanceCircles,
    item.circleVisibility,
  );
  const proposalId = item.data.id;
  const isActive = discussion?.id === activeItemDiscussionId;

  useEffect(() => {
    fetchFeedItemUser(item.userId);
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

  useEffect(() => {
    fetchFeedItemUserMetadata({
      userId: userId || "",
      commonId,
      feedObjectId: item.id,
    });
  }, [userId, commonId, item.id]);

  useEffect(() => {
    if (proposal) {
      fetchProposalSpecificData(proposal, true);
    }
  }, [proposal?.id]);

  const handleOpenChat = useCallback(() => {
    if (discussion && proposal) {
      setChatItem({
        discussion,
        proposal,
        circleVisibility: item.circleVisibility,
      });
    }
  }, [proposal, discussion, setChatItem, item.circleVisibility]);

  if (isLoading) {
    return <LoadingFeedCard />;
  }

  const isCountdownState = checkIsCountdownState(proposal);
  const userHasPermissionsToVote = checkUserPermissionsToVote({
    proposal,
    commonMember,
  });
  const isVotingAllowed =
    userHasPermissionsToVote &&
    checkIsVotingAllowed({
      userVote,
      proposal,
    });

  return (
    <FeedCard isActive={isActive}>
      <FeedCardHeader
        avatar={feedItemUser?.photoURL}
        title={getUserName(feedItemUser)}
        createdAt={
          <>
            Created:{" "}
            <FeedCountdown
              isCountdownFinished
              expirationTimestamp={item.createdAt}
            />
          </>
        }
        type={getProposalTypeString(proposal.type)}
        circleVisibility={circleVisibility}
        commonId={commonId}
        userId={item.userId}
        governanceId={governanceId}
      />
      <FeedCardContent
        title={getProposalTitleString(proposal, { governanceCircles })}
        subtitle={getProposalSubtitle(proposal, proposalSpecificData)}
        description={getProposalDescriptionString(
          proposal.data.args.description,
          proposal.type,
        )}
        images={discussion?.images}
      >
        <ProposalFeedVotingInfo
          proposal={proposal}
          governanceCircles={governanceCircles}
        />
        {isVotingAllowed && (
          <ProposalFeedButtonContainer
            proposalId={proposal.id}
            onVoteCreate={setVote}
          />
        )}
        <UserVoteInfo
          userVote={userVote}
          userHasPermissionsToVote={userHasPermissionsToVote}
          isCountdownState={isCountdownState}
        />
      </FeedCardContent>
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
        onMessagesClick={handleOpenChat}
      />
    </FeedCard>
  );
};

export default memo(ProposalFeedCard);
