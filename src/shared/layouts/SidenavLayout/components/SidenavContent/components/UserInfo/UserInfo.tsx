import React, { FC } from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Image } from "@/shared/components/Image";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  avatarURL?: string;
  userName?: string;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const { avatarURL = avatarPlaceholderSrc, userName = "User" } = props;

  return (
    <div className={styles.container}>
      <Image
        className={styles.avatar}
        src={avatarURL}
        alt={`${userName}'s avatar`}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <span className={styles.name}>Yossi Mordachai</span>
    </div>
  );
};

export default UserInfo;
