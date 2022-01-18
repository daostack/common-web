import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  COMMON_APP_APP_STORE_LINK,
  COMMON_APP_GOOGLE_PLAY_LINK,
  ROUTE_PATHS,
} from "../../constants";
import { matchRoute } from "../../utils";
import "./index.scss";

const Footer: FC = () => {
  const location = useLocation();
  const date = new Date();
  const isTrusteeRoute = matchRoute(location.pathname, ROUTE_PATHS.TRUSTEE, {
    exact: false,
  });

  if (isTrusteeRoute) {
    return null;
  }

  return (
    <section className="footer-wrapper">
      <div className="footer-top">
        <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
        <div className="links">
          <a href="/#about_section">About</a>
          <Link to={ROUTE_PATHS.COMMON_LIST}>Explore Commons</Link>
          <a href={COMMON_APP_APP_STORE_LINK} target="_blank" rel="noopener noreferrer">
            Download IOS
          </a>
          <a href={COMMON_APP_GOOGLE_PLAY_LINK} target="_blank" rel="noopener noreferrer">
            Download Android
          </a>
          <a href={require("../../assets/terms_and_conditions.pdf")} target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
          <a href={require("../../assets/privacy_policy.pdf")} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a href="mailto://support@common.io">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="powered-by">
          Powered by <img src="/icons/dao.svg" alt="dao" /> DaoStack
        </div>
        <div className="copyrights">Copyrights © {date.getFullYear()}. All rights reserved</div>
      </div>
    </section>
  );
};

export default Footer;
