import findLast from "lodash/findLast";
import {
  checkIsUserDiscussionMessage,
  DiscussionMessage,
} from "@/shared/models";

export const getLastNonUserMessage = (
  discussionMessages: DiscussionMessage[],
  discussionId: string,
  userId?: string,
): DiscussionMessage | null =>
  findLast(
    discussionMessages.filter(
      (message) => message.discussionId === discussionId,
    ),
    (message) =>
      !checkIsUserDiscussionMessage(message) || message.ownerId !== userId,
  ) || null;
