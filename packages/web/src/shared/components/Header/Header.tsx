import React from "react";
import { NavLink, Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants";
import MobileLinks from "../MobileLinks/MobileLinks";
import "./index.scss";

const Header = () => (
  <section className="header-wrapper">
    <div className="inner-wrapper">
      <Link to="/" className="logo-wrapper">
        <img src="/icons/logo.svg" alt="logo" />
      </Link>
      <div className="navigation-wrapper">
        <ul className="header-navigation">
          <li className="navigation-item">
            <NavLink to="/" exact activeClassName="active">
              About Common
            </NavLink>
          </li>
          <li className="navigation-item">
            <NavLink to={ROUTE_PATHS.COMMON_LIST} activeClassName="active">
              Explore Commons
            </NavLink>
          </li>
        </ul>
      </div>
      <MobileLinks color="black" />
    </div>
  </section>
);

export default Header;
