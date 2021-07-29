import React, { useState } from "react";
import { useSelector } from "react-redux";
import { authentificated } from "../../../containers/Auth/store/selectors";
import { User } from "../../models";
import "./index.scss";

const Account = () => {
  const [showMenu, setShowMenu] = useState(false);
  const isAuthorized = useSelector(authentificated());
  let userData: User | null = null;

  try {
    userData = JSON.parse(localStorage.getItem("user") || "");
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <img src={userData?.photo} className="avatar" alt="user avatar" />
      <div>{isAuthorized && userData?.displayName}</div>
      {showMenu && (
        <div className="menu-wrapper">
          <div>Log out</div>
        </div>
      )}
    </div>
  );
};

export default Account;
