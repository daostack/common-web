import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { authentificated } from "@/pages/Auth/store/selectors";
import {
  projectsActions,
  selectAreProjectsFetched,
  selectAreProjectsLoading,
  selectProjectsData,
} from "@/store/states";
import { ProjectsTree } from "../ProjectsTree";
import { Scrollbar } from "../Scrollbar";
import { generateProjectsTreeItems, getItemByPath } from "./utils";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(authentificated());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const activeItem = getItemByPath(location.pathname, items);
  const activeItemId = activeItem?.id;

  useEffect(() => {
    if (isAuthenticated && !areProjectsLoading && !areProjectsFetched) {
      dispatch(projectsActions.getProjects.request());
    }
  }, [isAuthenticated, areProjectsLoading, areProjectsFetched]);

  useEffect(() => {
    if (!isAuthenticated && activeItemId) {
      dispatch(projectsActions.clearProjectsExceptOfCurrent(activeItemId));
    }
  }, [isAuthenticated]);

  if (!areProjectsFetched) {
    return null;
  }

  return (
    <Scrollbar>
      <ProjectsTree
        className={styles.projectsTree}
        items={items}
        activeItem={activeItem}
      />
    </Scrollbar>
  );
};

export default Projects;
