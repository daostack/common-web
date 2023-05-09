import React, { FC, memo, useEffect } from "react";
import CommonMember from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberComponent";
import { useGovernance } from "@/shared/hooks/useCases";
import { CirclesPermissions, CommonMemberWithUserInfo } from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import styles from "./MembersList.module.scss";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
  governanceId: string | null;
  commonMember: (CommonMemberModel & CirclesPermissions) | null;
  isSubCommon: boolean;
}

const MembersList: FC<MembersListComponentProps> = ({
  members,
  commonId,
  governanceId,
  commonMember,
  isSubCommon,
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
        return (
          <CommonMember
            key={member.id}
            avatar={member.user.photoURL}
            joinedAt={member.joinedAt}
            member={member}
            commonId={commonId}
            commonMember={commonMember}
            governanceCircles={governanceCircles}
            isSubCommon={isSubCommon}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
