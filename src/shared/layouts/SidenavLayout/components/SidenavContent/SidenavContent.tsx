import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import { Navigation, ProjectsTree, Scrollbar, UserInfo } from "./components";
import { ITEMS } from "./itemsMock";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;
  const separatorEl = <div className={styles.separator} />;

  return (
    <div className={classNames(styles.container, className)}>
      <NavLink className={styles.logoWrapper} to={ROUTE_PATHS.HOME}>
        <img className={styles.logo} src={logoSrc} alt="Common Logo" />
      </NavLink>
      {separatorEl}
      <UserInfo userName="Yossi Mordachai" />
      {separatorEl}
      <Navigation />
      {separatorEl}
      <Scrollbar>
        <ProjectsTree items={ITEMS} />
      </Scrollbar>
    </div>
  );
};

export default SidenavContent;
