import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember, useProposalUserVote } from "@/pages/OldCommon/hooks";
import {
  useDiscussionById,
  useFeedItemUserMetadata,
  useProposalById,
  useUserById,
} from "@/shared/hooks/useCases";
import { CommonFeed, Governance, PredefinedTypes } from "@/shared/models";
import { checkIsCountdownState, getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  getVisibilityString,
  FeedCountdown,
  getLastMessage,
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
  getProposalTypeString,
} from "./utils";

interface ProposalFeedCardProps {
  commonId: string;
  commonName: string;
  isProject: boolean;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  governanceId?: string;
  isPreviewMode?: boolean;
  sizeKey?: string;
  isActive: boolean;
  isExpanded: boolean;
}

const ProposalFeedCard: React.FC<ProposalFeedCardProps> = (props) => {
  const {
    commonId,
    commonName,
    isProject,
    item,
    governanceCircles,
    governanceId,
    isPreviewMode,
    isActive,
    isExpanded,
  } = props;
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { setChatItem, feedItemIdForAutoChatOpen } = useChatContext();
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
    proposal?.type,
    getUserName(feedItemUser),
  );
  const [isHovering, setHovering] = useState(false);
  const onHover = (isMouseEnter: boolean): void => {
    setHovering(isMouseEnter);
  };
  const proposalId = item.data.id;

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
        feedItemId: item.id,
        discussion,
        proposal,
        circleVisibility: item.circleVisibility,
        lastSeenItem: feedItemUserMetadata?.lastSeen,
      });
    }
  }, [
    item.id,
    proposal,
    discussion,
    setChatItem,
    item.circleVisibility,
    feedItemUserMetadata?.lastSeen,
  ]);

  useEffect(() => {
    if (
      isDiscussionFetched &&
      isProposalFetched &&
      isFeedItemUserMetadataFetched &&
      item.id === feedItemIdForAutoChatOpen
    ) {
      handleOpenChat();
    }
  }, [isDiscussionFetched, isProposalFetched, isFeedItemUserMetadataFetched]);

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
    <FeedCard
      feedItemId={item.id}
      isHovering={isHovering}
      onClick={handleOpenChat}
      lastActivity={item.updatedAt.seconds * 1000}
      isActive={isActive}
      isExpanded={isExpanded}
      unreadMessages={feedItemUserMetadata?.count || 0}
      title={discussion?.title}
      lastMessage={getLastMessage({
        commonFeedType: item.data.type,
        lastMessage: item.data.lastMessage,
        discussion,
        currentUserId: userId,
        feedItemCreatorName: getUserName(feedItemUser),
        commonName,
        isProject,
      })}
      canBeExpanded={discussion?.predefinedType !== PredefinedTypes.General}
      isPreviewMode={isPreviewMode}
    >
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
        subtitle={getProposalSubtitle(proposal, proposalSpecificData)}
        description={getProposalDescriptionString(
          proposal.data.args.description,
          proposal.type,
        )}
        images={discussion?.images}
        onClick={handleOpenChat}
        onMouseEnter={() => {
          onHover(true);
        }}
        onMouseLeave={() => {
          onHover(false);
        }}
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
    </FeedCard>
  );
};

export default memo(ProposalFeedCard);
