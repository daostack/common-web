import React, { FC, memo } from "react";
import CommonMember from './CommonMemberComponent';
import { numberToBinary } from "../CommonWhitepaper/utils";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { selectGovernance } from "../../../store/selectors";
import { useSelector } from "react-redux";

interface MembersListComponentProps {
    members: CommonMemberWithUserInfo[];
}

const MembersList: FC<MembersListComponentProps> = ({ members }) => {
    const governance = useSelector(selectGovernance());

    return <ul className="members__section__members-list">
        {members.map(member => {
            const circlesIndexs = Array.from(numberToBinary(member.circles.bin), Number)

            let circlesString = ''
            const memberName = `${member.user.firstName} ${member.user.lastName}`


            circlesIndexs.forEach((bin, index) => {
                if (bin && governance?.circles[index]) circlesString += `${governance.circles[index].name}, `
            })

            circlesString = circlesString.slice(0, -2)

            return (
              <CommonMember
                key={member.id}
                circles={circlesString}
                memberName={memberName}
                avatar={member.user.photoURL}
                joinedAt={member.joinedAt}
              />
            );
        })}
    </ul>
}


export default memo(MembersList);
