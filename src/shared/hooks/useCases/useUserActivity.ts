import { useCallback, useEffect } from "react";
import { Logger, UserActivityService } from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { UserActivity } from "@/shared/models";

interface Return extends LoadingState<UserActivity | null> {
  updateUserActivity: (data: Partial<UserActivity>) => void;
}

export const useUserActivity = (userId?: string): Return => {
  const [userActivityState, setUserActivityState] =
    useLoadingState<UserActivity | null>(null, { loading: true });

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

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = UserActivityService.subscribeToUserActivity(
      userId,
      (updatedUserActivity) => {
        setUserActivityState({
          loading: false,
          fetched: true,
          data: updatedUserActivity,
        });
      },
    );

    return unsubscribe;
  }, [userId]);

  return {
    ...userActivityState,
    updateUserActivity,
  };
};
