import { ChatItem } from "../../../../ChatComponent";

export const checkHasAccessToChat = (
  userCircleIds: string[],
  chatItem?: ChatItem | null,
): boolean => {
  if (!chatItem) {
    return false;
  }

  const { circleVisibility = [] } = chatItem;

  return (
    !circleVisibility.length ||
    circleVisibility.some((circleId) => userCircleIds.includes(circleId))
  );
};
