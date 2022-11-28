import React, { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import { getUserName } from "@/shared/utils";
import { Navigation, Projects, UserInfo } from "./components";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const separatorEl = <div className={styles.separator} />;

  return (
    <div className={classNames(styles.container, className)}>
      <NavLink className={styles.logoWrapper} to={ROUTE_PATHS.HOME}>
        <img className={styles.logo} src={logoSrc} alt="Common Logo" />
      </NavLink>
      {separatorEl}
      <UserInfo
        avatarURL={user?.photoURL}
        userName={getUserName(user)}
        isAuthenticated={isAuthenticated}
      />
      {separatorEl}
      <Navigation />
      {separatorEl}
      <Projects className={styles.projectsTree} />
    </div>
  );
};

export default SidenavContent;
