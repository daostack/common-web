import { useEffect, useState } from "react";
import { CommonService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import {
  CirclesPermissions,
  CommonMember,
  CommonMemberWithUserInfo,
  Timestamp,
} from "@/shared/models";
import {
  generateCirclesDataForCommonMember,
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { useGovernanceByCommonId } from "./useGovernanceByCommonId";
import { useUserById } from "./useUserById";

export const useCommonMemberWithUserInfo = (
  commonId?: string,
  userId?: string,
): LoadingState<CommonMemberWithUserInfo | null> => {
  const [commonMember, setCommonMember] = useState<
    (CommonMember & CirclesPermissions) | null
  >(null);

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

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
    if (commonId) {
      fetchGovernance(commonId);
    }
  }, [userId, commonId]);

  useEffect(() => {
    (async () => {
      if (userId && commonId && governance) {
        const data = await CommonService.getCommonMemberByUserId(
          commonId,
          userId,
        );

        if (data) {
          setCommonMember({
            ...data,
            ...generateCirclesDataForCommonMember(
              governance?.circles,
              data?.circleIds,
            ),
          });
        }
      }
    })();
  }, [userId, commonId, governance]);

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
        loading: isUserLoading || isGovernanceFetched,
        fetched: isUserFetched && isGovernanceFetched,
      };
};
