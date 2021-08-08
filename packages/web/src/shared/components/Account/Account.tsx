import React, { useState } from "react";
import { User } from "../../models";

import "./index.scss";

interface AccountProps {
  user: User;
  logOut: () => void;
}

const Account = ({ user, logOut }: AccountProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <img src={user?.photoURL} className="avatar" alt="user avatar" />
      <div>{user?.displayName}</div>
      {showMenu && (
        <div className="menu-wrapper">
          <div onClick={() => logOut()}>Log out</div>
        </div>
      )}
    </div>
  );
};

export default Account;
