import {
  CommonFeed,
  CommonFeedType,
  Discussion,
  PredefinedTypes,
} from "@/shared/models";

interface GetLastMessageOptions {
  commonFeedType: CommonFeedType;
  lastMessage?: CommonFeed["data"]["lastMessage"];
  discussion?: Discussion | null;
  currentUserId?: string;
  feedItemCreatorName?: string;
  commonName: string;
  isProject: boolean;
}

export const getLastMessage = (options: GetLastMessageOptions): string => {
  const {
    commonFeedType,
    lastMessage,
    discussion,
    currentUserId,
    feedItemCreatorName,
    commonName,
    isProject,
  } = options;

  if (lastMessage) {
    return `${lastMessage.userName}: ${lastMessage.content}`;
  }

  const creatorName =
    discussion?.ownerId === currentUserId ? "You" : feedItemCreatorName;

  if (discussion?.predefinedType === PredefinedTypes.General) {
    return `${creatorName} created the ${
      isProject ? "space" : "common"
    } ${commonName}`;
  }
  if (
    [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
      commonFeedType,
    )
  ) {
    const feedItemName =
      commonFeedType === CommonFeedType.Proposal ? "proposal" : "discussion";

    return `${creatorName} created the ${feedItemName}`;
  }

  return "";
};
