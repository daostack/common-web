import React, { FC } from "react";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { Navigation, UserInfo } from "./components";
import styles from "./SidenavContent.module.scss";

const SidenavContent: FC = () => {
  const separatorEl = <div className={styles.separator} />;

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logoSrc} alt="Common Logo" />
      {separatorEl}
      <UserInfo />
      {separatorEl}
      <Navigation />
      {separatorEl}
    </div>
  );
};

export default SidenavContent;
