import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FollowFeedItemAction } from "@/shared/constants";
import { FeedItemFollow } from "@/shared/models";
import {
  FollowFeedItemMutationState,
  commonFeedFollowsActions,
  selectFollowFeedItemMutationStateById,
  selectCommonFeedFollowsByIds,
} from "@/store/states";
import { getFollowFeedItemMutationId } from "@/store/states/commonFeedFollows/utils";
import { useUserFeedItemFollowData } from "./useUserFeedItemFollowData";

export interface FeedItemFollowState {
  isFollowing: boolean;
  isDisabled: boolean;
  onFollowToggle: (action?: FollowFeedItemAction) => void;
  isUserFeedItemFollowDataFetched: boolean;
  userFeedItemFollowData: FeedItemFollow | null;
}

interface Data {
  commonId?: string;
  feedItemId?: string;
}

interface Options {
  withSubscription?: boolean;
}

export function useFeedItemFollow(
  { commonId, feedItemId }: Data,
  { withSubscription }: Options = {},
): FeedItemFollowState {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isFollowing = useSelector(
    selectCommonFeedFollowsByIds(commonId, feedItemId),
  );
  const {
    fetched: isUserFeedItemFollowDataFetched,
    data: userFeedItemFollowData,
    fetchUserFeedItemFollowData,
    setUserFeedItemFollowData,
  } = useUserFeedItemFollowData({ feedItemId, userId }, { withSubscription });
  const mutationId =
    commonId && feedItemId
      ? getFollowFeedItemMutationId(commonId, feedItemId)
      : undefined;
  const followFeedItemMutationState = useSelector(
    selectFollowFeedItemMutationStateById(mutationId),
  );
  const { isFollowingInProgress }: FollowFeedItemMutationState =
    followFeedItemMutationState || {
      isFollowingInProgress: false,
      isFollowingFinished: false,
    };

  const isDisabled = !isUserFeedItemFollowDataFetched || isFollowingInProgress;

  const onFollowToggle = useCallback(
    (action?: FollowFeedItemAction) => {
      if (feedItemId && commonId) {
        dispatch(
          commonFeedFollowsActions.followFeedItem.request({
            feedItemId,
            commonId,
            action:
              action ||
              (isFollowing
                ? FollowFeedItemAction.Unfollow
                : FollowFeedItemAction.Follow),
          }),
        );
      }
    },
    [feedItemId, commonId, isFollowing],
  );

  useEffect(() => {
    if (!userId) {
      setUserFeedItemFollowData(null);
    }
  }, [userId]);

  useEffect(() => {
    if (isUserFeedItemFollowDataFetched && feedItemId && commonId) {
      const action = userFeedItemFollowData
        ? FollowFeedItemAction.Follow
        : FollowFeedItemAction.Unfollow;

      dispatch(
        commonFeedFollowsActions.setFeedItemFollow({
          feedItemId,
          commonId,
          action,
        }),
      );
    }
  }, [isUserFeedItemFollowDataFetched, userFeedItemFollowData]);

  return useMemo(
    () => ({
      isFollowing,
      isDisabled,
      onFollowToggle,
      isUserFeedItemFollowDataFetched,
      userFeedItemFollowData,
    }),
    [
      isFollowing,
      isDisabled,
      onFollowToggle,
      isUserFeedItemFollowDataFetched,
      userFeedItemFollowData,
    ],
  );
}
