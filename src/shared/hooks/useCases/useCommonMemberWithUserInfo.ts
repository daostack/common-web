import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useCommonDataContext } from "@/pages/common/providers";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { useUserById } from "./useUserById";

export const useCommonMemberWithUserInfo = (
  commonId: string,
  userId?: string,
): LoadingState<CommonMemberWithUserInfo | null> => {
  const { governance } = useCommonDataContext();
  const governanceCircles = Object.values(governance?.circles || {});

  const memberCircles = getFilteredByIdCircles(governanceCircles);
  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");

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
  }, [userId, commonId]);

  return commonMember && user
    ? {
        data: {
          id: commonMember.id,
          userId: commonMember.userId,
          joinedAt: commonMember.joinedAt,
          circleIds: [circlesString],
          user: user,
        },
        loading: false,
        fetched: true,
      }
    : {
        data: null,
        loading: isUserLoading || isCommonMemberLoading,
        fetched: isUserFetched && isCommonMemberFetched,
      };
};
