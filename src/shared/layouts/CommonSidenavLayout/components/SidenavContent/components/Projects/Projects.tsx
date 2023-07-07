import React, { FC, useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { TreeItemTriggerStyles } from "../../../../../SidenavLayout/components/SidenavContent/components/ProjectsTree";
import { useProjectsData } from "../../hooks";
import { ProjectsTree } from "../ProjectsTree";
import styles from "./Projects.module.scss";

const Projects: FC = () => {
  const history = useHistory();
  const { getCommonPagePath, getProjectCreationPagePath } = useRoutesContext();
  const {
    currentCommonId,
    parentItem,
    areCommonsLoading,
    areProjectsLoading,
    commons,
    items,
    activeItem,
    itemIdWithNewProjectCreation,
  } = useProjectsData();
  const {
    isModalOpen: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useAuthorizedModal();
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

  const handleGoToCommon = (createdCommon: Common) => {
    onCreateCommonModalClose();
    history.push(getCommonPagePath(createdCommon.id));
  };

  const handleCommonClick = (commonId: string) => {
    if (currentCommonId !== commonId) {
      history.push(getCommonPagePath(commonId));
    }
  };

  const handleAddProjectClick = useCallback(
    (commonId: string) => {
      history.push(getProjectCreationPagePath(commonId));
    },
    [history.push, getProjectCreationPagePath],
  );

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
        itemIdWithNewProjectCreation={itemIdWithNewProjectCreation}
        currentCommonId={currentCommonId}
        onCommonClick={handleCommonClick}
        onCommonCreationClick={onCreateCommonModalOpen}
        onAddProjectClick={handleAddProjectClick}
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
