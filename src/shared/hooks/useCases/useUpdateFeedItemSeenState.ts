import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  CancelTokenSource,
  CommonFeedService,
  isRequestCancelled,
  getCancelTokenSource,
  Logger,
} from "@/services";
import {
  FeedItemIdentificationData,
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
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const updateSeenState = async (
    payload:
      | MarkCommonFeedItemAsSeenPayload
      | MarkCommonFeedItemAsUnseenPayload,
    newSeenValue: boolean,
  ) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    if (!userId) {
      return;
    }

    const { commonId, feedObjectId } = payload;
    const identificationData: FeedItemIdentificationData = {
      commonId,
      userId,
      feedObjectId,
    };

    try {
      dispatch(
        cacheActions.updateFeedItemUserSeenState({
          ...identificationData,
          seen: newSeenValue,
        }),
      );
      cancelTokenRef.current = getCancelTokenSource();

      if (newSeenValue) {
        await CommonFeedService.markCommonFeedItemAsSeen(payload, {
          cancelToken: cancelTokenRef.current.token,
        });
      } else {
        await CommonFeedService.markCommonFeedItemAsUnseen(payload, {
          cancelToken: cancelTokenRef.current.token,
        });
      }

      cancelTokenRef.current = null;
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
      }

      dispatch(
        cacheActions.updateFeedItemUserSeenState({
          ...identificationData,
          seen: !newSeenValue,
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
