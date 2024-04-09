import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  CommonAvatar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui-kit";
import styles from "./Project.module.scss";

interface ProjectProps {
  title: string;
  url: string;
  imageURL: string;
  imageAlt: string;
  tooltipContent?: ReactNode | null;
}

const Project: FC<ProjectProps> = (props) => {
  const { title, url, imageURL, imageAlt, tooltipContent } = props;

  const contentEl = (
    <div className={styles.item}>
      <CommonAvatar
        name={title}
        src={imageURL}
        className={styles.image}
        alt={imageAlt}
      />
      <NavLink className={styles.title} to={url}>
        {title}
      </NavLink>
    </div>
  );

  if (!tooltipContent) {
    return contentEl;
  }

  return (
    <Tooltip placement="bottom-end">
      <TooltipTrigger asChild>{contentEl}</TooltipTrigger>
      <TooltipContent className={styles.tooltipContent}>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

export default Project;
