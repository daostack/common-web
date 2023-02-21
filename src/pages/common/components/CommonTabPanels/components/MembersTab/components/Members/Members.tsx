import React, { FC, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { Common } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { MembersList } from "../MembersList";

interface MembersComponentProps {
  common: Common;
}

const MembersComponent: FC<MembersComponentProps> = ({ common }) => {
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();

  const sortedCommonMembers = useMemo(
    () =>
      [...commonMembers].sort(
        (commonMember, prevCommonMember) =>
          prevCommonMember.joinedAt.seconds - commonMember.joinedAt.seconds,
      ),
    [commonMembers],
  );

  useEffect(() => {
    fetchCommonMembers(common.id);
  }, [fetchCommonMembers, common.id]);

  return (
    <div className="members__component-wrapper">
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
            commonId={common.id}
            governanceId={common.governanceId}
          />
        )}
      </div>
    </div>
  );
};

export default MembersComponent;
