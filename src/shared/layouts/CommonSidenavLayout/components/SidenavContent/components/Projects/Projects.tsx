import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authentificated } from "@/pages/Auth/store/selectors";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useAuthorizedModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { getCommonPagePath } from "@/shared/utils";
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
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
  getItemFromProjectsStateItem,
} from "../../../../../SidenavLayout/components/SidenavContent/components/Projects";
import { TreeItemTriggerStyles } from "../../../../../SidenavLayout/components/SidenavContent/components/ProjectsTree";
import { ProjectsTree } from "../ProjectsTree";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = history.location;
  const {
    isModalOpen: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useAuthorizedModal();
  const isAuthenticated = useSelector(authentificated());
  const currentCommonId = useSelector(selectCommonLayoutCommonId);
  const commons = useSelector(selectCommonLayoutCommons);
  const areCommonsLoading = useSelector(selectAreCommonLayoutCommonsLoading);
  const areCommonsFetched = useSelector(selectAreCommonLayoutCommonsFetched);
  const projects = useSelector(selectCommonLayoutProjects);
  const areProjectsLoading = useSelector(selectAreCommonLayoutProjectsLoading);
  const areProjectsFetched = useSelector(selectAreCommonLayoutProjectsFetched);
  const currentCommon = commons.find(
    ({ commonId }) => commonId === currentCommonId,
  );
  const parentItem = useMemo(
    () => (currentCommon ? getItemFromProjectsStateItem(currentCommon) : null),
    [currentCommon],
  );
  const items = useMemo(() => {
    const [item] = generateProjectsTreeItems(
      currentCommon ? projects.concat(currentCommon) : projects,
    );

    return item?.items || [];
  }, [currentCommon, projects]);
  const treeItemTriggerStyles = useMemo<TreeItemTriggerStyles>(
    () => ({
      container: styles.projectsTreeItemTriggerClassName,
      containerActive: styles.projectsTreeItemTriggerActiveClassName,
      name: styles.projectsTreeItemTriggerNameClassName,
      image: styles.projectsTreeItemTriggerImageClassName,
      imageNonRounded: styles.projectsTreeItemTriggerImageNonRoundedClassName,
    }),
    [],
  );
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const activeItem = getItemById(
    activeItemId,
    parentItem ? [parentItem, ...items] : items,
  );

  const handleCommonClick = (commonId: string) => {
    if (currentCommonId === commonId) {
      return;
    }

    history.push(getCommonPagePath(commonId));
    dispatch(commonLayoutActions.setCurrentCommonId(commonId));
    dispatch(commonLayoutActions.clearProjects());
  };

  const handleGoToCommon = (createdCommon: Common) => {
    onCreateCommonModalClose();
    handleCommonClick(createdCommon.id);
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

  if (!parentItem) {
    return areCommonsLoading ? <Loader className={styles.loader} /> : null;
  }

  return (
    <>
      <ProjectsTree
        className={styles.projectsTree}
        treeItemTriggerStyles={treeItemTriggerStyles}
        parentItem={parentItem}
        commons={commons}
        items={items}
        activeItem={activeItem}
        currentCommonId={currentCommonId}
        onCommonClick={handleCommonClick}
        onCommonCreationClick={onCreateCommonModalOpen}
        isLoading={areProjectsLoading}
      />
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
