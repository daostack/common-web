import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import useNotification from "../useNotification";

interface Return {
  markCommonAsSeen: (
    commonId: string
  ) => ReturnType<typeof setTimeout>;
}

export const useUpdateCommonSeenState = (): Return => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { notify } = useNotification();

  const updateSeenState = async (
    commonId: string,
  ) => {
    if (!userId) {
      return;
    }

    try {
      await CommonService.markCommonAsSeen(commonId, userId);
    } catch (error) {
      notify("Something went wrong");
    }
  };

  const markCommonAsSeen = useCallback(
    (commonId: string, delay = 0) => {
      return setTimeout(() => {
        updateSeenState(commonId);
      }, delay);
    },
    [userId],
  );

  return { markCommonAsSeen };
};
