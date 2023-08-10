import { useCallback, useState } from "react";
import { ChatChannel } from "@/shared/models";

export interface UserForProfileData {
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
}

interface PreviousUserForProfileData
  extends Omit<UserForProfileData, "chatChannel"> {
  chatChannel: ChatChannel;
}

interface State {
  currentData: UserForProfileData | null;
  previousData: PreviousUserForProfileData | null;
}

interface Return {
  userForProfileData: UserForProfileData | null;
  setUserForProfileData: (
    data: Omit<UserForProfileData, "chatChannel">,
  ) => void;
  setChatChannel: (chatChannel: ChatChannel) => void;
  resetUserForProfileData: (force?: boolean) => void;
}

export const useUserForProfile = (): Return => {
  const [state, setState] = useState<State>({
    currentData: null,
    previousData: null,
  });

  const setUserForProfileData = useCallback<Return["setUserForProfileData"]>(
    (data) => {
      setState(({ currentData }) => ({
        currentData: data,
        previousData: currentData?.chatChannel
          ? {
              ...currentData,
              chatChannel: currentData.chatChannel,
            }
          : null,
      }));
    },
    [],
  );

  const setChatChannel = useCallback((chatChannel: ChatChannel) => {
    setState((currentState) => ({
      ...currentState,
      currentData: currentState.currentData && {
        ...currentState.currentData,
        chatChannel,
      },
    }));
  }, []);

  const resetUserForProfileData = useCallback((force = false) => {
    setState((currentState) => ({
      currentData:
        !force && currentState.previousData
          ? {
              ...currentState.previousData,
            }
          : null,
      previousData: null,
    }));
  }, []);

  return {
    userForProfileData: state.currentData,
    setUserForProfileData,
    setChatChannel,
    resetUserForProfileData,
  };
};
