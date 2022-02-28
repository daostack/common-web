import React, { FC } from "react";
import classNames from "classnames";
import { AuthProvider } from "../../../../../shared/constants";
import { User } from "../../../../../shared/models";
import "./index.scss";

interface UserAuthInfoProps {
  className?: string;
  user: User;
  authProvider: AuthProvider | null;
}

const getUserInfoForAuthProvider = (user: User, authProvider: AuthProvider | null) => {
  if (authProvider === AuthProvider.Phone) {
    // Return user's phone number
  }

  return user.email || null;
};

const UserAuthInfo: FC<UserAuthInfoProps> = (props) => {
  const { className, user, authProvider } = props;
  const userInfo = getUserInfoForAuthProvider(user, authProvider);

  if (!userInfo) {
    return null;
  }

  return (
    <span className={classNames("user-auth-info", className)}>
      {authProvider && (
        <img
          className={`user-auth-info__provider-icon user-auth-info__provider-icon--${authProvider}`}
          src={`/icons/social-login/${authProvider}.svg`}
          alt={`${authProvider} logo`}
        />
      )}
      {userInfo}
    </span>
  );
};

export default UserAuthInfo;
