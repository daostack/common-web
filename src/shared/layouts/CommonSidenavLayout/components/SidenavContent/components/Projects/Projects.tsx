import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authentificated } from "@/pages/Auth/store/selectors";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import {
  projectsActions,
  selectAreProjectsFetched,
  selectAreProjectsLoading,
  selectProjectsData,
} from "@/store/states";
import {
  ProjectsTree,
  Scrollbar,
} from "../../../../../SidenavLayout/components/SidenavContent";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
  getItemIdWithNewProjectCreationByPath,
} from "../../../../../SidenavLayout/components/SidenavContent/components/Projects";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = history.location;
  const {
    isShowing: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useModal(false);
  const isAuthenticated = useSelector(authentificated());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const itemIdWithNewProjectCreation = getItemIdWithNewProjectCreationByPath(
    location.pathname,
  );
  const activeItem = getItemById(activeItemId, items);
  const isDataReady = areProjectsFetched;

  const handleGoToCommon = (createdCommon: Common) => {
    onCreateCommonModalClose();
    history.push(ROUTE_PATHS.COMMON.replace(":id", createdCommon.id));
  };

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
    <>
      <Scrollbar>
        <ProjectsTree
          className={styles.projectsTree}
          treeItemTriggerClassName={styles.projectsTreeItemTriggerClassName}
          treeItemTriggerNameClassName={
            styles.projectsTreeItemTriggerNameClassName
          }
          items={items}
          activeItem={activeItem}
          itemIdWithNewProjectCreation={itemIdWithNewProjectCreation}
        />
        {areProjectsLoading && <Loader className={styles.loader} />}
      </Scrollbar>
      <CreateCommonModal
        isShowing={isCreateCommonModalOpen}
        onClose={onCreateCommonModalClose}
        isSubCommonCreation={false}
        onGoToCommon={handleGoToCommon}
      />
    </>
  );
};

export default Projects;
