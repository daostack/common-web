import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setAreReportsLoading } from "@/shared/store/actions";
import { selectAreReportsLoading } from "@/shared/store/selectors";
import {
  ApiEndpoint,
  COMMON_APP_APP_STORE_LINK,
  COMMON_APP_GOOGLE_PLAY_LINK,
  MobileOperatingSystem,
  ROUTE_PATHS,
} from "../../constants";
import { useOutsideClick } from "../../hooks";

import { Loader, UserAvatar } from "../../../shared/components";
import { User } from "../../../shared/models";
import { getMobileOperatingSystem, getUserName, saveByURL } from "../../utils";

import "./index.scss";

interface AccountProps {
  user: User | null;
  logOut: () => void;
  isTrusteeRoute: boolean;
  hasAdminAccess: boolean;
}

const Account = ({
  user,
  logOut,
  isTrusteeRoute,
  hasAdminAccess,
}: AccountProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const areReportsLoading = useSelector(selectAreReportsLoading());

  const handleReportsDownload = async () => {
    if (areReportsLoading) {
      return;
    }

    dispatch(setAreReportsLoading(true));
    await saveByURL(ApiEndpoint.GetReports, "reports.zip");
    dispatch(setAreReportsLoading(false));
  };

  useEffect(() => {
    if (isOutside) {
      setShowMenu(false);
      setOusideValue();
    }
  }, [isOutside, setShowMenu, setOusideValue]);

  const showMyAccount = () => {
    history.push(ROUTE_PATHS.MY_ACCOUNT_PROFILE);
  };

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
          {!isTrusteeRoute && (
            <>
              <div
                className="account-wrapper__menu-item"
                onClick={showMyAccount}
              >
                My Account
              </div>
              <div
                className="account-wrapper__menu-item"
                onClick={() => (window.location.href = ROUTE_PATHS.MY_COMMONS)}
              >
                My Commons
              </div>
              <div
                className="account-wrapper__menu-item"
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
            </>
          )}
          {hasAdminAccess && (
            <div
              className="account-wrapper__menu-item"
              onClick={handleReportsDownload}
            >
              Download Reports
              {areReportsLoading && (
                <Loader className="account-wrapper__menu-item-loader" />
              )}
            </div>
          )}
          <div className="account-wrapper__menu-item" onClick={() => logOut()}>
            Log out
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
