import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatService } from "@/services";
import { useIsMounted, useLoadingState } from "@/shared/hooks";
import { ChatChannel } from "@/shared/models";

interface Return {
  loading: boolean;
  dmUserChatChannel: ChatChannel | null;
  fetchDMUserChatChannel: (dmUserId: string[]) => void;
  resetDMUserChatChannel: () => void;
  error?: boolean;
}

export const useDMUserChatChannel = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<ChatChannel | null>(null);
  const [error, setError] = useState<boolean>(false);
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchDMUserChatChannel = useCallback(
    async (dmUserIds: string[]) => {
      if (!userId) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      let dmUserChatChannel: ChatChannel | null = null;

      try {
        dmUserChatChannel = await ChatService.getDMUserChatChannel(
          userId,
          dmUserIds,
        );

        if (!dmUserChatChannel) {
          dmUserChatChannel = await ChatService.createChatChannel([
            userId,
            ...dmUserIds,
          ]);
        }
      } catch (error) {
        setError(true);
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data: dmUserChatChannel,
          });
        }
      }
    },
    [userId],
  );

  const resetDMUserChatChannel = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
    setError(false);
  }, []);

  return {
    fetchDMUserChatChannel,
    resetDMUserChatChannel,
    loading: state.loading,
    dmUserChatChannel: state.data,
    error: error,
  };
};
