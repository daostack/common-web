import React, { FC } from "react";
import {
  AuthenticatedContent,
  MenuItemsPlacement,
  UnauthenticatedContent,
} from "./components";
import { ContentStyles } from "./components";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  avatarURL?: string;
  userName?: string;
  isAuthenticated?: boolean;
  menuItemsPlacement?: MenuItemsPlacement;
  rightArrowIconClassName?: string;
  contentStyles?: ContentStyles;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const {
    avatarURL,
    userName,
    isAuthenticated = false,
    menuItemsPlacement,
    rightArrowIconClassName,
    contentStyles,
  } = props;

  return (
    <div className={styles.container}>
      {isAuthenticated ? (
        <AuthenticatedContent
          avatarURL={avatarURL}
          userName={userName}
          menuItemsPlacement={menuItemsPlacement}
          rightArrowIconClassName={rightArrowIconClassName}
          contentStyles={contentStyles}
        />
      ) : (
        <UnauthenticatedContent contentStyles={contentStyles} />
      )}
    </div>
  );
};

export default UserInfo;
