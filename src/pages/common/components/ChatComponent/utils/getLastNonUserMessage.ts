import findLast from "lodash/findLast";
import { DiscussionMessage } from "@/shared/models";

export const getLastNonUserMessage = (
  discussionMessages: DiscussionMessage[],
  userId?: string,
): DiscussionMessage | null =>
  findLast(discussionMessages, (message) => message.ownerId !== userId) || null;
