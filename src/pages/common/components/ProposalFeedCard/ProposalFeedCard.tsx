import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { debounce } from "lodash";
import copyToClipboard from "copy-to-clipboard";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember, useProposalUserVote } from "@/pages/OldCommon/hooks";
import { ProposalService } from "@/services";
import { DeletePrompt, GlobalOverlay } from "@/shared/components";
import { InboxItemType, ShareButtonText } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useForceUpdate, useModal, useNotification } from "@/shared/hooks";
import {
  FeedItemFollowState,
  useCommon,
  useDiscussionById,
  useFeedItemUserMetadata,
  usePreloadDiscussionMessagesById,
  useProposalById,
  useUpdateFeedItemSeenState,
  useUserById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonNotion,
  Governance,
  PredefinedTypes,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { StaticLinkType, getUserName, InternalLinkData, generateStaticShareLink } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import { useMenuItems } from "../DiscussionFeedCard/hooks";
import { FeedCard } from "../FeedCard";
import {
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "../FeedItem";
import { ProposalFeedCardContent } from "./components";
import { useProposalSpecificData } from "./hooks";

interface ProposalFeedCardProps {
  commonId?: string;
  commonName: string;
  commonImage: string;
  commonNotion?: CommonNotion;
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
  shouldPreLoadMessages: boolean;
  withoutMenu?: boolean;
  onUserClick?: (userId: string) => void;
  onFeedItemClick: (feedItemId: string) => void;
  onInternalLinkClick: (data: InternalLinkData) => void;
}

const ProposalFeedCard = forwardRef<FeedItemRef, ProposalFeedCardProps>(
  (props, ref) => {
    const {
      commonId,
      commonName,
      commonImage,
      commonNotion: outerCommonNotion,
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
      shouldPreLoadMessages,
      withoutMenu,
      onUserClick,
      onFeedItemClick,
      onInternalLinkClick,
    } = props;
    const user = useSelector(selectUser());
    const userId = user?.uid;
    const {
      setChatItem,
      feedItemIdForAutoChatOpen,
      shouldAllowChatAutoOpen,
      nestedItemData,
    } = useChatContext();
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
    const discussionNotion = commonId
      ? discussion?.notionByCommon?.[commonId]
      : undefined;
    const shouldLoadCommonData = discussionNotion && !outerCommonNotion;
    const { data: common } = useCommon(shouldLoadCommonData ? commonId : "");
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
    const preloadDiscussionMessagesData = usePreloadDiscussionMessagesById({
      commonId,
      discussionId: discussion?.id,
      onUserClick,
      onFeedItemClick,
      onInternalLinkClick,
    });
    const { markFeedItemAsSeen, markFeedItemAsUnseen } =
      useUpdateFeedItemSeenState();
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
        withoutMenu,
        shareText: ShareButtonText.Stream
      },
      {
        report: () => {},
        share: () => {
          if(discussion) {
            copyToClipboard(generateStaticShareLink(StaticLinkType.Proposal, discussion, item.id));
            notify("The link has been copied!");
          }
        },
        remove: onProposalDeleteModalOpen,
        markFeedItemAsSeen,
        markFeedItemAsUnseen,
      },
    );
    const cardTitle = discussion?.title;
    const commonNotion = outerCommonNotion ?? common?.notion;

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

    const preloadDiscussionMessages = useMemo(
      () =>
        debounce<
          typeof preloadDiscussionMessagesData.preloadDiscussionMessages
        >(
          (...args) =>
            preloadDiscussionMessagesData.preloadDiscussionMessages(...args),
          6000,
        ),
      [preloadDiscussionMessagesData.preloadDiscussionMessages],
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

    useEffect(() => {
      if (isActive && cardTitle) {
        onActiveItemDataChange?.({
          itemId: item.id,
          title: cardTitle,
        });
      }
    }, [isActive, cardTitle]);

    const handleOpenChat = useCallback(() => {
      if (discussion && proposal && !isPreviewMode) {
        setChatItem({
          feedItemId: item.id,
          discussion,
          proposal,
          circleVisibility: item.circleVisibility,
          lastSeenItem: feedItemUserMetadata?.lastSeen,
          lastSeenAt: feedItemUserMetadata?.lastSeenAt,
          seenOnce: feedItemUserMetadata?.seenOnce,
          seen: feedItemUserMetadata?.seen,
          hasUnseenMention: feedItemUserMetadata?.hasUnseenMention,
          nestedItemData: nestedItemData && {
            ...nestedItemData,
            feedItem: {
              type: InboxItemType.FeedItemFollow,
              itemId: item.id,
              feedItem: item,
            },
          },
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
      feedItemUserMetadata?.seen,
      feedItemUserMetadata?.hasUnseenMention,
      nestedItemData,
      isPreviewMode,
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

    useEffect(() => {
      if (
        shouldPreLoadMessages &&
        !isActive &&
        commonId &&
        item.circleVisibility
      ) {
        preloadDiscussionMessages(item.circleVisibility);
      }
    }, [shouldPreLoadMessages, isActive]);

    useUpdateEffect(() => {
      if (
        shouldPreLoadMessages &&
        !isActive &&
        commonId &&
        item.circleVisibility
      ) {
        preloadDiscussionMessages(item.circleVisibility, true);
      }
    }, [item.data.lastMessage?.content]);

    const lastMessage = useMemo(() => {
      return getLastMessage({
        commonFeedType: item.data.type,
        lastMessage: item.data.lastMessage,
        discussion,
        currentUserId: userId,
        feedItemCreatorName: getUserName(feedItemUser),
        commonName,
        isProject,
        hasFiles: item.data.hasFiles,
        hasImages: item.data.hasImages,
      });
    }, [
      item.data.type,
      item.data.lastMessage,
      discussion,
      userId,
      feedItemUser,
      commonName,
      isProject,
      item.data.hasFiles,
      item.data.hasImages,
    ]);

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
          lastMessage={lastMessage}
          canBeExpanded={discussion?.predefinedType !== PredefinedTypes.General}
          isPreviewMode={isPreviewMode}
          commonName={commonName}
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
          notion={discussionNotion && commonNotion}
          hasUnseenMention={
            isFeedItemUserMetadataFetched &&
            feedItemUserMetadata?.hasUnseenMention
          }
        >
          {(isActive || isExpanded) && (
            <ProposalFeedCardContent
              isLoading={isLoading}
              proposal={proposal}
              commonMember={commonMember}
              userVote={userVote}
              governanceCircles={governanceCircles}
              feedItemUser={feedItemUser}
              setVote={setVote}
              commonId={commonId}
              item={item}
              onUserClick={onUserClick}
              proposalSpecificData={proposalSpecificData}
              menuItems={menuItems}
              discussionNotion={discussionNotion}
              discussion={discussion}
              handleOpenChat={handleOpenChat}
              onHover={onHover}
              getCommonPagePath={getCommonPagePath}
            />
          )}
        </FeedCard>
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