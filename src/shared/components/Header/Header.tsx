import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useLocation, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Colors, ROUTE_PATHS, ScreenSize } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getScreenSize } from "../../store/selectors";
import DownloadCommonApp from "../DownloadCommonApp/DownloadCommonApp";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";
import { Account } from "../Account";
import {
  authentificated,
  selectIsNewUser,
  selectUser,
  selectIsLoginModalShowing,
} from "../../../containers/Auth/store/selectors";
import { isMobile } from "../../utils";
import { Modal } from "../Modal";
import { LoginContainer } from "../../../containers/Login/containers/LoginContainer";
import { logOut, setIsLoginModalShowing } from "../../../containers/Auth/store/actions";

const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const [showMenu, setShowMenu] = useState(false);
  const [isTop, setIsTop] = useState<boolean | undefined>(undefined);
  const isAuthorized = useSelector(authentificated());
  const user = useSelector(selectUser());
  const isNewUser = useSelector(selectIsNewUser());
  const isLoginModalShowing = useSelector(selectIsLoginModalShowing());

  const handleOpen = useCallback(() => {
    dispatch(setIsLoginModalShowing(true));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setIsLoginModalShowing(false));
  }, [dispatch]);

  React.useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsTop(window.scrollY === 0 ? true : false);
    });
  }, [isTop]);

  React.useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  React.useEffect(() => {
    if (!isNewUser && user) {
      if (isLoginModalShowing) {
        handleClose();
      }
    }
  }, [user, isNewUser, isLoginModalShowing, handleClose]);

  const handleNavLinkClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const logOutUser = () => {
    dispatch(logOut());
  };

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      <NavLink to="/" exact activeClassName="active">
        About
      </NavLink>
      <NavLink to={ROUTE_PATHS.COMMON_LIST} activeClassName="active">
        Explore
      </NavLink>
      {isAuthorized && (
        <NavLink to={ROUTE_PATHS.MY_COMMONS} exact activeClassName="active">
          My Commons
        </NavLink>
      )}

      {isAuthorized && isMobile() && <button onClick={logOutUser}>Log out</button>}
      {!isAuthorized && (
        <button className="login-button" onClick={handleOpen}>
          Login / Sign up
        </button>
      )}
    </div>
  );

  const headerWrapperClassName = classNames({
    "header-wrapper": true,
    init: location.pathname === "/" && isTop === undefined,
    hide: location.pathname === "/" && isTop,
    show: location.pathname === "/" && isTop === false,
  });

  return (
    <section className={headerWrapperClassName}>
      <Link to="/" className="common-logo">
        <img src="/icons/logo.svg" alt="logo" className="logo" />
      </Link>
      {screenSize === ScreenSize.Desktop ? (
        <>
          {links}
          {user && <Account user={user} logOut={logOutUser} />}
          {!isAuthorized ? (
            <div className="mobile-links-container">
              <MobileLinks color={Colors.black} />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div
            className="humburger-menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <CloseIcon width="24" height="24" />
            ) : (
              <HamburgerIcon />
            )}
          </div>
          {showMenu && (
            <div className="menu-wrapper">
              <DownloadCommonApp
                setHasClosedPopup={() => {
                  return true;
                }}
                inMenu={true}
              />
              {links}
            </div>
          )}
        </>
      )}
      <Modal
        isShowing={isLoginModalShowing}
        onClose={handleClose}
        className="mobile-full-screen"
        mobileFullScreen
      >
        <LoginContainer closeModal={handleClose} />
      </Modal>
    </section>
  );
};

export default Header;
