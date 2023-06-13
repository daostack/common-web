import { useEffect } from "react";
import { ChatService } from "@/services";
import { ChatChannel } from "@/shared/models";

export const useChatChannelSubscription = (
  chatChannelId: string,
  userId?: string,
  callback?: (item: ChatChannel, isRemoved: boolean) => void,
): void => {
  useEffect(() => {
    if (!callback || !userId) {
      return;
    }

    const unsubscribe = ChatService.subscribeToChatChannel(
      chatChannelId,
      userId,
      callback,
    );

    return unsubscribe;
  }, [userId, chatChannelId, callback]);
};
