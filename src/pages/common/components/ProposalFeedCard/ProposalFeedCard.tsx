import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember, useProposalUserVote } from "@/pages/OldCommon/hooks";
import { ProposalService } from "@/services";
import { DeletePrompt, GlobalOverlay } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useForceUpdate, useModal, useNotification } from "@/shared/hooks";
import {
  FeedItemFollowState,
  useDiscussionById,
  useFeedItemUserMetadata,
  useProposalById,
  useUserById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  Governance,
  PredefinedTypes,
  ResolutionType,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import {
  StaticLinkType,
  checkIsCountdownState,
  getUserName,
} from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import { useMenuItems } from "../DiscussionFeedCard/hooks";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  getVisibilityString,
  FeedCountdown,
  FeedCardShare,
} from "../FeedCard";
import {
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "../FeedItem";
import {
  ProposalFeedVotingInfo,
  ProposalFeedButtonContainer,
  UserVoteInfo,
  ImmediateProposalInfo,
} from "./components";
import { ImmediateProposalVoteInfo } from "./components/ImmediateProposalVoteInfo";
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
  pinnedFeedItems?: Common["pinnedFeedItems"];
  isProject: boolean;
  isPinned: boolean;
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isPreviewMode?: boolean;
  sizeKey?: string;
  isActive: boolean;
  isExpanded: boolean;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  isMobileVersion?: boolean;
  feedItemFollow: FeedItemFollowState;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeData) => void;
  onUserSelect?: (userId: string, commonId?: string) => void;
}

const ProposalFeedCard = forwardRef<FeedItemRef, ProposalFeedCardProps>(
  (props, ref) => {
    const {
      commonId,
      commonName,
      commonImage,
      pinnedFeedItems,
      isProject,
      isPinned,
      item,
      governanceCircles,
      isPreviewMode,
      isActive,
      isExpanded,
      getLastMessage,
      getNonAllowedItems,
      isMobileVersion,
      feedItemFollow,
      onActiveItemDataChange,
      onUserSelect,
    } = props;
    const user = useSelector(selectUser());
    const userId = user?.uid;
    const { setChatItem, feedItemIdForAutoChatOpen, shouldAllowChatAutoOpen } =
      useChatContext();
    const { notify } = useNotification();
    const forceUpdate = useForceUpdate();
    const { getCommonPagePath } = useRoutesContext();
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
    const {
      isShowing: isProposalDeleteModalOpen,
      onOpen: onProposalDeleteModalOpen,
      onClose: onProposalDeleteModalClose,
    } = useModal(false);
    const [isProposalDeletingInProgress, setProposalDeletingInProgress] =
      useState(false);
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
    const {
      isShowing: isShareModalOpen,
      onOpen: onShareModalOpen,
      onClose: onShareModalClose,
    } = useModal(false);
    const menuItems = useMenuItems(
      {
        commonId,
        pinnedFeedItems,
        feedItem: item,
        discussion,
        governanceCircles,
        commonMember,
        feedItemFollow,
        getNonAllowedItems,
        feedItemUserMetadata,
      },
      {
        report: () => {},
        share: () => onShareModalOpen(),
        remove: onProposalDeleteModalOpen,
      },
    );
    const cardTitle = discussion?.title;

    const onProposalDelete = useCallback(async () => {
      try {
        setProposalDeletingInProgress(true);
        await ProposalService.deleteProposal(proposalId);
        onProposalDeleteModalClose();
      } catch {
        notify("Something went wrong");
      } finally {
        setProposalDeletingInProgress(false);
      }
    }, [proposalId]);

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

    useEffect(() => {
      if (isActive && cardTitle) {
        onActiveItemDataChange?.({
          itemId: item.id,
          title: cardTitle,
        });
      }
    }, [isActive, cardTitle]);

    const handleOpenChat = useCallback(() => {
      if (discussion && proposal) {
        setChatItem({
          feedItemId: item.id,
          discussion,
          proposal,
          circleVisibility: item.circleVisibility,
          lastSeenItem: feedItemUserMetadata?.lastSeen,
          lastSeenAt: feedItemUserMetadata?.lastSeenAt,
          seenOnce: feedItemUserMetadata?.seenOnce,
          hasUnseenMention: feedItemUserMetadata?.hasUnseenMention,
        });
      }
    }, [
      item.id,
      proposal,
      discussion,
      setChatItem,
      item.circleVisibility,
      feedItemUserMetadata?.lastSeen,
      feedItemUserMetadata?.lastSeenAt,
      feedItemUserMetadata?.seenOnce,
      feedItemUserMetadata?.hasUnseenMention,
    ]);

    useEffect(() => {
      if (
        (!isActive ||
          shouldAllowChatAutoOpen === null ||
          shouldAllowChatAutoOpen) &&
        isDiscussionFetched &&
        isProposalFetched &&
        isFeedItemUserMetadataFetched &&
        item.id === feedItemIdForAutoChatOpen &&
        !isMobileVersion
      ) {
        handleOpenChat();
      }
    }, [
      isDiscussionFetched,
      isProposalFetched,
      isFeedItemUserMetadataFetched,
      shouldAllowChatAutoOpen,
    ]);

    useEffect(() => {
      if (isActive && shouldAllowChatAutoOpen !== null) {
        handleOpenChat();
      }
    }, [isActive, shouldAllowChatAutoOpen, handleOpenChat]);

    useEffect(() => {
      if (isExpanded) {
        forceUpdate();
      }
    }, [isExpanded]);

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
            onUserSelect={
              onUserSelect && (() => onUserSelect(item.userId, commonId))
            }
          />
          <FeedCardContent
            subtitle={getProposalSubtitle(
              proposal,
              proposalSpecificData,
              getCommonPagePath(proposalSpecificData.targetCommon?.id || ""),
            )}
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
            {proposal.resolutionType === ResolutionType.WAIT_FOR_EXPIRATION && (
              <>
                <ProposalFeedVotingInfo
                  proposal={proposal}
                  governanceCircles={governanceCircles}
                />
                <UserVoteInfo
                  userVote={userVote}
                  userHasPermissionsToVote={userHasPermissionsToVote}
                  isCountdownState={isCountdownState}
                />
              </>
            )}

            {proposal.resolutionType === ResolutionType.IMMEDIATE && (
              <>
                <ImmediateProposalInfo
                  proposal={proposal}
                  governanceCircles={governanceCircles}
                  proposerUserName={getUserName(feedItemUser)}
                />
                <ImmediateProposalVoteInfo
                  proposal={proposal}
                  userVote={userVote}
                />
              </>
            )}

            {isVotingAllowed && (
              <ProposalFeedButtonContainer
                proposalId={proposal.id}
                onVoteCreate={setVote}
                resolutionType={proposal.resolutionType}
              />
            )}
          </FeedCardContent>
        </>
      );
    };

    return (
      <>
        <FeedCard
          ref={ref}
          feedItemId={item.id}
          isHovering={isHovering}
          onClick={handleOpenChat}
          lastActivity={item.updatedAt.seconds * 1000}
          isActive={isActive}
          isExpanded={isExpanded}
          unreadMessages={feedItemUserMetadata?.count || 0}
          title={cardTitle}
          lastMessage={getLastMessage({
            commonFeedType: item.data.type,
            lastMessage: item.data.lastMessage,
            discussion,
            currentUserId: userId,
            feedItemCreatorName: getUserName(feedItemUser),
            commonName,
            isProject,
            hasFiles: item.data.hasFiles,
            hasImages: item.data.hasImages,
          })}
          canBeExpanded={discussion?.predefinedType !== PredefinedTypes.General}
          isPreviewMode={isPreviewMode}
          image={commonImage}
          imageAlt={`${commonName}'s image`}
          isProject={isProject}
          isPinned={isPinned}
          isFollowing={feedItemFollow.isFollowing}
          isLoading={isLoading}
          type={item.data.type}
          seenOnce={
            feedItemUserMetadata?.seenOnce ?? !isFeedItemUserMetadataFetched
          }
          seen={feedItemUserMetadata?.seen ?? !isFeedItemUserMetadataFetched}
          menuItems={menuItems}
          ownerId={item.userId}
          commonId={commonId}
          hasUnseenMention={
            feedItemUserMetadata?.hasUnseenMention ??
            !isFeedItemUserMetadataFetched
          }
        >
          {renderContent()}
        </FeedCard>
        {discussion && (
          <FeedCardShare
            isOpen={isShareModalOpen}
            onClose={onShareModalClose}
            linkType={StaticLinkType.Proposal}
            element={discussion}
            feedItemId={item.id}
          />
        )}
        {isProposalDeleteModalOpen && (
          <GlobalOverlay>
            <DeletePrompt
              title="Are you sure you want to delete this proposal?"
              description="Note that this action could not be undone."
              onCancel={onProposalDeleteModalClose}
              onDelete={onProposalDelete}
              isDeletingInProgress={isProposalDeletingInProgress}
            />
          </GlobalOverlay>
        )}
      </>
    );
  },
);

export default ProposalFeedCard;
