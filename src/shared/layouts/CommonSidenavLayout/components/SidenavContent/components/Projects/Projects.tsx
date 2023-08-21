import React, { FC, ReactNode, useCallback, useMemo } from "react";
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

interface ProjectsProps {
  renderNoItemsInfo?: () => ReactNode;
  onCommonCreationClick?: () => void;
}

const Projects: FC<ProjectsProps> = (props) => {
  const { renderNoItemsInfo, onCommonCreationClick } = props;
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
    parentItemIds,
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

  const createCommonModalEl = (
    <CreateCommonModal
      isShowing={isCreateCommonModalOpen}
      onClose={onCreateCommonModalClose}
      isSubCommonCreation={false}
      onGoToCommon={handleGoToCommon}
    />
  );

  if (!parentItem) {
    return areCommonsLoading ? (
      <Loader className={styles.loader} />
    ) : (
      <>
        {renderNoItemsInfo?.() || null}
        {createCommonModalEl}
      </>
    );
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
        parentItemIds={parentItemIds}
        itemIdWithNewProjectCreation={itemIdWithNewProjectCreation}
        currentCommonId={currentCommonId}
        onCommonClick={handleCommonClick}
        onCommonCreationClick={onCommonCreationClick ?? onCreateCommonModalOpen}
        onAddProjectClick={handleAddProjectClick}
        isLoading={areProjectsLoading}
      />
      {createCommonModalEl}
    </>
  );
};

export default Projects;
