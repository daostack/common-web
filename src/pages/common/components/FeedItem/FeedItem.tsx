import React, { FC, memo } from "react";
import { CommonFeed, CommonFeedType, Governance } from "@/shared/models";
import { checkIsItemVisibleForUser } from "@/shared/utils";
import { useFeedItemSubscription } from "../../hooks";
import { DiscussionFeedCard } from "../DiscussionFeedCard";
import { ProposalFeedCard } from "../ProposalFeedCard";

interface FeedItemProps {
  commonId: string;
  commonName: string;
  isProject: boolean;
  item: CommonFeed;
  governanceCircles: Governance["circles"];
  userCircleIds: string[];
  commonMemberUserId?: string;
  isMobileVersion?: boolean;
  isPreviewMode?: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  sizeKey?: string;
}

const FeedItem: FC<FeedItemProps> = (props) => {
  const {
    commonId,
    commonName,
    isProject,
    item,
    governanceCircles,
    userCircleIds,
    isMobileVersion = false,
    isPreviewMode = false,
    isActive = false,
    isExpanded = false,
    sizeKey,
    commonMemberUserId,
  } = props;
  useFeedItemSubscription(commonId, item.id);

  if (
    !checkIsItemVisibleForUser(
      item.circleVisibility,
      userCircleIds,
      item.userId,
      commonMemberUserId,
    )
  ) {
    return null;
  }

  const generalProps = {
    item,
    commonId,
    commonName,
    isActive,
    isExpanded,
    isProject,
    governanceCircles,
    isPreviewMode,
  };

  if (item.data.type === CommonFeedType.Discussion) {
    return (
      <DiscussionFeedCard isMobileVersion={isMobileVersion} {...generalProps} />
    );
  }

  if (item.data.type === CommonFeedType.Proposal) {
    return <ProposalFeedCard sizeKey={sizeKey} {...generalProps} />;
  }

  return null;
};

export default memo(FeedItem);
