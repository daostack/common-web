import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import defaultLogoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import styles from "./CommonLogo.module.scss";

interface CommonLogoProps {
  className?: string;
  logoClassName?: string;
  logoSrc?: string;
  fixed?: boolean;
}

const CommonLogo: FC<CommonLogoProps> = (props) => {
  const {
    className,
    logoClassName,
    logoSrc = defaultLogoSrc,
    fixed = false,
  } = props;

  return (
    <NavLink
      className={classNames(styles.logoWrapper, className, {
        [styles.logoWrapperFixed]: fixed,
      })}
      to={ROUTE_PATHS.HOME}
    >
      <img
        className={classNames(styles.logo, logoClassName)}
        src={logoSrc}
        alt="Common Logo"
      />
    </NavLink>
  );
};

export default CommonLogo;
