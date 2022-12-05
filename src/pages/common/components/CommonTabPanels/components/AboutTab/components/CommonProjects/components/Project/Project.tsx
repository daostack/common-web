import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { Image } from "@/shared/components";
import styles from "./Project.module.scss";

interface ProjectProps {
  title: string;
  description?: string;
  url?: string;
  imageURL?: string;
  imageAlt?: string;
  icon?: ReactNode;
}

const Project: FC<ProjectProps> = (props) => {
  const { title, description, url, imageURL, imageAlt, icon } = props;
  const imageEl = props.imageURL ? (
    <Image className={styles.image} src={imageURL} alt={imageAlt || ""} />
  ) : (
    <div className={styles.iconWrapper}>{icon}</div>
  );
  const titleClassName = classNames(styles.title, {
    [styles.titleForIcon]: !props.imageURL,
  });
  const titleEl = url ? (
    <NavLink className={titleClassName} to={url}>
      {title}
    </NavLink>
  ) : (
    <span className={titleClassName}>{title}</span>
  );

  return (
    <div className={styles.item}>
      {imageEl}
      {titleEl}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default Project;
