import { ContextMenuItem } from "@/shared/interfaces";
import {
  Common,
  CommonFeed,
  DirectParent,
  Discussion,
  DiscussionNotion,
  Governance,
  User,
} from "@/shared/models";
import { getUserName } from "@/shared/utils";
import React from "react";
import {
  FeedCardContent,
  FeedCardHeader,
  FeedCountdown,
  getVisibilityString,
} from "../../../FeedCard";

interface DiscussionFeedCardProps {
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  isMobileVersion?: boolean;
  commonId?: string;
  directParent?: DirectParent | null;
  onUserSelect?: (userId: string, commonId?: string) => void;
  discussionCreator: User | null;
  isHome: boolean;
  menuItems: ContextMenuItem[];
  discussion: Discussion | null;
  common: Common | null;
  discussionNotion?: DiscussionNotion;
  handleOpenChat: () => void;
  onHover: (isMouseEnter: boolean) => void;
  isLoading: boolean;
}

export function DiscussionFeedCardContent(props: DiscussionFeedCardProps) {
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
    discussion,
    common,
    discussionNotion,
    handleOpenChat,
    onHover,
    isLoading,
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
}
