import React, { FC, ReactNode, useMemo, useState } from "react";
import { LOADER_APPEARANCE_DELAY } from "@/shared/constants";
import { TreeItemTriggerStyles } from "@/shared/layouts";
import { ProjectsTree } from "@/shared/layouts/CommonSidenavLayout/components/SidenavContent/components/ProjectsTree";
import { Loader } from "@/shared/ui-kit";
import { useProjectsData } from "./hooks";
import styles from "./Projects.module.scss";

interface ProjectsProps {
  rootCommonId: string;
  commonId: string;
  renderNoItemsInfo?: () => ReactNode;
}

const Projects: FC<ProjectsProps> = (props) => {
  const { renderNoItemsInfo } = props;
  const [currentCommonId, setCurrentCommonId] = useState(props.rootCommonId);
  const [activeItemId, setActiveItemId] = useState(props.commonId);
  const {
    parentItem,
    areCommonsLoading,
    areProjectsLoading,
    commons,
    items,
    activeItem,
    parentItemIds,
  } = useProjectsData({ currentCommonId, activeItemId });
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

  if (!parentItem) {
    return areCommonsLoading ? (
      <Loader className={styles.loader} delay={LOADER_APPEARANCE_DELAY} />
    ) : (
      <>{renderNoItemsInfo?.() || null}</>
    );
  }

  return (
    <ProjectsTree
      className={styles.projectsTree}
      treeItemTriggerStyles={treeItemTriggerStyles}
      parentItem={parentItem}
      commons={commons}
      items={items}
      activeItem={activeItem}
      parentItemIds={parentItemIds}
      currentCommonId={currentCommonId}
      onCommonClick={setCurrentCommonId}
      isLoading={areProjectsLoading}
      withScrollbar={false}
      commonsMenuClassName={styles.commonsMenuClassName}
      loaderDelay={0}
    />
  );
};

export default Projects;
