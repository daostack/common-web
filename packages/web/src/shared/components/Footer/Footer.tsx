import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const Footer = () => {
  const date = new Date();
  return (
    <section className="footer-wrapper">
      <div className="footer-top">
        <div className="links">
          <Link to="/">
            <img src="/icons/logo-white.svg" alt="logo" width="120px" className="logo" />
          </Link>
          <span>About</span>
          <span>Careers</span>
          <a href="mailto://support@common.io">Contact</a>
          <a
            href="https://apps.apple.com/il/app/common-collaborative-action/id1512785740"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download IOS
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.daostack.common"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Android
          </a>
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
