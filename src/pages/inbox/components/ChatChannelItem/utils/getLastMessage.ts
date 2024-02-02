import { getLastMessageIconWithText } from "@/pages/commonFeed/utils";
import { ChatChannel } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  prependTextInTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";

export const getLastMessage = (
  lastMessage: ChatChannel["lastMessage"],
): TextEditorValue | undefined => {
  if (!lastMessage) {
    return;
  }

  const parsedMessageContent = parseStringToTextEditorValue(lastMessage.text);
  const hasText = !checkIsTextEditorValueEmpty(parsedMessageContent);

  return prependTextInTextEditorValue(
    `${lastMessage.ownerName}: ${getLastMessageIconWithText({
      hasText,
      hasImages: lastMessage.hasImages,
      hasFiles: lastMessage.hasFiles,
    })}`,
    parsedMessageContent,
  );
};
