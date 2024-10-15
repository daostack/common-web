import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonFeedService } from "@/services";
import { getFeedItemUserMetadataKey } from "@/shared/constants";
import axios, { CancelTokenSource } from "axios";
import {
  MarkCommonFeedItemAsSeenPayload,
  MarkCommonFeedItemAsUnseenPayload,
} from "@/shared/interfaces";
import { cacheActions } from "@/store/states";

interface Return {
  markFeedItemAsSeen: (
    payload: MarkCommonFeedItemAsSeenPayload,
    delay?: number,
  ) => ReturnType<typeof setTimeout>;
  markFeedItemAsUnseen: (payload: MarkCommonFeedItemAsUnseenPayload) => void;
}

export const useUpdateFeedItemSeenState = (): Return => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  
  // Ref to store the current CancelTokenSource
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const updateSeenState = async (
    payload:
      | MarkCommonFeedItemAsSeenPayload
      | MarkCommonFeedItemAsUnseenPayload,
    newSeenValue: boolean,
  ) => {
    if (!userId) {
      return;
    }

    // Cancel the previous request if it exists
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled due to a new request.");
    }

    // Create a new CancelToken for the current request
    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenRef.current = cancelTokenSource;

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
        await CommonFeedService.markCommonFeedItemAsSeen(payload, {
          cancelToken: cancelTokenSource.token,
        });
      } else {
        await CommonFeedService.markCommonFeedItemAsUnseen(payload, {
          cancelToken: cancelTokenSource.token,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }

        // Handle other types of errors here, like logging or displaying a message
        console.error("An error occurred:", error.message);
      } else {
        console.error("An unknown error occurred");
      }

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
    (payload: MarkCommonFeedItemAsSeenPayload, delay = 0) => {
      return setTimeout(() => {
        updateSeenState(payload, true);
      }, delay);
    },
    [userId],
  );

  const markFeedItemAsUnseen = useCallback(
    (payload: MarkCommonFeedItemAsUnseenPayload) => {
      updateSeenState(payload, false);
    },
    [userId],
  );

  return { markFeedItemAsSeen, markFeedItemAsUnseen };
};
