import React, { FC } from "react";
import { Link4Icon } from "@/shared/icons";
import { ProjectsStateItem } from "@/store/states";
import styles from "./NameRightContent.module.scss";

interface NameRightContentProps {
  projectsStateItem: ProjectsStateItem;
  originalCommonId: string;
  linkedCommonIds?: string[];
}

const NameRightContent: FC<NameRightContentProps> = (props) => {
  const { projectsStateItem, originalCommonId, linkedCommonIds = [] } = props;

  if (projectsStateItem.commonId === originalCommonId) {
    return <span className={styles.originalText}>original</span>;
  }
  if (linkedCommonIds.includes(projectsStateItem.commonId)) {
    return <Link4Icon className={styles.linkIcon} />;
  }

  return null;
};

export default NameRightContent;
