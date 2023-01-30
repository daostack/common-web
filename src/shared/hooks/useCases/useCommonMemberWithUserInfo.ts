import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { selectGovernance } from "@/pages/OldCommon/store/selectors";
import { CommonMemberWithUserInfo } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { useUserById } from "./useUserById";

export const useCommonMemberWithUserInfo = (
  commonId: string,
  userId: string | undefined,
) => {
  const [data, setData] = useState<CommonMemberWithUserInfo | undefined>();
  const governance = useSelector(selectGovernance());
  const governanceCircles = Object.values(governance?.circles || {});

  const memberCircles = getFilteredByIdCircles(governanceCircles);
  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");

  const { fetchUser, data: user } = useUserById();
  const { data: commonMember, fetchCommonMember } = useCommonMember();

  useEffect(() => {
    if (userId) fetchUser(userId);
    fetchCommonMember(commonId, {});
  }, [fetchUser, fetchCommonMember, userId, commonId]);

  useEffect(() => {
    if (commonMember && user) {
      setData({
        id: commonMember.id,
        userId: commonMember.userId,
        joinedAt: commonMember.joinedAt,
        circleIds: [circlesString],
        user: user,
      });
    }
  }, [commonMember, user]);

  return { data };
};
