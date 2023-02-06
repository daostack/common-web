import React, { FC, memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ReportModal } from "@/shared/components";
import { DynamicLinkType, EntityTypes } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { useDiscussionById, useUserById } from "@/shared/hooks/useCases";
import { CommonFeed, Governance } from "@/shared/models";
import { DesktopStyleMenu } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { useChatContext } from "../ChatComponent";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
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
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { activeItemDiscussionId, setChatItem } = useChatContext();
  const {
    item,
    governanceCircles,
    isMobileVersion = false,
    commonId,
    governanceId,
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
  const userId = user?.uid;
  const isLoading = !isDiscussionCreatorFetched || !isDiscussionFetched;
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
      });
    }
  }, [discussion, item.id, item.circleVisibility]);

  useEffect(() => {
    fetchDiscussionCreator(item.userId);
  }, [item.userId]);

  useEffect(() => {
    fetchDiscussion(item.data.id);
  }, [item.data.id]);

  if (isLoading) {
    return <LoadingFeedCard />;
  }

  return (
    <FeedCard isActive={isActive} isLongPressed={isMenuOpen}>
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
      />
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
        onMessagesClick={handleOpenChat}
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
