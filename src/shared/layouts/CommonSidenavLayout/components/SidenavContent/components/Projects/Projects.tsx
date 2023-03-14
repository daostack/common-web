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
  commonLayoutActions,
  selectCommonLayoutCommonId,
  selectCommonLayoutCommons,
  selectAreCommonLayoutCommonsLoading,
  selectAreCommonLayoutCommonsFetched,
  selectCommonLayoutProjects,
  selectAreCommonLayoutProjectsLoading,
  selectAreCommonLayoutProjectsFetched,
} from "@/store/states";
import {
  ProjectsTree,
  Scrollbar,
} from "../../../../../SidenavLayout/components/SidenavContent";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
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
  const currentCommonId = useSelector(selectCommonLayoutCommonId);
  const commons = useSelector(selectCommonLayoutCommons);
  const areCommonsLoading = useSelector(selectAreCommonLayoutCommonsLoading);
  const areCommonsFetched = useSelector(selectAreCommonLayoutCommonsFetched);
  const projects = useSelector(selectCommonLayoutProjects);
  const areProjectsLoading = useSelector(selectAreCommonLayoutProjectsLoading);
  const areProjectsFetched = useSelector(selectAreCommonLayoutProjectsFetched);
  const items = useMemo(() => generateProjectsTreeItems(projects), [projects]);
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const activeItem = getItemById(activeItemId, items);

  const handleGoToCommon = (createdCommon: Common) => {
    onCreateCommonModalClose();
    history.push(ROUTE_PATHS.COMMON.replace(":id", createdCommon.id));
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(commonLayoutActions.markDataAsNotFetched());
      return;
    }
    if (activeItemId) {
      dispatch(commonLayoutActions.clearDataExceptOfCurrent(activeItemId));
    } else {
      dispatch(commonLayoutActions.clearData());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (areCommonsLoading) {
      return;
    }
    if (!areCommonsFetched) {
      dispatch(commonLayoutActions.getCommons.request(activeItemId));
    }
  }, [areCommonsLoading, areCommonsFetched]);

  useEffect(() => {
    if (areProjectsLoading || !currentCommonId) {
      return;
    }
    if (!areProjectsFetched) {
      dispatch(commonLayoutActions.getProjects.request(currentCommonId));
    }
  }, [areProjectsLoading, areProjectsFetched, currentCommonId]);

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
