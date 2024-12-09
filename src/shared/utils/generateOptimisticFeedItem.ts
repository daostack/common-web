import { Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Common, CommonFeed, CommonFeedType, FeedItemFollowWithMetadata, LastMessageContent, OptimisticFeedItemState } from "../models";

interface GenerateOptimisticFeedItemPayload {
  userId: string;
  discussionId: string;
  commonId: string;
  type: CommonFeedType,
  title: string;
  content: string;
  circleVisibility: string[];
  lastMessageContent: LastMessageContent
  shouldFocus?: boolean;
}

export const generateOptimisticFeedItem = ({
  userId,
  discussionId,
  commonId,
  type,
  title,
  content,
  circleVisibility,
  lastMessageContent,
  shouldFocus = true
}: GenerateOptimisticFeedItemPayload): CommonFeed => {

  const optimisticFeedItemId = uuidv4();
  const currentDate = FirestoreTimestamp.now();
  return {
    id: optimisticFeedItemId,
    createdAt: currentDate,
    updatedAt: currentDate,
    isDeleted: false,
    userId,
    commonId,
    data: {
      type,
      id: discussionId,
      discussionId: null,
      hasFiles: false,
      hasImages: false,
    },
    optimisticData: {
      id: discussionId,
      title: title,
      message: content,
      ownerId: userId,
      commonId,
      lastMessage: currentDate,
      lastMessageContent,
      updatedAt: currentDate,
      createdAt: currentDate,
      messageCount: 0,
      followers: [],
      files: [],
      images: [],
      discussionMessages: [],
      isDeleted: false,
      circleVisibility,
      circleVisibilityByCommon: null,
      linkedCommonIds: [],
      state: OptimisticFeedItemState.loading,
      shouldFocus: shouldFocus
    },
    circleVisibility,
  }
}

export const generateOptimisticFeedItemFollowWithMetadata = ({ feedItem, common }: {
  feedItem: CommonFeed,
  common: Common;
}): FeedItemFollowWithMetadata => {

  const currentDate = FirestoreTimestamp.now();
  return {
    commonAvatar: common.image,
    commonId: common.id,
    commonName: common.name,
    feedItem: feedItem,
    feedItemId: feedItem.id,
    userId: feedItem.userId,
    emailSubscribed: false,
    pushSubscribed: false,
    count: 0,
    type: feedItem.data.type,
    lastSeen: currentDate,
    createdAt: currentDate,
    updatedAt: currentDate,
    lastActivity: currentDate,
    id: feedItem.id,
  }
}