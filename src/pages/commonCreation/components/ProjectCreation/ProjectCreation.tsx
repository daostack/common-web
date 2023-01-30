import React, { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { useCommon } from "@/shared/hooks/useCases";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Container, Loader } from "@/shared/ui-kit";
import { ProjectCreationForm } from "./components";
import styles from "./ProjectCreation.module.scss";

interface ProjectCreationProps {
  parentCommonId: string;
}

const ProjectCreation: FC<ProjectCreationProps> = (props) => {
  const { parentCommonId } = props;
  const {
    data: parentCommon,
    fetched: isParentCommonFetched,
    fetchCommon: fetchParentCommon,
  } = useCommon();
  const isLoading = !isParentCommonFetched;

  useEffect(() => {
    fetchParentCommon(parentCommonId);
  }, [parentCommonId]);

  if (isLoading) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
      </div>
    );
  }
  if (!parentCommon) {
    return (
      <div className={styles.centerWrapper}>
        <p className={styles.nonExistentParentCommon}>
          Parent common does not exist
        </p>
      </div>
    );
  }

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <NavLink
          className={styles.backLink}
          to={ROUTE_PATHS.COMMON.replace(":id", parentCommon.id)}
        >
          <LongLeftArrowIcon className={styles.backArrowIcon} />
          Back
        </NavLink>
        <h1 className={styles.title}>
          Create a new project in {parentCommon.name}
        </h1>
        <p className={styles.subtitle}>
          Project serves a certain group in the common to organize together and
          achieve more focused goals.
        </p>
        <ProjectCreationForm />
      </div>
    </Container>
  );
};

export default ProjectCreation;
