import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FollowFeedItemAction } from "@/shared/constants";
import { selectInboxFollows, inboxActions } from "@/store/states";
import { useFollowFeedItem } from "./useFollowFeedItem";
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
  const follows = useSelector(selectInboxFollows);
  const isFollowing =
    feedItemId && commonId ? !!follows[commonId]?.[feedItemId] : false;
  const {
    fetched: isUserFeedItemFollowDataFetched,
    data: userFeedItemFollowData,
    fetchUserFeedItemFollowData,
    setUserFeedItemFollowData,
  } = useUserFeedItemFollowData();
  const {
    isFollowingInProgress,
    isFollowingFinishedWithError,
    followFeedItem,
    cancelFeedItemFollowing,
  } = useFollowFeedItem();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDisabled = !isUserFeedItemFollowDataFetched || isFollowingInProgress;

  const onFollowToggle = (action?: FollowFeedItemAction) => {
    if (feedItemId && commonId) {
      followFeedItem({
        feedItemId,
        commonId,
        action:
          action ||
          (isFollowing
            ? FollowFeedItemAction.Unfollow
            : FollowFeedItemAction.Follow),
      });
      dispatch(
        inboxActions.setFeedItemFollow({
          itemId: feedItemId,
          commonId: commonId,
          isFollowing: !isFollowing,
        }),
      );
    }
  };

  useEffect(() => {
    if (feedItemId && commonId) {
      dispatch(
        inboxActions.setFeedItemFollow({
          itemId: feedItemId,
          commonId: commonId,
          isFollowing: false,
        }),
      );

      if (userId) {
        fetchUserFeedItemFollowData(userId, feedItemId);
      } else {
        setUserFeedItemFollowData(null);
      }
    }

    return () => {
      cancelFeedItemFollowing();
    };
  }, [userId, feedItemId, commonId]);

  useEffect(() => {
    if (isUserFeedItemFollowDataFetched && feedItemId && commonId) {
      dispatch(
        inboxActions.setFeedItemFollow({
          itemId: feedItemId,
          commonId: commonId,
          isFollowing: Boolean(userFeedItemFollowData),
        }),
      );
    }
  }, [isUserFeedItemFollowDataFetched]);

  useEffect(() => {
    if (isFollowingFinishedWithError && feedItemId && commonId) {
      dispatch(
        inboxActions.setFeedItemFollow({
          itemId: feedItemId,
          commonId: commonId,
          isFollowing: false,
        }),
      );
    }
  }, [isFollowingFinishedWithError]);

  return {
    isFollowing,
    isDisabled,
    onFollowToggle,
  };
}
