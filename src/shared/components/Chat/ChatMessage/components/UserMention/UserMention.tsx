import React, { FC } from "react";
import classNames from "classnames";
import { UserInfoPopup } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { DirectParent, User } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import styles from "../../ChatMessage.module.scss";

interface UserMentionProps {
  users: User[];
  userId: string;
  displayName: string;
  mentionTextClassName?: string;
  commonId?: string;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
}

const UserMention: FC<UserMentionProps> = (props) => {
  const {
    users,
    userId,
    displayName,
    mentionTextClassName,
    commonId,
    directParent,
    onUserClick,
  } = props;
  const {
    isShowing: isShowingUserProfile,
    onClose: onCloseUserProfile,
    onOpen: onOpenUserProfile,
  } = useModal(false);
  const user = users.find(({ uid }) => uid === userId);
  const withSpace = displayName[displayName.length - 1] === " ";
  const userName = user
    ? `${getUserName(user)}${withSpace ? " " : ""}`
    : displayName;

  const handleUserNameClick = () => {
    if (onUserClick) {
      onUserClick(userId);
    } else {
      onOpenUserProfile();
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
      {!onUserClick && (
        <UserInfoPopup
          avatar={user?.photoURL}
          isShowing={isShowingUserProfile}
          onClose={onCloseUserProfile}
          commonId={commonId}
          userId={user?.uid}
          directParent={directParent}
        />
      )}
    </>
  );
};

export default UserMention;
