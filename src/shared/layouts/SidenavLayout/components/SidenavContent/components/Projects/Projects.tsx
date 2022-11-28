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

interface ProjectsProps {
  className?: string;
}

const Projects: FC<ProjectsProps> = (props) => {
  const { className } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(authentificated());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const activeItem = getItemByPath(location.pathname, items);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        projectsActions.clearProjectsExceptOfCurrent(
          "7649b0de-5eba-4244-b6da-c7e59ef86a17",
        ),
      );
      return;
    }
    if (!areProjectsLoading && !areProjectsFetched) {
      dispatch(projectsActions.getProjects.request());
    }
  }, [isAuthenticated, areProjectsLoading, areProjectsFetched]);

  if (!areProjectsFetched) {
    return null;
  }

  return (
    <Scrollbar>
      <ProjectsTree
        className={className}
        items={items}
        activeItem={activeItem}
      />
    </Scrollbar>
  );
};

export default Projects;
