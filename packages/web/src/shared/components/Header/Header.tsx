import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { ScreenSize } from "../../../containers/App/constants";
import { ROUTE_PATHS } from "../../constants";
import { getScreenSize } from "../../store/selectors";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";

const Header = () => {
  const screenSize = useSelector(getScreenSize());

  return (
    <section className="header-wrapper">
      <Link to="/">
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
          </div>
          <div style={{ marginLeft: "auto" }}>
            <MobileLinks color="black" />
          </div>
        </>
      ) : (
        <img src="/icons/menu.svg" alt="humburger menu" />
      )}
    </section>
  );
};

export default Header;
