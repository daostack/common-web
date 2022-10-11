import React, { FC, memo } from "react";
import { useSelector } from "react-redux";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { getCirclesWithHighestTier } from "@/shared/utils";
import { selectGovernance } from "../../../store/selectors";
import CommonMember from "./CommonMemberComponent";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
}

const MembersList: FC<MembersListComponentProps> = ({ members }) => {
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
        const memberName = `${member.user.firstName} ${member.user.lastName}`;

        return (
          <CommonMember
            key={member.id}
            circles={circlesString}
            memberName={memberName}
            avatar={member.user.photoURL}
            joinedAt={member.joinedAt}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
