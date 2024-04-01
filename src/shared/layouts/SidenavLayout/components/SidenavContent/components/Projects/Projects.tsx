import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectIsAuthenticated } from "@/pages/Auth/store/selectors";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import {
  projectsActions,
  selectAreProjectsFetched,
  selectAreProjectsLoading,
  selectIsCommonCreationDisabled,
  selectProjectsData,
} from "@/store/states";
import { ProjectsTree } from "../ProjectsTree";
import { Scrollbar } from "../Scrollbar";
import { CreateCommonButton } from "./components";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
  getItemIdWithNewProjectCreationByPath,
  getParentItemIds,
} from "./utils";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const location = history.location;
  const {
    isModalOpen: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useAuthorizedModal();
  const isAuthenticated = useSelector(selectIsAuthenticated());
  const projects = useSelector(selectProjectsData);
  const areProjectsLoading = useSelector(selectAreProjectsLoading);
  const areProjectsFetched = useSelector(selectAreProjectsFetched);
  const isCommonCreationDisabled = useSelector(selectIsCommonCreationDisabled);
  const items = useMemo(
    () =>
      generateProjectsTreeItems(projects, (projectsStateItem) =>
        getCommonPagePath(projectsStateItem.commonId),
      ),
    [projects, getCommonPagePath],
  );
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const itemIdWithNewProjectCreation = getItemIdWithNewProjectCreationByPath(
    location.pathname,
  );
  const activeItem = getItemById(activeItemId, items);
  const parentItemIds = getParentItemIds(activeItemId, projects);
  const isDataReady = areProjectsFetched;

  const handleGoToCommon = (createdCommon: Common) => {
    onCreateCommonModalClose();
    history.push(getCommonPagePath(createdCommon.id));
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
          items={items}
          activeItem={activeItem}
          parentItemIds={parentItemIds}
          itemIdWithNewProjectCreation={itemIdWithNewProjectCreation}
        />
        <div className={styles.createCommonButtonWrapper}>
          <CreateCommonButton
            className={styles.createCommonButton}
            onClick={onCreateCommonModalOpen}
            disabled={isCommonCreationDisabled}
          />
        </div>
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
