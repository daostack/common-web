import React, { FC, memo, useEffect } from "react";
import { useGovernance } from "@/shared/hooks/useCases";
import { CommonMemberWithUserInfo } from "@/shared/models";
import CommonMember from "./CommonMemberComponent";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
  governanceId: string | null;
  isProject: boolean;
}

const MembersList: FC<MembersListComponentProps> = ({
  members,
  commonId,
  governanceId,
  isProject,
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
    return null;
  }

  const governanceCircles = Object.values(governance?.circles || {});

  return (
    <ul className="members__section__members-list">
      {members.map((member) => {
        return (
          <CommonMember
            key={member.id}
            avatar={member.user.photoURL}
            joinedAt={member.joinedAt}
            member={member}
            commonId={commonId}
            governanceCircles={governanceCircles}
            isProject={isProject}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
