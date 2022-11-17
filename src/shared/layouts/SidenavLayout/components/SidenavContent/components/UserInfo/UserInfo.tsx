import React, { FC } from "react";
import { AuthenticatedContent } from "./components";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  avatarURL?: string;
  userName?: string;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const { avatarURL, userName } = props;

  return (
    <div className={styles.container}>
      <AuthenticatedContent avatarURL={avatarURL} userName={userName} />
    </div>
  );
};

export default UserInfo;
