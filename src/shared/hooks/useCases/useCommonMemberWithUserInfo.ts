import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo, Timestamp } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { useGovernanceByCommonId } from "./useGovernanceByCommonId";
import { useUserById } from "./useUserById";

export const useCommonMemberWithUserInfo = (
  commonId?: string,
  userId?: string,
): LoadingState<CommonMemberWithUserInfo | null> => {
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
  } = useGovernanceByCommonId();
  const {
    fetchUser,
    data: user,
    loading: isUserLoading,
    fetched: isUserFetched,
  } = useUserById();
  const {
    data: commonMember,
    fetchCommonMember,
    loading: isCommonMemberLoading,
    fetched: isCommonMemberFetched,
  } = useCommonMember();

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
    if (commonId) {
      fetchGovernance(commonId);
    }
    if (userId && commonId) {
      fetchCommonMember(commonId, {}, true, userId);
    }
  }, [userId, commonId]);

  const governanceCircles = Object.values(governance?.circles || {});
  const memberCircles = getFilteredByIdCircles(
    governanceCircles,
    commonMember?.circleIds,
  );
  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");

  if (!commonId && user) {
    return {
      data: {
        id: "",
        userId: user.uid,
        joinedAt: new Timestamp(0, 0),
        circleIds: [],
        user: user,
      },
      loading: isUserLoading,
      fetched: isUserFetched,
    };
  }

  return commonMember && user && governance
    ? {
        data: {
          id: commonMember.id,
          userId: user.uid,
          joinedAt: commonMember.joinedAt,
          circleIds: [circlesString],
          user: user,
        },
        loading: false,
        fetched: true,
      }
    : {
        data: null,
        loading: isUserLoading || isCommonMemberLoading || isGovernanceFetched,
        fetched: isUserFetched && isCommonMemberFetched && isGovernanceFetched,
      };
};
