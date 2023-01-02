import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import styles from "./CommonLogo.module.scss";

interface CommonLogoProps {
  fixed?: boolean;
}

const CommonLogo: FC<CommonLogoProps> = (props) => {
  const { fixed = false } = props;

  return (
    <NavLink
      className={classNames(styles.logoWrapper, {
        [styles.logoWrapperFixed]: fixed,
      })}
      to={ROUTE_PATHS.HOME}
    >
      <img className={styles.logo} src={logoSrc} alt="Common Logo" />
    </NavLink>
  );
};

export default CommonLogo;
