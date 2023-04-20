import { GetLastMessageOptions } from "@/pages/common";

export const getLastMessage = (options: GetLastMessageOptions): string => {
  const { lastMessage, commonName } = options;

  if (lastMessage) {
    return `${lastMessage.userName}: ${lastMessage.content}`;
  }

  return commonName || "";
};
