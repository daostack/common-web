export const getChatChannelUserStatusKey = (info: {
  userId: string;
  chatChannelId: string;
}): string => `${info.userId}_${info.chatChannelId}`;
