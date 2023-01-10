import React, { FC, memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ReportModal } from "@/shared/components";
import { DynamicLinkType, EntityTypes } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { useDiscussionById, useUserById } from "@/shared/hooks/useCases";
import { CommonFeed, DateFormat, Governance } from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
} from "../FeedCard";
import { getVisibilityString } from "../FeedCard";
import { FeedCardShare } from "../FeedCard";
import { LoadingFeedCard } from "../LoadingFeedCard";
import { useMenuItems } from "./hooks";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  isMobileVersion?: boolean;
}

const DiscussionFeedCard: FC<DiscussionFeedCardProps> = (props) => {
  const { item, governanceCircles, isMobileVersion = false } = props;
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

  const circleVisibility = getVisibilityString(
    governanceCircles,
    discussion?.circleVisibility,
  );

  const handleLongPress = () => {
    console.log("Long pressed!");
  };

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
    <FeedCard onLongPress={handleLongPress}>
      <FeedCardHeader
        avatar={discussionCreator?.photoURL}
        title={getUserName(discussionCreator)}
        createdAt={`Created: ${formatDate(
          new Date(item.createdAt.seconds * 1000),
          DateFormat.SuperShortSecondary,
        )}`}
        type="Discussion"
        circleVisibility={circleVisibility}
        menuItems={menuItems}
        isMobileVersion={isMobileVersion}
      />
      <FeedCardContent
        title={discussion?.title}
        description={discussion?.message}
      />
      <FeedCardFooter
        messageCount={discussion?.messageCount || 0}
        lastActivity={item.updatedAt.seconds * 1000}
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
    </FeedCard>
  );
};

export default memo(DiscussionFeedCard);
