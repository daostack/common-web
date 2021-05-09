import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Colors, ROUTE_PATHS, ScreenSize } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getScreenSize } from "../../store/selectors";
import DownloadCommonApp from "../DownloadCommonApp/DownloadCommonApp";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";

const Header = () => {
  const screenSize = useSelector(getScreenSize());
  const [showMenu, setShowMenu] = useState(false);

  const handleNavLinkClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      <NavLink to="/" exact activeClassName="active">
        About Common
      </NavLink>
      <NavLink to={ROUTE_PATHS.COMMON_LIST} activeClassName="active">
        Explore Commons
      </NavLink>
      <NavLink to={ROUTE_PATHS.CONTACT} activeClassName="active">
        Contact
      </NavLink>
    </div>
  );

  return (
    <section className="header-wrapper">
      <Link to="/" className="common-logo">
        <img src="/icons/logo.svg" alt="logo" className="logo" />
      </Link>
      {screenSize === ScreenSize.Large ? (
        <>
          {links}
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
              <DownloadCommonApp setHasClosedPopup={() => {}} inMenu={true} />
              {links}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Header;
