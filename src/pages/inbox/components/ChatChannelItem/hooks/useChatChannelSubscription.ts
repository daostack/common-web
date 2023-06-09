import { useEffect } from "react";
import { ChatService } from "@/services";
import { ChatChannel } from "@/shared/models";

export const useChatChannelSubscription = (
  chatChannelId: string,
  callback?: (item: ChatChannel, isRemoved: boolean) => void,
): void => {
  useEffect(() => {
    if (!callback) {
      return;
    }

    const unsubscribe = ChatService.subscribeToChatChannel(
      chatChannelId,
      callback,
    );

    return unsubscribe;
  }, [chatChannelId, callback]);
};
