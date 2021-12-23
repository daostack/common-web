import React, { useEffect, useRef, useState } from "react";
import {
  COMMON_APP_APP_STORE_LINK,
  COMMON_APP_GOOGLE_PLAY_LINK,
  MobileOperatingSystem,
  ROUTE_PATHS,
} from "../../constants";
import { useOutsideClick } from "../../hooks";

import { getMobileOperatingSystem } from "../../utils";

import "./index.scss";

interface AccountProps {
  user: any;
  logOut: () => void;
}

const Account = ({ user, logOut }: AccountProps) => {
  const [imageError, setImageError] = useState(false);
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

  const getUserName = () => {
    let name = "";
    if (user?.displayName) {
      name = user?.displayName;
    }

    if (!name) {
      name = `${user.firstName} ${user.lastName}`;
    }

    return name;
  };

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      {!imageError ? (
        <img
          src={userPic}
          className="avatar"
          alt="user avatar"
          onError={() => setImageError(true)}
        />
      ) : (
        <img
          src={`https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${user?.email}&rounded=true`}
          className="avatar"
          alt="user avatar"
        />
      )}
      <div>{getUserName()}</div>
      <div className="vertical-menu" />
      {showMenu && (
        <div className="menu-wrapper" ref={wrapperRef}>
          <div onClick={() => (window.location.href = ROUTE_PATHS.MY_COMMONS)}>
            My Commons
          </div>
          <div
            onClick={() =>
              window.open(
                getMobileOperatingSystem() === MobileOperatingSystem.iOS
                  ? COMMON_APP_APP_STORE_LINK
                  : COMMON_APP_GOOGLE_PLAY_LINK
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
