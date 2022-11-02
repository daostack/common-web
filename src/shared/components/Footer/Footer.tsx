import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authentificated } from "@/pages/Auth/store/selectors";
import { selectFooter } from "@/shared/store/selectors";
import { ROUTE_PATHS } from "../../constants";
import "./index.scss";

const Footer = () => {
  const isAuthenticated = useSelector(authentificated());
  const sharedFooterState = useSelector(selectFooter());
  const shouldHideFooter = sharedFooterState.shouldHideFooter ?? false;
  const date = new Date();

  if (shouldHideFooter) {
    return null;
  }

  return (
    <section className="footer-wrapper">
      <div className="footer-top">
        <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
        <div className="links">
          <a href={ROUTE_PATHS.HOME}>About</a>
          {isAuthenticated && (
            <Link to={ROUTE_PATHS.COMMON_LIST}>Explore Commons</Link>
          )}
          <a
            href={require("../../assets/terms_and_conditions.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          <a
            href={require("../../assets/privacy_policy.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a href="mailto://support@common.io">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="powered-by">
          Powered by <img src="/icons/dao.svg" alt="dao" /> DaoStack
        </div>
        <div className="copyrights">
          Copyrights © {date.getFullYear()}. All rights reserved
        </div>
      </div>
    </section>
  );
};

export default Footer;
