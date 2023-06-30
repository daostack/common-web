import React, { FC } from "react";
import classNames from "classnames";
import {
  AuthenticatedContent,
  MenuItemsPlacement,
  MenuItemsStyles,
  UnauthenticatedContent,
} from "./components";
import { ContentStyles } from "./components";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  className?: string;
  avatarURL?: string;
  userName?: string;
  isAuthenticated?: boolean;
  menuItemsPlacement?: MenuItemsPlacement;
  rightArrowIconClassName?: string;
  contentStyles?: ContentStyles;
  menuItemsStyles?: MenuItemsStyles;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const {
    className,
    avatarURL,
    userName,
    isAuthenticated = false,
    menuItemsPlacement,
    rightArrowIconClassName,
    contentStyles,
    menuItemsStyles,
  } = props;

  return (
    <div className={classNames(styles.container, className)}>
      {isAuthenticated ? (
        <AuthenticatedContent
          avatarURL={avatarURL}
          userName={userName}
          menuItemsPlacement={menuItemsPlacement}
          rightArrowIconClassName={rightArrowIconClassName}
          contentStyles={contentStyles}
          menuItemsStyles={menuItemsStyles}
        />
      ) : (
        <UnauthenticatedContent contentStyles={contentStyles} />
      )}
    </div>
  );
};

export default UserInfo;
