import React, { FC } from "react";
import classNames from "classnames";
import { UserAvatar } from "@/shared/components";
import { User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import "./index.scss";

interface MemberInfoProps {
  className?: string;
  user: User;
}

const MemberInfo: FC<MemberInfoProps> = (props) => {
  const { className, user } = props;

  return (
    <div className={classNames("assign-circle-member-info", className)}>
      <UserAvatar
        className="assign-circle-member-info__avatar"
        photoURL={user.photoURL}
        nameForRandomAvatar={user.email}
        userName={getUserName(user)}
      />
      {getUserName(user)}
    </div>
  );
};

export default MemberInfo;
