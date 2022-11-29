import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { authentificated } from "@/pages/Auth/store/selectors";
import { Loader } from "@/shared/ui-kit";
import {
  projectsActions,
  selectAreProjectsFetched,
  selectAreProjectsLoading,
  selectProjectsData,
} from "@/store/states";
import { ProjectsTree } from "../ProjectsTree";
import { Scrollbar } from "../Scrollbar";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
} from "./utils";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(authentificated());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const activeItem = getItemById(activeItemId, items);
  const isDataReady = areProjectsFetched && Boolean(activeItem);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(projectsActions.markProjectsAsNotFetched());
      return;
    }
    if (activeItemId) {
      dispatch(projectsActions.clearProjectsExceptOfCurrent(activeItemId));
    } else {
      dispatch(projectsActions.clearProjects());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (areProjectsLoading) {
      return;
    }
    if (!isDataReady) {
      dispatch(projectsActions.getProjects.request(activeItemId));
    }
  }, [areProjectsLoading, isDataReady]);

  if (items.length === 0) {
    return areProjectsLoading ? <Loader className={styles.loader} /> : null;
  }

  return (
    <Scrollbar>
      <ProjectsTree
        className={styles.projectsTree}
        items={items}
        activeItem={activeItem}
      />
      {areProjectsLoading && <Loader className={styles.loader} />}
    </Scrollbar>
  );
};

export default Projects;
