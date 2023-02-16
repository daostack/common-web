import React, { FC, memo, useEffect } from "react";
import { useGovernance } from "@/shared/hooks/useCases";
import { CommonMemberWithUserInfo } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";
import CommonMember from "./CommonMemberComponent";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
  governanceId: string | null;
}

const MembersList: FC<MembersListComponentProps> = ({
  members,
  commonId,
  governanceId,
}) => {
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
  } = useGovernance();

  useEffect(() => {
    if (governanceId) {
      fetchGovernance(governanceId);
    }
  }, [governanceId]);

  // TODO: show loader?
  if (!isGovernanceFetched) {
    return null;
  }

  const governanceCircles = Object.values(governance?.circles || {});

  return (
    <ul className="members__section__members-list">
      {members.map((member) => {
        const memberCircles = getFilteredByIdCircles(
          governanceCircles,
          member.circleIds,
        );
        const circlesString = getCirclesWithHighestTier(memberCircles)
          .map((circle) => circle.name)
          .join(", ");
        const memberName = getUserName(member.user);

        return (
          <CommonMember
            key={member.id}
            circles={circlesString}
            memberName={memberName}
            avatar={member.user.photoURL}
            joinedAt={member.joinedAt}
            member={member}
            commonId={commonId}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
