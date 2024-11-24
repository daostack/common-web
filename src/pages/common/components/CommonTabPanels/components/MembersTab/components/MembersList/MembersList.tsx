import React, { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import CommonMember from "@/pages/OldCommon/components/CommonDetailContainer/MembersComponent/CommonMemberComponent";
import { useGovernance } from "@/shared/hooks/useCases";
import {
  CirclesPermissions,
  CommonMemberWithUserInfo,
  DirectParent,
} from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { commonActions } from "@/store/states";
import styles from "./MembersList.module.scss";

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
  commonId: string;
  governanceId: string | null;
  commonMember: (CommonMemberModel & CirclesPermissions) | null;
  isProject: boolean;
  directParent?: DirectParent | null;
}

const MembersList: FC<MembersListComponentProps> = ({
  members,
  commonId,
  governanceId,
  commonMember,
  isProject,
  directParent,
}) => {
  const {
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
  } = useGovernance();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(commonActions.resetRecentAssignedCircleByMember({ commonId }));
    };
  }, []);

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
            isProject={isProject}
            directParent={directParent}
          />
        );
      })}
    </ul>
  );
};

export default memo(MembersList);
