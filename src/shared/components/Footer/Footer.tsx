import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authentificated } from "@/containers/Auth/store/selectors";
import { COMMON_APP_APP_STORE_LINK, COMMON_APP_GOOGLE_PLAY_LINK, ROUTE_PATHS } from "../../constants";
import "./index.scss";

const Footer = () => {
  const isAuthenticated = useSelector(authentificated());
  const date = new Date();

  return (
    <section className="footer-wrapper">
      <div className="footer-top">
        <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
        <div className="links">
          <a href={ROUTE_PATHS.HOME}>About</a>
          {isAuthenticated && (
            <Link to={ROUTE_PATHS.COMMON_LIST}>Explore Commons</Link>
          )}
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
