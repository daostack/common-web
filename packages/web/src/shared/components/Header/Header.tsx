import React from "react";
import { Link } from "react-router-dom";
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
            <Link to="/">About Common</Link>
          </li>
          <li className="navigation-item">
            <Link to="/" className="active">
              Explore Commons
            </Link>
          </li>
        </ul>
      </div>
      <div className="mobile-links-wrapper">
        <ul className="mobile-links">
          <li className="mobile-item">
            <a
              href="https://apps.apple.com/il/app/common-collaborative-action/id1512785740"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/app-icons/app-store.svg" alt="app-store" />
            </a>
          </li>
          <li className="mobile-item">
            <a
              href="https://play.google.com/store/apps/details?id=com.daostack.common"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/app-icons/google-play.svg" alt="google-play" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
);
export default Header;
