import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import { checkIsFeedItemFollowLayoutItem, FeedItemFollowLayoutItem, FeedLayoutItem } from '@/shared/interfaces';
import { getItemCommonData } from '../utils';
import { checkIsItemVisibleForUser } from '@/shared/utils';
import { CommonFeedType } from '@/shared/models';

const useAllFeedItems = (
  topFeedItems,
  feedItems,
  userId,
  getUserCircleIds,
  outerCommon
) => {
  const prevAllFeedItems = useRef<FeedLayoutItem[]>([]);

  const stableAllFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];
    
    if (topFeedItems) {
      items.push(...topFeedItems);
    }
  
    if (feedItems) {
      items.push(...feedItems);
    }
  
    // Apply filtering logic
    const filteredItems = items.filter((item) => {
      const feedItem = (item as FeedItemFollowLayoutItem)?.feedItem;
      if (checkIsFeedItemFollowLayoutItem(item)) {
        const commonData = getItemCommonData(
          item.feedItemFollowWithMetadata,
          outerCommon
        );
        // Check if the item is visible for the user
        if (
          !checkIsItemVisibleForUser({
            itemCircleVisibility: feedItem.circleVisibility,
            userCircleIds: getUserCircleIds(commonData?.id), // Pass the user's circle IDs
            itemUserId: feedItem.userId,
            currentUserId: userId, // Pass the current user ID
            itemDataType: feedItem.data?.type, // Adjust for item data type
          })
        ) {
          return false;
        }
    
        // Additional filtering logic if needed (e.g., based on type)
        if (
          feedItem.data?.type !== CommonFeedType.Discussion &&
          feedItem.data?.type !== CommonFeedType.Proposal &&
          feedItem.data?.type !== CommonFeedType.Project &&
          feedItem.data?.type !== CommonFeedType.OptimisticDiscussion &&
          feedItem.data?.type !== CommonFeedType.OptimisticProposal
        ) {
          return false;
        }
    
        return true; // Keep the item if it passes all checks
      } else {
        return true; // Keep non-FeedItemFollowLayoutItems
      }
    });

    // Only update the stable array if the filteredItems deeply differ
    if (!isEqual(prevAllFeedItems.current, filteredItems)) {
      prevAllFeedItems.current = filteredItems;
    }

    return prevAllFeedItems.current;
  }, [topFeedItems, feedItems, userId, getUserCircleIds, outerCommon]);

  return stableAllFeedItems;
};

export default useAllFeedItems;
