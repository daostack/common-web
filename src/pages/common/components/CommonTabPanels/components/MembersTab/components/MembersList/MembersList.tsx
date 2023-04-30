import React, { FC, memo, useEffect } from "react";
import CommonMember from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberComponent";
import { useGovernance } from "@/shared/hooks/useCases";
import { CirclesPermissions, CommonMemberWithUserInfo } from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";
import styles from "./MembersList.module.scss";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
  governanceId: string | null;
  commonMember: (CommonMemberModel & CirclesPermissions) | null;
}

const MembersList: FC<MembersListComponentProps> = ({
  members,
  commonId,
  governanceId,
  commonMember,
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
    return <Loader className={styles.loader} />;
  }

  const governanceCircles = Object.values(governance?.circles || {});

  return (
    <ul className="members__section__members-list">
      {members.map((member) => {
        const memberCircles = getFilteredByIdCircles(
          governanceCircles,
          member.circleIds,
        );
        console.log(memberCircles);
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
            commonMember={commonMember}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
