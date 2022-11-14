import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import { Navigation, UserInfo } from "./components";
import styles from "./SidenavContent.module.scss";

const SidenavContent: FC = () => {
  const separatorEl = <div className={styles.separator} />;

  return (
    <div className={styles.container}>
      <NavLink className={styles.logoWrapper} to={ROUTE_PATHS.HOME}>
        <img className={styles.logo} src={logoSrc} alt="Common Logo" />
      </NavLink>
      {separatorEl}
      <UserInfo userName="Yossi Mordachai" />
      {separatorEl}
      <Navigation />
      {separatorEl}
    </div>
  );
};

export default SidenavContent;
