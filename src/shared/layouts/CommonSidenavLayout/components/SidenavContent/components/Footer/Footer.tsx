import React, { FC } from "react";
import classNames from "classnames";
import { FOOTER_ID } from "@/shared/constants";
import { CopyrightIcon } from "@/shared/icons";
import styles from "./Footer.module.scss";

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = (props) => {
  const { className: outerClassName } = props;
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id={FOOTER_ID}
      className={classNames(styles.footer, outerClassName)}
    >
      Common. Copyrights&nbsp;
      <CopyrightIcon />
      &nbsp;{currentYear}. All rights reserved
    </footer>
  );
};

export default Footer;
