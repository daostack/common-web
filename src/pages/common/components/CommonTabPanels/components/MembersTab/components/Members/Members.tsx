import React, { FC, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import {
  CirclesPermissions,
  CommonMember,
  DirectParent,
} from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { MembersList } from "../MembersList";

interface MembersComponentProps {
  commonId: string;
  governanceId: string | null;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isProject: boolean;
  directParent?: DirectParent | null;
}

const MembersComponent: FC<MembersComponentProps> = (props) => {
  const { commonId, governanceId, commonMember, isProject, directParent } =
    props;
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers({ commonId });

  const sortedCommonMembers = useMemo(
    () =>
      [...commonMembers].sort(
        (commonMember, prevCommonMember) =>
          prevCommonMember.joinedAt?.seconds - commonMember.joinedAt?.seconds,
      ),
    [commonMembers],
  );

  useEffect(() => {
    if (commonId) {
      fetchCommonMembers();
    }
  }, [fetchCommonMembers, commonId]);

  return (
    <div
      className={classNames(
        "members__menu-wrapper",
        "members__section-element",
        "members__section-list",
      )}
    >
      {!areCommonMembersFetched && <Loader />}
      {areCommonMembersFetched && (
        <MembersList
          members={sortedCommonMembers}
          commonId={commonId}
          governanceId={governanceId}
          commonMember={commonMember}
          isProject={isProject}
          directParent={directParent}
        />
      )}
    </div>
  );
};

export default MembersComponent;
