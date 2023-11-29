import { useCallback } from "react";
import { Logger, UserActivityService } from "@/services";
import { UserActivity } from "@/shared/models";

interface Return {
  updateUserActivity: (userId: string, data: Partial<UserActivity>) => void;
}

export const useUserActivityUpdate = (): Return => {
  const updateUserActivity = useCallback(
    async (userId: string, data: Partial<UserActivity>) => {
      try {
        await UserActivityService.updateUserActivity(userId, data);
      } catch (error) {
        Logger.error(error);
      }
    },
    [],
  );

  return { updateUserActivity };
};
