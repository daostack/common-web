import React, { FC } from "react";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import classNames from "classnames";
import { AuthProvider } from "../../../../../shared/constants";
import { User } from "../../../../../shared/models";
import "./index.scss";

interface UserAuthInfoProps {
  className?: string;
  user: User;
  userPhoneNumber: string | null;
  authProvider: AuthProvider | null;
}

const getUserInfoForAuthProvider = (
  user: User,
  userPhoneNumber: string | null,
  authProvider: AuthProvider | null
) => {
  if (authProvider === AuthProvider.Phone) {
    return userPhoneNumber ? formatPhoneNumberIntl(userPhoneNumber) : null;
  }

  return user.email || null;
};

const UserAuthInfo: FC<UserAuthInfoProps> = (props) => {
  const { className, user, userPhoneNumber, authProvider } = props;
  const userInfo = getUserInfoForAuthProvider(
    user,
    userPhoneNumber,
    authProvider
  );

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
