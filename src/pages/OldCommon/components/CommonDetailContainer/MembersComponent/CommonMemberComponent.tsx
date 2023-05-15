import React, { FC, MouseEventHandler, useRef } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/app";
import { v4 } from "uuid";
import { MemberDropdown } from "@/pages/common/components/CommonTabPanels/components/MembersTab/components/MemberDropdown";
import { GovernanceActions } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import {
  Circle,
  CirclesPermissions,
  CommonMemberWithUserInfo,
} from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { ContextMenuRef } from "@/shared/ui-kit";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getHighestCircle,
  getUserName,
  removeProjectCircles,
} from "@/shared/utils";
import { selectRecentAssignedCircle } from "@/store/states";
import { UserAvatar } from "../../../../../shared/components";
import { CommonMemberPreview } from "./CommonMemberPreview";

interface CommonMemberProps {
  avatar: string | undefined;
  joinedAt: firebase.firestore.Timestamp;
  member: CommonMemberWithUserInfo;
  commonId: string;
  commonMember?: (CommonMemberModel & CirclesPermissions) | null;
  governanceCircles: Circle[];
  isProject: boolean;
}

const CommonMember: FC<CommonMemberProps> = ({
  member,
  commonId,
  avatar,
  joinedAt,
  commonMember,
  governanceCircles,
  isProject,
}) => {
  const { isShowing, onClose, onOpen } = useModal(false);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const recentAssignedCircle = useSelector(selectRecentAssignedCircle);

  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();

    /**
     * For now, handle only the case of INVITE_TO_CIRCLE.
     * If a member can INVITE_TO_CIRCLE we use ASSIGN_CIRCLE to execute the action.
     * See https://github.com/daostack/common-web/issues/1344 for more details.
     */
    // const canAssign =
    //   commonMember?.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE];
    const canInvite =
      commonMember?.allowedActions[GovernanceActions.INVITE_TO_CIRCLE];

    if (canInvite) {
      contextMenuRef.current?.open(event.clientX, event.clientY);
    }
  };

  const memberCircles = getFilteredByIdCircles(
    governanceCircles,
    member.circleIds,
  );

  if (recentAssignedCircle && member.userId === recentAssignedCircle.memberId) {
    memberCircles.push(recentAssignedCircle.circle);
  }

  const highestMemberCircle = getHighestCircle(memberCircles);

  governanceCircles.map((circle) => {
    if (!highestMemberCircle.hierarchy) {
      return;
    }
    if (!circle.hierarchy) {
      return;
    }
    if (circle.hierarchy.tier < highestMemberCircle.hierarchy.tier) {
      memberCircles.push(circle);
    }
  });

  const notMemberCircles = removeProjectCircles(
    governanceCircles.filter(
      ({ id }) => !memberCircles.map((circle) => circle.id).includes(id),
    ),
  );

  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");
  const memberName = getUserName(member.user);

  return (
    <>
      <li
        key={v4()}
        onClick={onOpen}
        onContextMenu={handleContextMenu}
        className="members__section__common-member"
      >
        <div className="members__section__common-member-details">
          <UserAvatar
            photoURL={avatar}
            className="members__section__common-member-avatar"
          />
          <div className="members__section__common-member-text-container">
            <div className="members__section__common-member-circles">
              {circlesString}
            </div>
            <div className="members__section__common-member-name">
              {memberName}
            </div>
          </div>
        </div>
        <div className="members__section__common-member-date">
          {joinedAt
            .toDate()
            .toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        <MemberDropdown
          notMemberCircles={notMemberCircles}
          memberName={memberName}
          commonId={commonId}
          isProject={isProject}
          memberId={member.userId}
          contextMenuRef={contextMenuRef}
        />
      </li>
      <CommonMemberPreview
        key={member.id}
        member={member}
        circles={circlesString}
        memberName={memberName}
        avatar={avatar}
        isShowing={isShowing}
        commonId={commonId}
        country={member.user.country}
        about={member.user.intro}
        onClose={onClose}
      />
    </>
  );
};

export default CommonMember;
