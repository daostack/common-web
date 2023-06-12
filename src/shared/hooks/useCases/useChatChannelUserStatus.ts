import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { ChatChannelUserStatus } from "@/shared/models";
import { cacheActions, selectChatChannelUserStatus } from "@/store/states";

type State = LoadingState<ChatChannelUserStatus | null>;

interface IdentificationInfo {
  userId: string;
  chatChannelId: string;
}

interface Return extends State {
  fetchChatChannelUserStatus: (info: IdentificationInfo) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useChatChannelUserStatus = (): Return => {
  const dispatch = useDispatch();
  const [identificationInfo, setIdentificationInfo] =
    useState<IdentificationInfo | null>(null);
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(
      selectChatChannelUserStatus(
        identificationInfo || { userId: "", chatChannelId: "" },
      ),
    ) || defaultState;

  const fetchChatChannelUserStatus = useCallback(
    (info: IdentificationInfo) => {
      setDefaultState({ ...DEFAULT_STATE });
      setIdentificationInfo(info);
      dispatch(
        cacheActions.getChatChannelUserStatus.request({
          payload: info,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (!identificationInfo) {
      return;
    }

    const unsubscribe = ChatService.subscribeToChatChannelUserStatus(
      identificationInfo.userId,
      identificationInfo.chatChannelId,
      (data) => {
        dispatch(
          cacheActions.updateChatChannelUserStatus({
            ...identificationInfo,
            state: {
              loading: false,
              fetched: true,
              data,
            },
          }),
        );
      },
    );

    return unsubscribe;
  }, [identificationInfo]);

  return {
    ...state,
    fetchChatChannelUserStatus,
  };
};