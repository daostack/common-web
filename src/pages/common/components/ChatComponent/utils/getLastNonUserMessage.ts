import findLast from "lodash/findLast";
import {
  checkIsUserDiscussionMessage,
  DiscussionMessage,
} from "@/shared/models";

export const getLastNonUserMessage = (
  discussionMessages: DiscussionMessage[],
  userId?: string,
): DiscussionMessage | null =>
  findLast(
    discussionMessages,
    (message) =>
      !checkIsUserDiscussionMessage(message) || message.ownerId !== userId,
  ) || null;
