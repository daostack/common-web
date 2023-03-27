import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { useGovernance } from "./useGovernance";
import { useUserById } from "./useUserById";

export const useCommonMemberWithUserInfo = (
  commonId: string,
  userId?: string,
  governanceId?: string,
): LoadingState<CommonMemberWithUserInfo | null> => {
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
  } = useGovernance();

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
    fetchCommonMember(commonId, {}, true);
    if (governanceId) {
      fetchGovernance(governanceId);
    }
  }, [userId, commonId, governanceId]);

  const governanceCircles = Object.values(governance?.circles || {});
  const memberCircles = getFilteredByIdCircles(governanceCircles);
  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");

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
