import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useLocation, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Colors, CONTACT_EMAIL, ROUTE_PATHS, ScreenSize } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getScreenSize } from "../../store/selectors";
import DownloadCommonApp from "../DownloadCommonApp/DownloadCommonApp";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";
import { Account } from "../Account";
import { useModal } from "../../hooks";
import { authentificated, selectIsNewUser, selectUser } from "../../../containers/Auth/store/selectors";
import { isMobile } from "../../utils";
import { Modal } from "../Modal";
import { LoginContainer } from "../../../containers/Login/containers/LoginContainer";
import { logOut } from "../../../containers/Auth/store/actions";

const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const [showMenu, setShowMenu] = useState(false);
  const [isTop, setIsTop] = useState<boolean | undefined>(undefined);
  const { isShowing, onOpen, onClose } = useModal(false);
  const isAuthorized = useSelector(authentificated());
  const user = useSelector(selectUser());
  const isNewUser = useSelector(selectIsNewUser());

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
      if (isShowing) {
        onClose();
      }
    }
  }, [user, isNewUser, isShowing, onClose]);

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
        Explore Commons
      </NavLink>
      {isAuthorized && (
        <NavLink to={ROUTE_PATHS.MY_COMMONS} exact activeClassName="active">
          My Commons
        </NavLink>
      )}
      <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
      {isAuthorized && isMobile() && <button>Log out</button>}
      {!isAuthorized && (
        <button className="login-button" onClick={() => onOpen()}>
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
          <div className="mobile-links-container">
            <MobileLinks color={Colors.black} />
          </div>
        </>
      ) : (
        <>
          <div className="humburger-menu" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <CloseIcon width="24" height="24" /> : <HamburgerIcon />}
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
      <Modal isShowing={isShowing} onClose={onClose} className="mobile-full-screen" mobileFullScreen>
        <LoginContainer closeModal={onClose} />
      </Modal>
    </section>
  );
};

export default Header;
