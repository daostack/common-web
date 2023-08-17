import { GetLastMessageOptions } from "@/pages/common";
import { DiscussionMessageOwnerType } from "@/shared/constants";
import { CommonFeedType, PredefinedTypes } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
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

export const getLastMessageIconWithText = ({
  hasText,
  hasImages,
  hasFiles,
}: {
  hasText?: boolean;
  hasImages?: boolean;
  hasFiles?: boolean;
}): string => {
  if (hasImages) {
    return `📷 ${hasText ? "" : "Picture "}`;
  } else if (hasFiles) {
    return `📁 ${hasText ? "" : "File "}`;
  }

  return "";
};

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, hasImages, hasFiles, currentUserId } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(getCustomizedMessageString(options));
  }

  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  const hasText = !checkIsTextEditorValueEmpty(parsedMessageContent);
  const userName =
    lastMessage.ownerType === DiscussionMessageOwnerType.System
      ? ""
      : `${
          lastMessage.ownerId === currentUserId ? "You" : lastMessage.userName
        }: `;

  return prependTextInTextEditorValue(
    `${userName}${getLastMessageIconWithText({
      hasText,
      hasImages,
      hasFiles,
    })}`,
    parsedMessageContent,
  );
};
