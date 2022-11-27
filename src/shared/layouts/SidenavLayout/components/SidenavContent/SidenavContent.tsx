import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import logoSrc from "@/shared/assets/images/logo-sidenav.svg";
import { ROUTE_PATHS } from "@/shared/constants";
import { getUserName } from "@/shared/utils";
import {
  projectsActions,
  selectProjectsData,
  selectAreProjectsFetched,
  selectAreProjectsLoading,
} from "@/store/states";
import { Navigation, ProjectsTree, Scrollbar, UserInfo } from "./components";
import { generateProjectsTreeItems } from "./utils";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const separatorEl = <div className={styles.separator} />;

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(projectsActions.clearProjects());
      return;
    }
    if (!areProjectsLoading && !areProjectsFetched) {
      dispatch(projectsActions.getProjects.request());
    }
  }, [isAuthenticated, areProjectsLoading, areProjectsFetched]);

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
      {areProjectsFetched && (
        <Scrollbar>
          <ProjectsTree className={styles.projectsTree} items={items} />
        </Scrollbar>
      )}
    </div>
  );
};

export default SidenavContent;
