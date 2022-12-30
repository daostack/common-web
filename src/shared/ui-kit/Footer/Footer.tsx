import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import classNames from "classnames";
import logoDAOStackSrc from "@/shared/assets/images/logo-daostack.svg";
import logoFooterSrc from "@/shared/assets/images/logo-footer.svg";
import { FOOTER_ID } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CopyrightIcon } from "@/shared/icons";
import styles from "./Footer.module.scss";

export enum FooterVariant {
  Default = "default",
  Small = "small",
}

interface FooterProps {
  variant?: FooterVariant;
}

const Footer: FC<FooterProps> = (props) => {
  const { variant = FooterVariant.Default } = props;
  const isTabletView = useIsTabletView();
  const currentYear = new Date().getFullYear();
  const commonLogoEl = (
    <img className={styles.commonLogo} src={logoFooterSrc} alt="Common Logo" />
  );
  const poweredByEl = (
    <div className={styles.poweredByInfo}>
      <span>Powered by</span>
      <img
        className={styles.daoStackLogo}
        src={logoDAOStackSrc}
        alt="DAOstack Logo"
      />
      <span>DAOstack</span>
    </div>
  );
  const copyrightEl = (
    <div className={styles.copyrightInfo}>
      Copyrights&nbsp;
      <CopyrightIcon />
      &nbsp;{currentYear}. All rights reserved
    </div>
  );
  const footerProps: DetailedHTMLProps<
    HTMLAttributes<HTMLElement>,
    HTMLElement
  > = {
    id: FOOTER_ID,
    className: styles.footer,
  };

  if (isTabletView || variant === FooterVariant.Small) {
    return (
      <footer
        {...footerProps}
        className={classNames(footerProps.className, styles.footerSmall)}
      >
        {poweredByEl}
        {copyrightEl}
      </footer>
    );
  }

  return (
    <footer
      {...footerProps}
      className={classNames(footerProps.className, styles.footerDefault)}
    >
      {commonLogoEl}
      <div>
        <div className={styles.content}>
          {poweredByEl}
          {!isTabletView && copyrightEl}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
