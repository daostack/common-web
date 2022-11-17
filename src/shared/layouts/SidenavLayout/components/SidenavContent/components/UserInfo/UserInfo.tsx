import React, { FC } from "react";
import { AuthenticatedContent, UnauthenticatedContent } from "./components";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  avatarURL?: string;
  userName?: string;
  isAuthenticated?: boolean;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const { avatarURL, userName, isAuthenticated = false } = props;

  return (
    <div className={styles.container}>
      {isAuthenticated ? (
        <AuthenticatedContent avatarURL={avatarURL} userName={userName} />
      ) : (
        <UnauthenticatedContent />
      )}
    </div>
  );
};

export default UserInfo;
