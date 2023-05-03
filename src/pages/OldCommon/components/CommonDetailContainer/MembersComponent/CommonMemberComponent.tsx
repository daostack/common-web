import React, { FC, MouseEventHandler, useState } from "react";
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
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
} from "@/shared/utils";
import { UserAvatar } from "../../../../../shared/components";
import { CommonMemberPreview } from "./CommonMemberPreview";

interface CommonMemberProps {
  avatar: string | undefined;
  joinedAt: firebase.firestore.Timestamp;
  member: CommonMemberWithUserInfo;
  commonId: string;
  commonMember?: (CommonMemberModel & CirclesPermissions) | null;
  governanceCircles: Circle[];
}

const CommonMember: FC<CommonMemberProps> = ({
  member,
  commonId,
  avatar,
  joinedAt,
  commonMember,
  governanceCircles,
}) => {
  const { isShowing, onClose, onOpen } = useModal(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    const canInvite =
      commonMember?.allowedActions[GovernanceActions.INVITE_TO_CIRCLE];

    /**
     * For now, handle only the case of INVITE_TO_CIRCLE.
     * See https://github.com/daostack/common-web/issues/1344 for more details.
     */
    // const canAssign =
    //   commonMember?.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE];

    if (canInvite) {
      handleMenuToggle(true);
    }
  };

  const memberCircles = getFilteredByIdCircles(
    governanceCircles,
    member.circleIds,
  );
  const notMemberCircles = getFilteredByIdCircles(
    governanceCircles,
    member.circleIds,
    true,
  );
  const circlesString = getCirclesWithHighestTier(memberCircles)
    .map((circle) => circle.name)
    .join(", ");
  const memberName = getUserName(member.user);

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  };

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
          isOpen={isMenuOpen}
          onMenuToggle={handleMenuToggle}
          notMemberCircles={notMemberCircles}
          memberName={memberName}
          commonId={commonId}
          memberId={member.userId}
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
