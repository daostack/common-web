import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonFeedService } from "@/services";
import { getFeedItemUserMetadataKey } from "@/shared/constants";
import {
  MarkCommonFeedItemAsSeenPayload,
  MarkCommonFeedItemAsUnseenPayload,
} from "@/shared/interfaces";
import { cacheActions } from "@/store/states";

interface Return {
  markFeedItemAsSeen: (payload: MarkCommonFeedItemAsSeenPayload) => void;
  markFeedItemAsUnseen: (payload: MarkCommonFeedItemAsUnseenPayload) => void;
}

export const useUpdateFeedItemSeenState = (): Return => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const updateSeenState = async (
    payload:
      | MarkCommonFeedItemAsSeenPayload
      | MarkCommonFeedItemAsUnseenPayload,
    newSeenValue: boolean,
  ) => {
    if (!userId) {
      return;
    }

    const { commonId, feedObjectId } = payload;
    const key = getFeedItemUserMetadataKey({
      commonId,
      userId,
      feedObjectId,
    });

    try {
      dispatch(
        cacheActions.updateFeedItemUserSeenState({
          key,
          seen: newSeenValue,
          isSeenUpdating: true,
        }),
      );

      if (newSeenValue) {
        await CommonFeedService.markCommonFeedItemAsSeen(payload);
      } else {
        await CommonFeedService.markCommonFeedItemAsUnseen(payload);
      }
    } catch (error) {
      dispatch(
        cacheActions.updateFeedItemUserSeenState({
          key,
          seen: !newSeenValue,
          isSeenUpdating: false,
        }),
      );
    }
  };

  const markFeedItemAsSeen = useCallback(
    async (payload: MarkCommonFeedItemAsSeenPayload) => {
      updateSeenState(payload, true);
    },
    [userId],
  );

  const markFeedItemAsUnseen = useCallback(
    async (payload: MarkCommonFeedItemAsUnseenPayload) => {
      updateSeenState(payload, false);
    },
    [userId],
  );

  return { markFeedItemAsSeen, markFeedItemAsUnseen };
};
