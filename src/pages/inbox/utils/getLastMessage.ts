import { GetLastMessageOptions } from "@/pages/common";
import { parseStringToTextEditorValue, TextEditorValue } from "@/shared/ui-kit";

export const getLastMessage = (
  options: GetLastMessageOptions,
): TextEditorValue => {
  const { lastMessage, commonName } = options;

  if (!lastMessage) {
    return parseStringToTextEditorValue(commonName);
  }

  const parsedMessageUserName = parseStringToTextEditorValue(
    `${lastMessage.userName}: `,
  );
  const parsedMessageContent = parseStringToTextEditorValue(
    lastMessage.content,
  );

  return [...parsedMessageUserName, ...parsedMessageContent];
};
