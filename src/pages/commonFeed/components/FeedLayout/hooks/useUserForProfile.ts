import { useCallback, useState } from "react";

export interface UserForProfileData {
  userId: string;
  commonId?: string;
}

interface Return {
  userForProfileData: UserForProfileData | null;
  setUserForProfileData: (data: UserForProfileData) => void;
  resetUserForProfileData: () => void;
}

export const useUserForProfile = (): Return => {
  const [currentData, setCurrentData] = useState<UserForProfileData | null>(
    null,
  );

  const resetUserForProfileData = useCallback(() => {
    setCurrentData(null);
  }, []);

  return {
    userForProfileData: currentData,
    setUserForProfileData: setCurrentData,
    resetUserForProfileData,
  };
};
