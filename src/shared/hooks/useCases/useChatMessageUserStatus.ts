import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { ChatMessageUserStatus } from "@/shared/models";
import { cacheActions, selectChatMessageUserStatus } from "@/store/states";

type State = LoadingState<ChatMessageUserStatus | null>;

interface IdentificationInfo {
  userId: string;
  chatChannelId: string;
}

interface Return extends State {
  fetchChatMessageUserStatus: (info: IdentificationInfo) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useChatMessageUserStatus = (): Return => {
  const dispatch = useDispatch();
  const [identificationInfo, setIdentificationInfo] =
    useState<IdentificationInfo | null>(null);
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(
      selectChatMessageUserStatus(
        identificationInfo || { userId: "", chatChannelId: "" },
      ),
    ) || defaultState;

  const fetchChatMessageUserStatus = useCallback(
    (info: IdentificationInfo) => {
      setDefaultState({ ...DEFAULT_STATE });
      setIdentificationInfo(info);
      dispatch(
        cacheActions.getChatMessageUserStatus.request({
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

    const unsubscribe = ChatService.subscribeToChatMessageUserStatus(
      identificationInfo.userId,
      identificationInfo.chatChannelId,
      (data) => {
        dispatch(
          cacheActions.updateChatMessageUserStatus({
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
    fetchChatMessageUserStatus,
  };
};
