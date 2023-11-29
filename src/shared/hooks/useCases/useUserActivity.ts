import { useCallback } from "react";
import { Logger, UserActivityService } from "@/services";
import { UserActivity } from "@/shared/models";

interface Return {
  updateUserActivity: (data: Partial<UserActivity>) => void;
}

export const useUserActivity = (userId?: string): Return => {
  const updateUserActivity = useCallback(
    async (data: Partial<UserActivity>) => {
      if (!userId) {
        return;
      }

      try {
        await UserActivityService.updateUserActivity(userId, data);
      } catch (error) {
        Logger.error(error);
      }
    },
    [userId],
  );

  return { updateUserActivity };
};
