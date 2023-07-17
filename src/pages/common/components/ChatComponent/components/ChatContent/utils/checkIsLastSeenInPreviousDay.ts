import { DiscussionMessage } from "@/shared/models";

export const checkIsLastSeenInPreviousDay = (
  previousDayMessages: DiscussionMessage[],
  lastSeenItemId?: string,
): boolean => {
  const lastMessageInPreviousDay =
    previousDayMessages[previousDayMessages.length - 1];

  return Boolean(
    lastMessageInPreviousDay && lastMessageInPreviousDay.id === lastSeenItemId,
  );
};
