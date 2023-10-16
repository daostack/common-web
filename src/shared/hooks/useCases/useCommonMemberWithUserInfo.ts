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
  } = useCommonMember({ userId });

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
    if (commonId) {
      fetchCommonMember(commonId, {}, true);
      fetchGovernance(commonId);
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
        isFollowing: false,
        streamsUnreadCountByProjectStream: {},
        unreadCountByProjectStream: {},
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
          isFollowing: commonMember.isFollowing,
          streamsUnreadCountByProjectStream:
            commonMember.streamsUnreadCountByProjectStream,
          unreadCountByProjectStream: commonMember.unreadCountByProjectStream,
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
