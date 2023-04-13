import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ReportModal } from "@/shared/components";
import { DynamicLinkType, EntityTypes } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import {
  useDiscussionById,
  useFeedItemUserMetadata,
  useUserById,
} from "@/shared/hooks/useCases";
import { CommonFeed, Governance, PredefinedTypes } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCountdown,
  getLastMessage,
} from "../FeedCard";
import { getVisibilityString } from "../FeedCard";
import { FeedCardShare } from "../FeedCard";
import { useMenuItems } from "./hooks";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  commonName: string;
  isProject: boolean;
  isPreviewMode: boolean;
  isActive: boolean;
  isExpanded: boolean;
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { setChatItem, feedItemIdForAutoChatOpen, setShouldShowSeeMore } =
    useChatContext();
  const {
    item,
    governanceCircles,
    isMobileVersion = false,
    commonId,
    commonName,
    isProject,
    isPreviewMode,
    isActive,
    isExpanded,
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
      discussion,
      governanceCircles,
    },
    {
      report: onReportModalOpen,
      share: onShareModalOpen,
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
    !commonId ||
    !governanceCircles;

  const handleOpenChat = useCallback(() => {
    if (discussion) {
      setChatItem({
        feedItemId: item.id,
        discussion,
        circleVisibility: item.circleVisibility,
        lastSeenItem: feedItemUserMetadata?.lastSeen,
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
  ]);

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
      </>
    );
  };

  return (
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
      isLoading={isLoading}
      menuItems={menuItems}
    >
      {renderContent()}
    </FeedCard>
  );
};

export default DiscussionFeedCard;
