import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logger, UserActivityService } from "@/services";
import {
  commonLayoutActions,
  CommonLayoutState,
  selectCommonLayoutLastCommonFromFeed,
} from "@/store/states";

interface Return {
  lastVisitedCommon: CommonLayoutState["lastCommonFromFeed"];
  updateLastVisitedCommon: (
    data: CommonLayoutState["lastCommonFromFeed"],
  ) => void;
}

export const useLastVisitedCommon = (userId?: string): Return => {
  const dispatch = useDispatch();
  const lastVisitedCommon = useSelector(selectCommonLayoutLastCommonFromFeed);

  const updateLastVisitedCommon = useCallback<
    Return["updateLastVisitedCommon"]
  >(
    async (data) => {
      dispatch(commonLayoutActions.setLastCommonFromFeed(data));

      if (!userId || !data?.id) {
        return;
      }

      try {
        await UserActivityService.updateUserActivity(userId, {
          lastVisitedCommon: data.id,
        });
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
    lastVisitedCommon,
    updateLastVisitedCommon,
  };
};
