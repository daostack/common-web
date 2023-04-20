import React, { FC } from "react";
import { UserAvatar } from "@/shared/components";
import { User } from "@/shared/models";
import styles from "./MentionDropdown.module.scss";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  users?: User[];
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const { onClick, users = [] } = props;

  return (
    <div className={styles.container} data-cy="mentions-portal">
      {users.map((user) => (
        <div
          key={user.uid}
          onClick={() => onClick(user)}
          className={styles.content}
        >
          <UserAvatar
            className={styles.userAvatar}
            userName={user.displayName}
            photoURL={user?.photo || user?.photoURL}
          />
          <p className={styles.userName}>{user.displayName}</p>
        </div>
      ))}
    </div>
  );
};

export default MentionDropdown;
