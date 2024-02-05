import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  CancelTokenSource,
  ChatService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import { ChatChannelIdentificationData } from "@/shared/interfaces";
import { cacheActions } from "@/store/states";

interface Return {
  markChatChannelAsSeen: (chatChannelId: string) => void;
  markChatChannelAsUnseen: (chatChannelId: string) => void;
}

export const useUpdateChatChannelSeenState = (): Return => {
  const dispatch = useDispatch();
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const updateSeenState = async (
    chatChannelId: string,
    newSeenValue: boolean,
  ) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    if (!userId) {
      return;
    }

    const identificationData: ChatChannelIdentificationData = {
      userId,
      chatChannelId,
    };

    try {
      dispatch(
        cacheActions.updateChatChannelUserSeenState({
          ...identificationData,
          seen: newSeenValue,
        }),
      );
      cancelTokenRef.current = getCancelTokenSource();

      if (newSeenValue) {
        await ChatService.markChatChannelAsSeen(chatChannelId, {
          cancelToken: cancelTokenRef.current.token,
        });
      } else {
        await ChatService.markChatChannelAsUnseen(chatChannelId, {
          cancelToken: cancelTokenRef.current.token,
        });
      }

      cancelTokenRef.current = null;
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
      }

      dispatch(
        cacheActions.updateChatChannelUserSeenState({
          ...identificationData,
          seen: !newSeenValue,
        }),
      );
    }
  };

  const markChatChannelAsSeen = useCallback(
    async (chatChannelId: string) => {
      updateSeenState(chatChannelId, true);
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
