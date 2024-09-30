import { Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { CommonFeed, CommonFeedType, LastMessageContent, OptimisticFeedItemState } from "../models";

interface GenerateOptimisticFeedItemPayload {
  userId: string;
  discussionId: string;
  commonId: string;
  type: CommonFeedType,
  title: string;
  content: string;
  circleVisibility: string[];
  lastMessageContent: LastMessageContent
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
    },
    circleVisibility,
  }
}