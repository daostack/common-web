import React, { FC, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { Loader } from "@/shared/ui-kit";
import { MembersList } from "../MembersList";

interface MembersComponentProps {
  commonId: string;
  governanceId: string | null;
}

const MembersComponent: FC<MembersComponentProps> = (props) => {
  const { commonId, governanceId } = props;
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
    fetchCommonMembers(commonId);
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
        />
      )}
    </div>
  );
};

export default MembersComponent;
