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
  useCommon,
  useDiscussionById,
  useFeedItemFollow,
  useFeedItemUserMetadata,
  useUserById,
} from "@/shared/hooks/useCases";
import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonMember,
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
import { useMenuItems } from "./hooks";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  commonName: string;
  commonImage: string;
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
    const {
      data: feedItemUserMetadata,
      fetched: isFeedItemUserMetadataFetched,
      fetchFeedItemUserMetadata,
    } = useFeedItemUserMetadata();
    const { data: common } = useCommon(isHome ? commonId : "");
    const feedItemFollow = useFeedItemFollow(item.id, commonId);
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
      },
      {
        report: onReportModalOpen,
        share: () => onShareModalOpen(),
        remove: onDeleteModalOpen,
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

    const handleOpenChat = useCallback(() => {
      if (discussion) {
        setChatItem({
          feedItemId: item.id,
          discussion,
          circleVisibility: item.circleVisibility,
          lastSeenItem: feedItemUserMetadata?.lastSeen,
          lastSeenAt: feedItemUserMetadata?.lastSeenAt,
          seenOnce: feedItemUserMetadata?.seenOnce,
        });
      }
    }, [
      discussion,
      item.id,
      item.circleVisibility,
      feedItemUserMetadata?.lastSeen,
      feedItemUserMetadata?.lastSeenAt,
      feedItemUserMetadata?.seenOnce,
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
        !isActive &&
        isDiscussionFetched &&
        isFeedItemUserMetadataFetched &&
        item.id === feedItemIdForAutoChatOpen &&
        !isMobileVersion &&
        shouldAllowChatAutoOpen !== false
      ) {
        handleOpenChat();
      }
    }, [
      isDiscussionFetched,
      isFeedItemUserMetadataFetched,
      shouldAllowChatAutoOpen,
    ]);

    useEffect(() => {
      if (isActive) {
        handleOpenChat();
      }
    }, [isActive, handleOpenChat]);

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
        ? getVisibilityString(governanceCircles, discussion?.circleVisibility)
        : undefined;

      return (
        <>
          {!isHome && (
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
              type="Discussion"
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
          )}
          <FeedCardContent
            description={isHome ? common?.description : discussion?.message}
            images={isHome ? common?.gallery : discussion?.images}
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
          image={commonImage}
          imageAlt={`${commonName}'s image`}
          isProject={isProject}
          isFollowing={feedItemFollow.isFollowing}
          isLoading={isLoading}
          menuItems={menuItems}
          seenOnce={feedItemUserMetadata?.seenOnce}
          ownerId={item.userId}
          discussionPredefinedType={discussion?.predefinedType}
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
      </>
    );
  },
);

export default DiscussionFeedCard;
