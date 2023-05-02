import React, { ReactNode, useCallback, useEffect, useState } from "react";
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
import { useMenuItems } from "../DiscussionFeedCard/hooks";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  getVisibilityString,
  FeedCountdown,
} from "../FeedCard";
import { GetLastMessageOptions } from "../FeedItem";
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
  commonId?: string;
  commonName: string;
  commonImage: string;
  isProject: boolean;
  isPinned: boolean;
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isPreviewMode?: boolean;
  sizeKey?: string;
  isActive: boolean;
  isExpanded: boolean;
  getLastMessage: (options: GetLastMessageOptions) => string;
}

const ProposalFeedCard: React.FC<ProposalFeedCardProps> = (props) => {
  const {
    commonId,
    commonName,
    commonImage,
    isProject,
    isPinned,
    item,
    governanceCircles,
    isPreviewMode,
    isActive,
    isExpanded,
    getLastMessage,
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
    !isFeedItemUserMetadataFetched ||
    !commonId ||
    !governanceCircles;
  const [isHovering, setHovering] = useState(false);
  const onHover = (isMouseEnter: boolean): void => {
    setHovering(isMouseEnter);
  };
  const proposalId = item.data.id;
  const menuItems = useMenuItems(
    {
      feedItem: item,
      discussion,
      governanceCircles,
      commonMember,
    },
    {
      report: () => {},
      share: () => {},
    },
  );

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
    if (commonId) {
      fetchFeedItemUserMetadata({
        userId: userId || "",
        commonId,
        feedObjectId: item.id,
      });
    }
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

  const renderContent = (): ReactNode => {
    if (isLoading) {
      return null;
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
    const circleVisibility = getVisibilityString(
      governanceCircles,
      item.circleVisibility,
      proposal?.type,
      getUserName(feedItemUser),
    );

    return (
      <>
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
          menuItems={menuItems}
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
      </>
    );
  };

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
      image={commonImage}
      imageAlt={`${commonName}'s image`}
      isProject={isProject}
      isPinned={isPinned}
      isLoading={isLoading}
      type={item.data.type}
      seenOnce={feedItemUserMetadata?.seenOnce}
      menuItems={menuItems}
      ownerId={item.userId}
    >
      {renderContent()}
    </FeedCard>
  );
};

export default ProposalFeedCard;
