import React, { useState } from "react";

import { User } from "../../models";

import "./index.scss";

interface AccountProps {
  user: User;
  logOut: () => void;
}

const Account = ({ user, logOut }: AccountProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const userPic = user.photoURL
    ? user.photoURL
    : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${user?.email}&rounded=true`;

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <img src={userPic} className="avatar" alt="user avatar" />
      <div>{user?.displayName || `${user.firstName} ${user.lastName}`}</div>
      {showMenu && (
        <div className="menu-wrapper">
          <div onClick={() => logOut()}>Log out</div>
        </div>
      )}
    </div>
  );
};

export default Account;
