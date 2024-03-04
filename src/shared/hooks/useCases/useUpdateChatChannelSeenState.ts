import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatService } from "@/services";
import { getChatChannelUserStatusKey } from "@/shared/constants";
import { cacheActions } from "@/store/states";

interface Return {
  markChatChannelAsSeen: (chatChannelId: string, delay?: number) => void;
  markChatChannelAsUnseen: (chatChannelId: string) => void;
}

export const useUpdateChatChannelSeenState = (): Return => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const updateSeenState = async (
    chatChannelId: string,
    newSeenValue: boolean,
  ) => {
    if (!userId) {
      return;
    }

    const key = getChatChannelUserStatusKey({
      userId,
      chatChannelId,
    });

    try {
      dispatch(
        cacheActions.updateChatChannelUserSeenState({
          key,
          seen: newSeenValue,
          isSeenUpdating: true,
        }),
      );

      if (newSeenValue) {
        await ChatService.markChatChannelAsSeen(chatChannelId);
      } else {
        await ChatService.markChatChannelAsUnseen(chatChannelId);
      }
    } catch (error) {
      dispatch(
        cacheActions.updateChatChannelUserSeenState({
          key,
          seen: !newSeenValue,
          isSeenUpdating: false,
        }),
      );
    }
  };

  const markChatChannelAsSeen = useCallback(
    async (chatChannelId: string, delay = 0) => {
      setTimeout(() => {
        updateSeenState(chatChannelId, true);
      }, delay);
    },
    [userId],
  );

  const markChatChannelAsUnseen = useCallback(
    async (chatChannelId: string) => {
      updateSeenState(chatChannelId, false);
    },
    [userId],
  );

  return { markChatChannelAsSeen, markChatChannelAsUnseen };
};
