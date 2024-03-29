import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  ChatContextValue,
  ChatContext,
  useChatContext,
} from "@/pages/common/components/ChatComponent";
import { FeedItem } from "@/pages/common/components/FeedItem";
import {
  FeedLayoutEvent,
  FeedLayoutEventEmitter,
} from "@/pages/commonFeed/components/FeedLayout/events";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { FeedItemFollowLayoutItem } from "@/shared/interfaces";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { checkIsProject, emptyFunction } from "@/shared/utils";
import styles from "./FeedItems.module.scss";

interface FeedItemsProps {
  common: Common;
  commonMember?: (CommonMember & CirclesPermissions) | null;
  feedItems: FeedItemFollowLayoutItem[];
  level: number;
}

const FeedItems: FC<FeedItemsProps> = (props) => {
  const { common, commonMember, feedItems, level } = props;
  const chatContext = useChatContext();
  const isTabletView = useIsTabletView();
  const [activeFeedItemId, setActiveFeedItemId] = useState<string | null>(null);
  const [expandedFeedItemId, setExpandedFeedItemId] = useState<string | null>(
    null,
  );
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      ...chatContext,
      nestedItemData: {
        common,
        commonMember,
      },
    }),
    [chatContext, common, commonMember],
  );

  useEffect(() => {
    FeedLayoutEventEmitter.on(
      FeedLayoutEvent.ActiveFeedItemUpdated,
      setActiveFeedItemId,
    );
    FeedLayoutEventEmitter.on(
      FeedLayoutEvent.ExpandedFeedItemUpdated,
      setExpandedFeedItemId,
    );

    return () => {
      FeedLayoutEventEmitter.off(
        FeedLayoutEvent.ActiveFeedItemUpdated,
        setActiveFeedItemId,
      );
      FeedLayoutEventEmitter.off(
        FeedLayoutEvent.ExpandedFeedItemUpdated,
        setExpandedFeedItemId,
      );
    };
  }, []);

  if (feedItems.length === 0) {
    return null;
  }

  return (
    <ChatContext.Provider value={chatContextValue}>
      <div className={styles.container}>
        {feedItems.map((item) => {
          const isActive = item.itemId === activeFeedItemId;
          const isPinned = (common.pinnedFeedItems || []).some(
            (pinnedItem) => pinnedItem.feedObjectId === item.feedItem.id,
          );

          return (
            <FeedItem
              key={item.feedItem.id}
              commonMember={commonMember}
              commonId={common.id}
              commonName={common.name || ""}
              commonImage={common.image || ""}
              commonNotion={common.notion}
              pinnedFeedItems={common.pinnedFeedItems}
              isProject={checkIsProject(common)}
              isPinned={isPinned}
              item={item.feedItem}
              isMobileVersion={isTabletView}
              userCircleIds={userCircleIds}
              isActive={isActive}
              isExpanded={item.feedItem.id === expandedFeedItemId}
              currentUserId={userId}
              shouldCheckItemVisibility={
                !item.feedItemFollowWithMetadata ||
                item.feedItemFollowWithMetadata.userId !== userId
              }
              directParent={common.directParent}
              rootCommonId={common.rootCommonId}
              level={level + 1}
              withoutMenu
              onFeedItemClick={emptyFunction}
              onInternalLinkClick={emptyFunction}
            />
          );
        })}
      </div>
    </ChatContext.Provider>
  );
};

export default FeedItems;
