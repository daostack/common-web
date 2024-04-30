import React, { FC } from "react";
import classNames from "classnames";
import { AI_PRO_USER, AI_USER } from "@/shared/constants";
import { User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import styles from "../../ChatMessage.module.scss";

interface UserMentionProps {
  users: User[];
  userId: string;
  displayName: string;
  mentionTextClassName?: string;
  onUserClick?: (userId: string) => void;
}

const UserMention: FC<UserMentionProps> = (props) => {
  const { users, userId, displayName, mentionTextClassName, onUserClick } =
    props;

  const user = [AI_USER, AI_PRO_USER, ...users].find(
    ({ uid }) => uid === userId,
  );
  const withSpace = displayName[displayName.length - 1] === " ";
  const userName = user
    ? `${getUserName(user)}${withSpace ? " " : ""}`
    : displayName;

  const handleUserNameClick = () => {
    if (onUserClick) {
      onUserClick(userId);
    }
  };

  return (
    <>
      <span
        className={classNames(styles.mentionText, mentionTextClassName)}
        onClick={handleUserNameClick}
      >
        @{userName}
      </span>
    </>
  );
};

export default UserMention;
