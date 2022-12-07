import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Image } from "@/shared/components";
import styles from "./Project.module.scss";

interface ProjectProps {
  title: string;
  description?: string;
  url: string;
  imageURL: string;
  imageAlt: string;
}

const Project: FC<ProjectProps> = (props) => {
  const { title, description, url, imageURL, imageAlt } = props;

  return (
    <div className={styles.item}>
      <Image className={styles.image} src={imageURL} alt={imageAlt} />
      <NavLink className={styles.title} to={url}>
        {title}
      </NavLink>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default Project;
