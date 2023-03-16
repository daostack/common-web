import { ChatItem } from "../../../../ChatComponent";

export const checkHasAccessToChat = (
  userCircleIds: string[],
  chatItem?: ChatItem | null,
): boolean => {
  if (!chatItem) {
    return false;
  }

  return (
    !chatItem.circleVisibility.length ||
    chatItem.circleVisibility.some((circleId) =>
      userCircleIds.includes(circleId),
    )
  );
};
