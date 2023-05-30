import { GetLastMessageOptions } from "@/pages/common";
import {
  parseStringToTextEditorValue,
  prependTextInTextEditorValue,
  TextEditorValue,
} from "@/shared/ui-kit";

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, commonName } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(commonName);
  }

  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  return prependTextInTextEditorValue(
    `${lastMessage.userName}: `,
    parsedMessageContent,
  );
};
