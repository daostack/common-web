import React, { useEffect, useRef, useState } from "react";
import {
  COMMON_APP_APP_STORE_LINK,
  COMMON_APP_GOOGLE_PLAY_LINK,
  MobileOperatingSystem,
  ROUTE_PATHS,
} from "../../constants";
import { useOutsideClick } from "../../hooks";

import { UserAvatar } from "../../../shared/components";
import { User } from "../../../shared/models";
import { getMobileOperatingSystem, getUserName } from "../../utils";

import "./index.scss";

interface AccountProps {
  user: User | null;
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

  return (
    <div className="account-wrapper" onClick={() => setShowMenu(!showMenu)}>
      <UserAvatar
        className="avatar"
        photoURL={user?.photoURL}
        nameForRandomAvatar={user?.email}
        userName={getUserName(user)}
      />
      <div>{getUserName(user)}</div>
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
