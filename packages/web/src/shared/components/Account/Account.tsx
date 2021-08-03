import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../../containers/Auth/store/actions";
import { selectUser } from "../../../containers/Auth/store/selectors";

import "./index.scss";

const Account = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser());

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <img src={user?.photoURL} className="avatar" alt="user avatar" />
      <div>{user?.displayName}</div>
      {showMenu && (
        <div className="menu-wrapper">
          <div onClick={() => dispatch(logOut())}>Log out</div>
        </div>
      )}
    </div>
  );
};

export default Account;
