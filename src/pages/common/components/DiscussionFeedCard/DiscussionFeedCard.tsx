import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DiscussionService } from "@/services";
import { DeletePrompt, GlobalOverlay, ReportModal } from "@/shared/components";
import { EntityTypes } from "@/shared/constants";
import { useModal, useNotification } from "@/shared/hooks";
import {
  FeedItemFollowState,
  useCommon,
  useDiscussionById,
  useFeedItemUserMetadata,
  useUserById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonMember,
  CommonNotion,
  DirectParent,
  Governance,
  PredefinedTypes,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { StaticLinkType, getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCountdown,
} from "../FeedCard";
import { getVisibilityString } from "../FeedCard";
import { FeedCardShare } from "../FeedCard";
import {
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "../FeedItem";
import {
  LinkStreamModal,
  MoveStreamModal,
  UnlinkStreamModal,
} from "./components";
import { useMenuItems } from "./hooks";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  commonName: string;
  commonImage: string;
  commonNotion?: CommonNotion;
  pinnedFeedItems?: Common["pinnedFeedItems"];
  commonMember?: CommonMember | null;
  isProject: boolean;
  isPinned: boolean;
  isPreviewMode: boolean;
  isActive: boolean;
  isExpanded: boolean;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeData) => void;
  directParent?: DirectParent | null;
  rootCommonId?: string;
  feedItemFollow: FeedItemFollowState;
  onUserSelect?: (userId: string, commonId?: string) => void;
}

const DiscussionFeedCard = forwardRef<FeedItemRef, DiscussionFeedCardProps>(
  (props, ref) => {
    const { setChatItem, feedItemIdForAutoChatOpen, shouldAllowChatAutoOpen } =
      useChatContext();
    const { notify } = useNotification();
    const {
      item,
      governanceCircles,
      isMobileVersion = false,
      commonId,
      commonName,
      commonImage,
      commonNotion: outerCommonNotion,
      pinnedFeedItems,
      commonMember,
      isProject,
      isPinned,
      isPreviewMode,
      isActive,
      isExpanded,
      getLastMessage,
      getNonAllowedItems,
      onActiveItemDataChange,
      directParent,
      rootCommonId,
      feedItemFollow,
      onUserSelect,
    } = props;
    const {
      isShowing: isReportModalOpen,
      onOpen: onReportModalOpen,
      onClose: onReportModalClose,
    } = useModal(false);
    const {
      isShowing: isShareModalOpen,
      onOpen: onShareModalOpen,
      onClose: onShareModalClose,
    } = useModal(false);
    const {
      isShowing: isDeleteModalOpen,
      onOpen: onDeleteModalOpen,
      onClose: onDeleteModalClose,
    } = useModal(false);
    const {
      isShowing: isLinkStreamModalOpen,
      onOpen: onLinkStreamModalOpen,
      onClose: onLinkStreamModalClose,
    } = useModal(false);
    const {
      isShowing: isUnlinkStreamModalOpen,
      onOpen: onUnlinkStreamModalOpen,
      onClose: onUnlinkStreamModalClose,
    } = useModal(false);
    const {
      isShowing: isMoveStreamModalOpen,
      onOpen: onMoveStreamModalOpen,
      onClose: onMoveStreamModalClose,
    } = useModal(false);
    const [isDeletingInProgress, setDeletingInProgress] = useState(false);
    const {
      fetchUser: fetchDiscussionCreator,
      data: discussionCreator,
      fetched: isDiscussionCreatorFetched,
    } = useUserById();
    const {
      fetchDiscussion,
      data: discussion,
      fetched: isDiscussionFetched,
    } = useDiscussionById();
    const isHome = discussion?.predefinedType === PredefinedTypes.General;
    const discussionNotion = commonId
      ? discussion?.notionByCommon?.[commonId]
      : undefined;
    const {
      data: feedItemUserMetadata,
      fetched: isFeedItemUserMetadataFetched,
      fetchFeedItemUserMetadata,
    } = useFeedItemUserMetadata();
    const shouldLoadCommonData =
      isHome || (discussionNotion && !outerCommonNotion);
    const { data: common } = useCommon(shouldLoadCommonData ? commonId : "");
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
        report: onReportModalOpen,
        share: () => onShareModalOpen(),
        remove: onDeleteModalOpen,
        linkStream: onLinkStreamModalOpen,
        unlinkStream: onUnlinkStreamModalOpen,
        moveStream: onMoveStreamModalOpen,
      },
    );
    const user = useSelector(selectUser());
    const [isHovering, setHovering] = useState(false);
    const onHover = (isMouseEnter: boolean): void => {
      setHovering(isMouseEnter);
    };
    const userId = user?.uid;
    const isLoading =
      !isDiscussionCreatorFetched ||
      !isDiscussionFetched ||
      !isFeedItemUserMetadataFetched ||
      !commonId;
    const cardTitle = discussion?.title;
    const commonNotion = outerCommonNotion ?? common?.notion;

    const handleOpenChat = useCallback(() => {
      if (discussion) {
        setChatItem({
          feedItemId: item.id,
          discussion,
          circleVisibility: item.circleVisibility,
          lastSeenItem: feedItemUserMetadata?.lastSeen,
          lastSeenAt: feedItemUserMetadata?.lastSeenAt,
          seenOnce: feedItemUserMetadata?.seenOnce,
          hasUnseenMention: feedItemUserMetadata?.hasUnseenMention,
        });
      }
    }, [
      discussion,
      item.id,
      item.circleVisibility,
      feedItemUserMetadata?.lastSeen,
      feedItemUserMetadata?.lastSeenAt,
      feedItemUserMetadata?.seenOnce,
      feedItemUserMetadata?.hasUnseenMention,
    ]);

    const onDiscussionDelete = useCallback(async () => {
      try {
        if (discussion) {
          setDeletingInProgress(true);
          await DiscussionService.deleteDiscussion(discussion.id);
          onDeleteModalClose();
        }
      } catch {
        notify("Something went wrong");
      } finally {
        setDeletingInProgress(false);
      }
    }, [discussion]);

    useEffect(() => {
      fetchDiscussionCreator(item.userId);
    }, [item.userId]);

    useEffect(() => {
      fetchDiscussion(item.data.id);
    }, [item.data.id]);

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
      if (
        (!isActive ||
          shouldAllowChatAutoOpen === null ||
          shouldAllowChatAutoOpen) &&
        isDiscussionFetched &&
        isFeedItemUserMetadataFetched &&
        item.id === feedItemIdForAutoChatOpen &&
        !isMobileVersion
      ) {
        handleOpenChat();
      }
    }, [
      isDiscussionFetched,
      isFeedItemUserMetadataFetched,
      shouldAllowChatAutoOpen,
    ]);

    useEffect(() => {
      if (isActive && shouldAllowChatAutoOpen !== null) {
        handleOpenChat();
      }
    }, [isActive, shouldAllowChatAutoOpen, handleOpenChat]);

    useEffect(() => {
      if (isActive && cardTitle) {
        onActiveItemDataChange?.({
          itemId: item.id,
          title: cardTitle,
        });
      }
    }, [isActive, cardTitle]);

    const renderContent = (): ReactNode => {
      if (isLoading) {
        return null;
      }

      const circleVisibility = governanceCircles
        ? getVisibilityString(governanceCircles, item?.circleVisibility)
        : undefined;

      return (
        <>
          <FeedCardHeader
            avatar={discussionCreator?.photoURL}
            title={getUserName(discussionCreator)}
            createdAt={
              <>
                Created:{" "}
                <FeedCountdown
                  isCountdownFinished
                  expirationTimestamp={item.createdAt}
                />
              </>
            }
            type={isHome ? "Home" : "Discussion"}
            circleVisibility={circleVisibility}
            menuItems={menuItems}
            isMobileVersion={isMobileVersion}
            commonId={commonId}
            userId={item.userId}
            directParent={directParent}
            onUserSelect={
              onUserSelect && (() => onUserSelect(item.userId, commonId))
            }
          />
          <FeedCardContent
            description={isHome ? common?.description : discussion?.message}
            images={isHome ? common?.gallery : discussion?.images}
            notion={discussionNotion}
            onClick={handleOpenChat}
            onMouseEnter={() => {
              onHover(true);
            }}
            onMouseLeave={() => {
              onHover(false);
            }}
          />
        </>
      );
    };

    return (
      <>
        <FeedCard
          ref={ref}
          feedItemId={item.id}
          isHovering={isHovering}
          lastActivity={item.updatedAt.seconds * 1000}
          unreadMessages={feedItemUserMetadata?.count || 0}
          isActive={isActive}
          isExpanded={isExpanded}
          onClick={handleOpenChat}
          title={cardTitle}
          lastMessage={getLastMessage({
            commonFeedType: item.data.type,
            lastMessage: item.data.lastMessage,
            discussion,
            currentUserId: userId,
            feedItemCreatorName: getUserName(discussionCreator),
            commonName,
            isProject,
            hasFiles: item.data.hasFiles,
            hasImages: item.data.hasImages,
          })}
          isPreviewMode={isPreviewMode}
          isPinned={isPinned}
          commonName={commonName}
          commonId={commonId}
          image={commonImage}
          imageAlt={`${commonName}'s image`}
          isProject={isProject}
          isFollowing={feedItemFollow.isFollowing}
          isLoading={isLoading}
          menuItems={menuItems}
          seenOnce={
            feedItemUserMetadata?.seenOnce ?? !isFeedItemUserMetadataFetched
          }
          seen={feedItemUserMetadata?.seen ?? !isFeedItemUserMetadataFetched}
          ownerId={item.userId}
          discussionPredefinedType={discussion?.predefinedType}
          notion={discussionNotion && commonNotion}
          hasUnseenMention={
            isFeedItemUserMetadataFetched &&
            feedItemUserMetadata?.hasUnseenMention
          }
          originalCommonIdForLinking={discussion?.commonId}
          linkedCommonIds={discussion?.linkedCommonIds}
        >
          {renderContent()}
        </FeedCard>
        {userId && discussion && (
          <ReportModal
            userId={userId}
            isShowing={isReportModalOpen}
            onClose={onReportModalClose}
            entity={discussion}
            type={EntityTypes.Discussion}
          />
        )}
        {discussion && (
          <FeedCardShare
            isOpen={isShareModalOpen}
            onClose={onShareModalClose}
            linkType={StaticLinkType.Discussion}
            element={discussion}
            feedItemId={item.id}
          />
        )}
        {isDeleteModalOpen && (
          <GlobalOverlay>
            <DeletePrompt
              title="Are you sure you want to delete this discussion?"
              description="Note that this action could not be undone."
              onCancel={onDeleteModalClose}
              onDelete={onDiscussionDelete}
              isDeletingInProgress={isDeletingInProgress}
            />
          </GlobalOverlay>
        )}
        {commonId && (
          <>
            <LinkStreamModal
              isOpen={isLinkStreamModalOpen}
              onClose={onLinkStreamModalClose}
              feedItemId={item.id}
              title={cardTitle || ""}
              rootCommonId={rootCommonId || commonId}
              commonId={commonId}
              originalCommonId={discussion?.commonId || ""}
              linkedCommonIds={discussion?.linkedCommonIds}
              circleVisibility={item.circleVisibility}
            />
            <UnlinkStreamModal
              isOpen={isUnlinkStreamModalOpen}
              onClose={onUnlinkStreamModalClose}
              feedItemId={item.id}
              title={cardTitle || ""}
              commonId={commonId}
              commonName={commonName}
            />
            <MoveStreamModal
              isOpen={isMoveStreamModalOpen}
              onClose={onMoveStreamModalClose}
              feedItemId={item.id}
              title={cardTitle || ""}
              rootCommonId={rootCommonId || commonId}
              commonId={commonId}
              originalCommonId={discussion?.commonId || ""}
              circleVisibility={item.circleVisibility}
            />
          </>
        )}
      </>
    );
  },
);

export default DiscussionFeedCard;
