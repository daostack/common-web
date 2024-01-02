import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonService, Logger } from "@/services";
import { CirclesPermissions, CommonMember } from "@/shared/models";
import {
  FollowFeedItemMutationState,
  commonFeedFollowsActions,
} from "@/store/states";

export interface CommonFollowState {
  isFollowInProgress: boolean;
  onFollowToggle: () => void;
}

export function useCommonFollow(
  commonId: string,
  commonMember: (CommonMember & CirclesPermissions) | null,
): CommonFollowState {
  const dispatch = useDispatch();
  const [isFollowInProgress, setIsFollowInProgress] = useState(false);

  const setFeedItemsFollow = (
    isFollowing: boolean,
    mutationState: FollowFeedItemMutationState,
  ) => {
    dispatch(
      commonFeedFollowsActions.setFeedItemsFollowStateByCommon({
        commonId,
        isFollowing,
        mutationState,
      }),
    );
  };

  const onFollowToggle = useCallback(async () => {
    const { isFollowing = null } = commonMember ?? {};

    if (isFollowing === null) {
      return;
    }

    const nextIsFollowing = !isFollowing;
    const action = nextIsFollowing
      ? CommonService.followCommon
      : CommonService.muteCommon;

    try {
      setIsFollowInProgress(true);
      setFeedItemsFollow(nextIsFollowing, {
        isFollowingInProgress: true,
        isFollowingFinished: false,
      });

      await action(commonId);
    } catch (error) {
      setFeedItemsFollow(isFollowing, {
        isFollowingInProgress: false,
        isFollowingFinished: false,
        isFollowingFinishedWithError: true,
      });
      setIsFollowInProgress(false);
      Logger.error(error);
    }
  }, [commonId, commonMember?.isFollowing]);

  useEffect(() => {
    setIsFollowInProgress(false);
  }, [commonId, commonMember]);

  return {
    isFollowInProgress,
    onFollowToggle,
  };
}
