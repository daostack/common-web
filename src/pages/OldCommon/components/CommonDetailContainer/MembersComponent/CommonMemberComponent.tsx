import React, { FC, MouseEventHandler, useState } from "react";
import firebase from "firebase/app";
import { v4 } from "uuid";
import { MemberDropdown } from "@/pages/common/components/CommonTabPanels/components/MembersTab/components/MemberDropdown";
import { useModal } from "@/shared/hooks";
import { CirclesPermissions, CommonMemberWithUserInfo } from "@/shared/models";
import { CommonMember as CommonMemberModel } from "@/shared/models";
import { UserAvatar } from "../../../../../shared/components";
import { CommonMemberPreview } from "./CommonMemberPreview";

interface CommonMemberProps {
  circles: string;
  memberName: string;
  avatar: string | undefined;
  joinedAt: firebase.firestore.Timestamp;
  member: CommonMemberWithUserInfo;
  commonId: string;
  commonMember?: (CommonMemberModel & CirclesPermissions) | null;
}

const CommonMember: FC<CommonMemberProps> = ({
  member,
  commonId,
  circles,
  memberName,
  avatar,
  joinedAt,
  commonMember,
}) => {
  const { isShowing, onClose, onOpen } = useModal(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleContextMenu: MouseEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    // TODO: check if menu should open
    handleMenuToggle(true);
  };

  console.log(member.circleIds);
  console.log(commonMember);

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
              {circles}
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
        <MemberDropdown isOpen={isMenuOpen} onMenuToggle={handleMenuToggle} />
      </li>
      <CommonMemberPreview
        key={member.id}
        member={member}
        circles={circles}
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
