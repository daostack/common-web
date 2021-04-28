import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { ROUTE_PATHS, ScreenSize } from "../../constants";
import { getScreenSize } from "../../store/selectors";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";

const Header = () => {
  const screenSize = useSelector(getScreenSize());

  return (
    <section className="header-wrapper">
      <Link to="/" className="common-logo">
        <img src="/icons/logo.svg" alt="logo" height="60px" />
      </Link>
      {screenSize === ScreenSize.Large ? (
        <>
          <div className="navigation-wrapper">
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
          <div style={{ marginLeft: "auto" }}>
            <MobileLinks color="black" />
          </div>
        </>
      ) : (
        <img src="/icons/menu.svg" alt="humburger menu" className="humburger-menu" />
      )}
    </section>
  );
};

export default Header;
