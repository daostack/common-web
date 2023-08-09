import { useCallback, useState } from "react";
import { ChatChannel } from "@/shared/models";

export interface UserForProfileData {
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
}

interface Return {
  userForProfileData: UserForProfileData | null;
  setUserForProfileData: (data: UserForProfileData) => void;
  setChatChannel: (chatChannel: ChatChannel) => void;
  resetUserForProfileData: () => void;
}

export const useUserForProfile = (): Return => {
  const [currentData, setCurrentData] = useState<UserForProfileData | null>(
    null,
  );

  const setChatChannel = useCallback((chatChannel: ChatChannel) => {
    setCurrentData(
      (data) =>
        data && {
          ...data,
          chatChannel,
        },
    );
  }, []);

  const resetUserForProfileData = useCallback(() => {
    setCurrentData(null);
  }, []);

  return {
    userForProfileData: currentData,
    setUserForProfileData: setCurrentData,
    setChatChannel,
    resetUserForProfileData,
  };
};
