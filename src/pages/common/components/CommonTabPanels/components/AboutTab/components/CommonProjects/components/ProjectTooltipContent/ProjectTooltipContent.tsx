import React, { FC } from "react";
import styles from "./ProjectTooltipContent.module.scss";

interface ProjectTooltipContentProps {
  title: string;
  description?: string;
}

const ProjectTooltipContent: FC<ProjectTooltipContentProps> = (props) => {
  const { title, description } = props;

  return (
    <>
      <h3 className={styles.text}>{title}</h3>
      {description && <p className={styles.text}>{description}</p>}
    </>
  );
};

export default ProjectTooltipContent;
