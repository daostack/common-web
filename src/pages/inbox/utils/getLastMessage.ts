import { GetLastMessageOptions } from "@/pages/common";
import { getLastMessageIconWithText } from "@/pages/commonFeed/utils";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  prependTextInTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, hasImages, hasFiles, commonName } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(commonName);
  }

  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  const hasText = !checkIsTextEditorValueEmpty(parsedMessageContent);

  return prependTextInTextEditorValue(
    `${lastMessage.userName}: ${getLastMessageIconWithText({
      hasText,
      hasImages,
      hasFiles,
    })}`,
    parsedMessageContent,
  );
};
