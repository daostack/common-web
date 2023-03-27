import React, { FC, memo, useCallback, useEffect, useState } from "react";
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
import { DesktopStyleMenu } from "@/shared/ui-kit";
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
import { LoadingFeedCard } from "../LoadingFeedCard";
import { useMenuItems } from "./hooks";
import styles from "./DiscussionFeedCard.module.scss";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  isMobileVersion?: boolean;
  commonId: string;
  governanceId?: string;
  isPreviewMode: boolean;
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { activeItemDiscussionId, setChatItem, feedItemIdForAutoChatOpen, setShouldShowSeeMore} =
    useChatContext();
  const {
    item,
    governanceCircles,
    isMobileVersion = false,
    commonId,
    governanceId,
    isPreviewMode,
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
  const { isShowing: isMenuOpen, onClose: onMenuClose } = useModal(false);
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
      governance: {
        circles: governanceCircles,
      },
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
    !isFeedItemUserMetadataFetched;
  const isActive = discussion?.id === activeItemDiscussionId;

  const circleVisibility = getVisibilityString(
    governanceCircles,
    discussion?.circleVisibility,
  );

  const handleOpenChat = useCallback(() => {
    if (discussion) {
      setChatItem({
        feedItemId: item.id,
        discussion,
        circleVisibility: item.circleVisibility,
        lastSeenItem: feedItemUserMetadata?.lastSeen,
      });
      setShouldShowSeeMore && setShouldShowSeeMore(discussion?.predefinedType !== PredefinedTypes.general);
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
    fetchFeedItemUserMetadata({
      userId: userId || "",
      commonId,
      feedObjectId: item.id,
    });
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

  if (isLoading) {
    return <LoadingFeedCard />;
  }

  return (
    <FeedCard
      isActive={isActive}
      isLongPressed={isMenuOpen}
      isHovering={isHovering}
      messageCount={discussion?.messageCount || 0}
      lastActivity={item.updatedAt.seconds * 1000}
      unreadMessages={feedItemUserMetadata?.count || 0}
      onClick={handleOpenChat}
      title={discussion?.title}
      lastMessage={discussion?.message}
      canBeExpanded={discussion?.predefinedType !== PredefinedTypes.general}
      isPreviewMode={isPreviewMode}
    >
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
        governanceId={governanceId}
      />
      <FeedCardContent
        title={discussion?.title}
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
      {/* <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
        unreadMessages={feedItemUserMetadata?.count || 0}
        onMessagesClick={handleOpenChat}
        onClick={handleOpenChat}
        onMouseEnter={() => {
          onHover(true);
        }}
        onMouseLeave={() => {
          onHover(false);
        }}
      /> */}
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
      <DesktopStyleMenu
        className={styles.desktopStyleMenu}
        isOpen={isMenuOpen}
        onClose={onMenuClose}
        items={menuItems}
      />
    </FeedCard>
  );
};

export default memo(DiscussionFeedCard);
