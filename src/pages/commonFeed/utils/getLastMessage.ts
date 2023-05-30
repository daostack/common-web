import { GetLastMessageOptions } from "@/pages/common";
import { CommonFeedType, PredefinedTypes } from "@/shared/models";
import {
  parseStringToTextEditorValue,
  prependTextInTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";

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

const getIconWithText = ({
  hasText,
  hasImages,
  hasFiles,
}: {
  hasText?: boolean;
  hasImages?: boolean;
  hasFiles?: boolean;
}): string => {
  if (hasImages) {
    return `📷 ${hasText ? "" : "Picture"}`;
  } else if (hasFiles) {
    return `📁 ${hasText ? "" : "File"}`;
  }

  return "";
};

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, hasImages, hasFiles } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(getCustomizedMessageString(options));
  }

  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  const hasText = Boolean(
    (parsedMessageContent[0] as { children: { text: string }[] }).children[0]
      .text,
  );

  return lastMessage.userName !== "System"
    ? prependTextInTextEditorValue(
      `${lastMessage.userName}: ${getIconWithText({
        hasText,
        hasImages,
        hasFiles,
      })}`,
        parsedMessageContent,
      )
    : parseStringToTextEditorValue();
};
