import React from "react";
import { ContextMenuItem } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  CommonFeedType,
  DirectParent,
  DiscussionNotion,
  Governance,
  Link,
  User,
} from "@/shared/models";
import { getUserName } from "@/shared/utils";
import {
  FeedCardContent,
  FeedCardHeader,
  FeedCountdown,
  getVisibilityString,
} from "../../../FeedCard";

interface OptimisticFeedCardContentProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  directParent?: DirectParent | null;
  onUserSelect?: (userId: string, commonId?: string) => void;
  discussionCreator: User | null;
  isHome: boolean;
  menuItems: ContextMenuItem[];
  discussionMessage?: string;
  discussionImages: Link[];
  common: Common | null;
  discussionNotion?: DiscussionNotion;
  handleOpenChat: () => void;
  onHover: (isMouseEnter: boolean) => void;
  isLoading: boolean;
  type?: CommonFeedType;
}

export function OptimisticFeedCardContent(
  props: OptimisticFeedCardContentProps,
) {
  const {
    item,
    governanceCircles,
    isMobileVersion = false,
    commonId,
    directParent,
    onUserSelect,
    discussionCreator,
    isHome,
    menuItems,
    common,
    discussionNotion,
    handleOpenChat,
    onHover,
    isLoading,
    discussionMessage,
    discussionImages,
    type,
  } = props;

  if (isLoading || !commonId) {
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
        type={
          type === CommonFeedType.OptimisticProposal ? "Proposal" : "Discussion"
        }
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
        item={item}
        description={isHome ? common?.description : discussionMessage}
        images={isHome ? common?.gallery : discussionImages}
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
}
