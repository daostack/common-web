import React, { FC, memo, useEffect } from "react";
import CommonMember from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberComponent";
import { useGovernance } from "@/shared/hooks/useCases";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";

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

  if (!isGovernanceFetched) {
    return <Loader />;
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
