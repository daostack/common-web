import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logger, UserActivityService } from "@/services";
import { UserActivity } from "@/shared/models";
import {
  commonLayoutActions,
  selectCommonLayoutLastCommonFromFeed,
} from "@/store/states";

interface Return {
  lastVisitedCommon?: string;
  updateUserActivity: (data: Partial<UserActivity>) => void;
}

export const useUserActivity = (userId?: string): Return => {
  const dispatch = useDispatch();
  const lastCommonFromFeed = useSelector(selectCommonLayoutLastCommonFromFeed);

  const updateUserActivity = useCallback(
    async (data: Partial<UserActivity>) => {
      if (data.lastVisitedCommon) {
        dispatch(
          commonLayoutActions.setLastCommonFromFeed({
            id: data.lastVisitedCommon,
            data: null,
          }),
        );
      }
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
        if (updatedUserActivity.lastVisitedCommon) {
          dispatch(
            commonLayoutActions.setLastCommonFromFeed({
              id: updatedUserActivity.lastVisitedCommon,
              data: null,
            }),
          );
        }
      },
    );

    return unsubscribe;
  }, [userId]);

  return {
    lastVisitedCommon: lastCommonFromFeed?.id,
    updateUserActivity,
  };
};
