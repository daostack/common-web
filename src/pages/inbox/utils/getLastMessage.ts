import { GetLastMessageOptions } from "@/pages/common";
import { getLastMessageIconWithText } from "@/pages/commonFeed/utils";
import { DiscussionMessageOwnerType } from "@/shared/constants";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  prependTextInTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, hasImages, hasFiles, commonName, currentUserId } =
    options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(commonName);
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
