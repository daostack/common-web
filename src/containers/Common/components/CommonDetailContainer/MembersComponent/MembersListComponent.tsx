import React, { FC, memo } from "react";
import { useSelector } from "react-redux";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { getCirclesWithHighestTier, getUserName } from "@/shared/utils";
import { selectGovernance } from "../../../store/selectors";
import CommonMember from "./CommonMemberComponent";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
}

const MembersList: FC<MembersListComponentProps> = ({ members, commonId }) => {
  const governance = useSelector(selectGovernance());
  const governanceCircles = Object.values(governance?.circles || {});

  return (
    <ul className="members__section__members-list">
      {members.map((member) => {
        const memberCircleIds = Object.values(member.circles.map);
        const memberCircles = governanceCircles.filter((circle) =>
          memberCircleIds.includes(circle.id)
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
