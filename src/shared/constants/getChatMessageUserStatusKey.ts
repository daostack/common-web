export const getChatMessageUserStatusKey = (info: {
  userId: string;
  chatChannelId: string;
}): string => `${info.userId}_${info.chatChannelId}`;
