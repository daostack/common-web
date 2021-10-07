import React, { useEffect, useRef, useState } from "react";
import {
  COMMON_APP_APP_STORE_LINK,
  COMMON_APP_GOOGLE_PLAY_LINK,
  MobileOperatingSystem,
  ROUTE_PATHS,
} from "../../constants";
import { useOutsideClick } from "../../hooks";

import { User } from "../../models";
import { getMobileOperatingSystem } from "../../utils";

import "./index.scss";

interface AccountProps {
  user: User;
  logOut: () => void;
}

const Account = ({ user, logOut }: AccountProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);

  useEffect(() => {
    if (isOutside) {
      setShowMenu(false);
      setOusideValue();
    }
  }, [isOutside, setShowMenu, setOusideValue]);

  const userPic = user.photoURL
    ? user.photoURL
    : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${user?.email}&rounded=true`;

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <img src={userPic} className="avatar" alt="user avatar" />
      <div>{user?.displayName || `${user.firstName} ${user.lastName}`}</div>
      <div className="vertical-menu" />
      {showMenu && (
        <div className="menu-wrapper" ref={wrapperRef}>
          <div onClick={() => (window.location.href = ROUTE_PATHS.MY_COMMONS)}>My Commons</div>
          <div
            onClick={() =>
              window.open(
                getMobileOperatingSystem() === MobileOperatingSystem.iOS
                  ? COMMON_APP_APP_STORE_LINK
                  : COMMON_APP_GOOGLE_PLAY_LINK,
              )
            }
          >
            Download Common app
          </div>
          <div onClick={() => logOut()}>Log out</div>
        </div>
      )}
    </div>
  );
};

export default Account;
