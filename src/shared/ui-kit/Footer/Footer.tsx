import React, { FC } from "react";
import logoDAOStackSrc from "@/shared/assets/images/logo-daostack.svg";
import logoFooterSrc from "@/shared/assets/images/logo-footer.svg";
import { CopyrightIcon } from "@/shared/icons";
import styles from "./Footer.module.scss";

const Footer: FC = () => (
  <footer className={styles.footer}>
    <img className={styles.commonLogo} src={logoFooterSrc} alt="Common Logo" />
    <div className={styles.content}>
      <div className={styles.poweredByInfo}>
        <span>Powered by</span>
        <img
          className={styles.daoStackLogo}
          src={logoDAOStackSrc}
          alt="DAOstack Logo"
        />
        <span>DAOstack</span>
      </div>
      <div className={styles.copyrightInfo}>
        Copyrights&nbsp;
        <CopyrightIcon />
        &nbsp;2021. All rights reserved
      </div>
    </div>
  </footer>
);

export default Footer;
