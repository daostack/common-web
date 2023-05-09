import { GetLastMessageOptions } from "@/pages/common";
import { CommonFeedType, PredefinedTypes } from "@/shared/models";
import { parseStringToTextEditorValue, TextEditorValue } from "@/shared/ui-kit";

const getCustomizedMessageString = (options: GetLastMessageOptions): string => {
  const {
    commonFeedType,
    discussion,
    currentUserId,
    feedItemCreatorName,
    commonName,
    isProject,
  } = options;

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

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(getCustomizedMessageString(options));
  }

  const parsedMessageUserName = parseStringToTextEditorValue(
    `${lastMessage.userName}: `,
  );
  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  return [...parsedMessageUserName, ...parsedMessageContent];
};
