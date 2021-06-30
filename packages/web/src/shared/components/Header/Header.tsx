import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link, useLocation, useHistory } from "react-router-dom";
import { Colors, ROUTE_PATHS, ScreenSize } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getScreenSize } from "../../store/selectors";
import DownloadCommonApp from "../DownloadCommonApp/DownloadCommonApp";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";
import classNames from "classnames";

const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const screenSize = useSelector(getScreenSize());
  const [showMenu, setShowMenu] = useState(false);
  const [isTop, setIsTop] = useState<boolean | undefined>(undefined);

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

  const handleNavLinkClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      <NavLink to="/" exact activeClassName="active">
        About
      </NavLink>
      <NavLink to={ROUTE_PATHS.COMMON_LIST} activeClassName="active">
        Explore Commons
      </NavLink>
      <a href="mailto:hi@common.io">Contact</a>
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
