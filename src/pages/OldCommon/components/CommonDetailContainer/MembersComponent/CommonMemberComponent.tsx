import React, { FC, MouseEventHandler, useRef, useState } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/app";
import { useLongPress } from "use-long-press";
import { v4 } from "uuid";
import { MemberDropdown } from "@/pages/common/components/CommonTabPanels/components/MembersTab/components/MemberDropdown";
import { GovernanceActions, ScreenSize } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import {
  Circle,
  CirclesPermissions,
  CommonMemberWithUserInfo,
} from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ContextMenuRef } from "@/shared/ui-kit";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
  getUserName,
  removeProjectCircles,
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
  isSubCommon: boolean;
}

const CommonMember: FC<CommonMemberProps> = ({
  member,
  commonId,
  avatar,
  joinedAt,
  commonMember,
  governanceCircles,
  isSubCommon,
}) => {
  const { isShowing, onClose, onOpen } = useModal(false);
  const contextMenuRef = useRef<ContextMenuRef>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);

  /**
   * For now, handle only the case of INVITE_TO_CIRCLE.
   * If a member can INVITE_TO_CIRCLE we use ASSIGN_CIRCLE to execute the action.
   * See https://github.com/daostack/common-web/issues/1344 for more details.
   */
  // const canAssign =
  //   commonMember?.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE];
  const canInvite =
    commonMember?.allowedActions[GovernanceActions.INVITE_TO_CIRCLE];

  const handleLongPress = (event) => {
    let x = 0;
    let y = 0;

    if (event.touches) {
      const touch = event.touches[0];
      x = touch?.clientX || 0;
      y = touch?.clientY || 0;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    setIsLongPressed(true);
    console.log(x, y);
    contextMenuRef.current?.open(x, y);
    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(
    isMobileView && canInvite ? handleLongPress : null,
    {
      threshold: 400,
      cancelOnMovement: true,
      onStart: () => setIsLongPressing(true),
      onFinish: () => setIsLongPressing(false),
      onCancel: () => setIsLongPressing(false),
    },
  );

  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();

    if (!isMobileView && canInvite) {
      contextMenuRef.current?.open(event.clientX, event.clientY);
    }
  };

  const memberCircles = getFilteredByIdCircles(
    governanceCircles,
    member.circleIds,
  );

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
        {...getLongPressProps()}
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
          isSubCommon={isSubCommon}
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
