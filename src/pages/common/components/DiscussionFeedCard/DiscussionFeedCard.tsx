import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DiscussionService } from "@/services";
import { DeletePrompt, GlobalOverlay, ReportModal } from "@/shared/components";
import { DynamicLinkType, EntityTypes } from "@/shared/constants";
import { useModal, useNotification } from "@/shared/hooks";
import {
  useDiscussionById,
  useFeedItemUserMetadata,
  useUserById,
} from "@/shared/hooks/useCases";
import {
  Common,
  CommonFeed,
  CommonMember,
  Governance,
  PredefinedTypes,
} from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCountdown,
} from "../FeedCard";
import { getVisibilityString } from "../FeedCard";
import { FeedCardShare } from "../FeedCard";
import { GetLastMessageOptions, GetNonAllowedItemsOptions } from "../FeedItem";
import { useMenuItems } from "./hooks";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  common: Common | undefined;
  commonMember?: CommonMember | null;
  isProject: boolean;
  isPinned: boolean;
  isPreviewMode: boolean;
  isActive: boolean;
  isExpanded: boolean;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { setChatItem, feedItemIdForAutoChatOpen, setShouldShowSeeMore } =
    useChatContext();
  const { notify } = useNotification();
  const {
    item,
    governanceCircles,
    isMobileVersion = false,
    common,
    commonMember,
    isProject,
    isPinned,
    isPreviewMode,
    isActive,
    isExpanded,
    getLastMessage,
    getNonAllowedItems,
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
  const {
    data: feedItemUserMetadata,
    fetched: isFeedItemUserMetadataFetched,
    fetchFeedItemUserMetadata,
  } = useFeedItemUserMetadata();
  const menuItems = useMenuItems(
    {
      common,
      feedItem: item,
      discussion,
      governanceCircles,
      commonMember,
      getNonAllowedItems,
    },
    {
      report: onReportModalOpen,
      share: onShareModalOpen,
      // remove: onDeleteModalOpen,
    },
  );
  const user = useSelector(selectUser());
  const [isHovering, setHovering] = useState(false);
  const onHover = (isMouseEnter: boolean): void => {
    setHovering(isMouseEnter);
  };
  const userId = user?.uid;
  const commonId = common?.id;
  const commonName = common?.name ?? "";
  const isLoading =
    !isDiscussionCreatorFetched ||
    !isDiscussionFetched ||
    !isFeedItemUserMetadataFetched ||
    !commonId ||
    !governanceCircles;

  const handleOpenChat = useCallback(() => {
    if (discussion) {
      setChatItem({
        feedItemId: item.id,
        discussion,
        circleVisibility: item.circleVisibility,
        lastSeenItem: feedItemUserMetadata?.lastSeen,
        seenOnce: feedItemUserMetadata?.seenOnce,
      });
      setShouldShowSeeMore &&
        setShouldShowSeeMore(
          discussion?.predefinedType !== PredefinedTypes.General,
        );
    }
  }, [
    discussion,
    item.id,
    item.circleVisibility,
    feedItemUserMetadata?.lastSeen,
    feedItemUserMetadata?.seenOnce,
  ]);

  const onDiscussionDelete = useCallback(async () => {
    try {
      if (discussion) {
        setDeletingInProgress(true);
        await DiscussionService.deleteDiscussion(discussion.id);
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
      isDiscussionFetched &&
      isFeedItemUserMetadataFetched &&
      item.id === feedItemIdForAutoChatOpen
    ) {
      handleOpenChat();
    }
  }, [isDiscussionFetched, isFeedItemUserMetadataFetched]);

  const renderContent = (): ReactNode => {
    if (isLoading) {
      return null;
    }

    const circleVisibility = getVisibilityString(
      governanceCircles,
      discussion?.circleVisibility,
    );

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
          type="Discussion"
          circleVisibility={circleVisibility}
          menuItems={menuItems}
          isMobileVersion={isMobileVersion}
          commonId={commonId}
          userId={item.userId}
        />
        <FeedCardContent
          description={discussion?.message}
          images={discussion?.images}
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
        feedItemId={item.id}
        isHovering={isHovering}
        lastActivity={item.updatedAt.seconds * 1000}
        unreadMessages={feedItemUserMetadata?.count || 0}
        isActive={isActive}
        isExpanded={isExpanded}
        onClick={handleOpenChat}
        title={discussion?.title}
        lastMessage={getLastMessage({
          commonFeedType: item.data.type,
          lastMessage: item.data.lastMessage,
          discussion,
          currentUserId: userId,
          feedItemCreatorName: getUserName(discussionCreator),
          commonName,
          isProject,
        })}
        canBeExpanded={discussion?.predefinedType !== PredefinedTypes.General}
        isPreviewMode={isPreviewMode}
        isPinned={isPinned}
        image={common?.image}
        imageAlt={`${commonName}'s image`}
        isProject={isProject}
        isLoading={isLoading}
        menuItems={menuItems}
        seenOnce={feedItemUserMetadata?.seenOnce}
        ownerId={item.userId}
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
          linkType={DynamicLinkType.Discussion}
          element={discussion}
          isMobileVersion={isMobileVersion}
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
};

export default DiscussionFeedCard;
