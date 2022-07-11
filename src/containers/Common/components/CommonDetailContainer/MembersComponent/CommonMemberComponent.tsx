import React, { FC } from "react";
import firebase from "firebase/app";
import { UserAvatar } from "../../../../../shared/components";
import { v4 } from "uuid";

interface CommonMemberProps {
    circles: string;
    memberName: string;
    avatar: string | undefined;
    joinedAt: firebase.firestore.Timestamp;
}

const CommonMember: FC<CommonMemberProps> = ({ circles, memberName, avatar, joinedAt }) => {

    return <li key={v4()} className="members__section__common-member"
    >
        <div className="members__section__common-member-details">
            <UserAvatar photoURL={avatar} className="members__section__common-member-avatar" />
            <div className="members__section__common-member-text-container">
                <div className="members__section__common-member-circles">{circles}</div>
                <div className="members__section__common-member-name">{memberName}</div>
            </div>
        </div>
        <div className="members__section__common-member-date">{joinedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    </li>
}

export default CommonMember;