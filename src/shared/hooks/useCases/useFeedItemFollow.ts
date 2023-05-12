import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FollowFeedItemAction } from "@/shared/constants";
import {
  selectCommonFeedFollows,
  selectFollowFeedItemMutationState,
  FollowFeedItemMutationState,
  commonFeedFollowsActions,
} from "@/store/states";
import { getFollowFeedItemMutationId } from "@/store/states/commonFeedFollows/utils";
import { useUserFeedItemFollowData } from "./useUserFeedItemFollowData";

export interface FeedItemFollowState {
  isFollowing: boolean;
  isDisabled: boolean;
  onFollowToggle: (action?: FollowFeedItemAction) => void;
}

export function useFeedItemFollow(
  feedItemId?: string,
  commonId?: string,
): FeedItemFollowState {
  const dispatch = useDispatch();
  const follows = useSelector(selectCommonFeedFollows);
  const isFollowing =
    feedItemId && commonId ? !!follows[commonId]?.[feedItemId] : false;
  const {
    fetched: isUserFeedItemFollowDataFetched,
    data: userFeedItemFollowData,
    fetchUserFeedItemFollowData,
    setUserFeedItemFollowData,
  } = useUserFeedItemFollowData();
  const followFeedItemMutationState = useSelector(
    selectFollowFeedItemMutationState,
  );
  const mutationId =
    commonId && feedItemId
      ? getFollowFeedItemMutationId(commonId, feedItemId)
      : undefined;
  const { isFollowingInProgress }: FollowFeedItemMutationState =
    mutationId && followFeedItemMutationState[mutationId]
      ? followFeedItemMutationState[mutationId]
      : {
          isFollowingInProgress: false,
          isFollowingFinished: false,
        };

  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDisabled = !isUserFeedItemFollowDataFetched || isFollowingInProgress;

  const onFollowToggle = (action?: FollowFeedItemAction) => {
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
  };

  useEffect(() => {
    if (feedItemId && commonId) {
      if (userId) {
        fetchUserFeedItemFollowData(userId, feedItemId);
      } else {
        setUserFeedItemFollowData(null);
      }
    }
  }, [userId, feedItemId, commonId]);

  useEffect(() => {
    if (isUserFeedItemFollowDataFetched && feedItemId && commonId) {
      dispatch(
        commonFeedFollowsActions.setFeedItemFollow({
          itemId: feedItemId,
          commonId: commonId,
          isFollowing: Boolean(userFeedItemFollowData),
        }),
      );
    }
  }, [isUserFeedItemFollowDataFetched]);

  return {
    isFollowing,
    isDisabled,
    onFollowToggle,
  };
}
