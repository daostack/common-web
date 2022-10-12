import React, { FC } from "react";
import firebase from "firebase/app";
import { v4 } from "uuid";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { UserAvatar } from "../../../../../shared/components";
import { CommonMemberPreview } from "./CommonMemberPreview";
import { useModal } from "@/shared/hooks";

interface CommonMemberProps {
    circles: string;
    memberName: string;
    avatar: string | undefined;
    joinedAt: firebase.firestore.Timestamp;
    member: CommonMemberWithUserInfo;
    commonId: string;
}

const CommonMember: FC<CommonMemberProps> = ({ member, commonId, circles, memberName, avatar, joinedAt }) => {
    const { isShowing, onClose, onOpen } = useModal(false);

    return (
        <>
            <li key={v4()} onClick={onOpen} className="members__section__common-member" >
                <div className="members__section__common-member-details">
                    <UserAvatar photoURL={avatar} className="members__section__common-member-avatar" />
                    <div className="members__section__common-member-text-container">
                        <div className="members__section__common-member-circles">{circles}</div>
                        <div className="members__section__common-member-name">{memberName}</div>
                    </div>
                </div>
                <div className="members__section__common-member-date">{joinedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
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
    )
}

export default CommonMember;