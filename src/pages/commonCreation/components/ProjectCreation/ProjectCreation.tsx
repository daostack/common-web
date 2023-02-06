import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { GovernanceActions, ROUTE_PATHS } from "@/shared/constants";
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
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const loaderEl = (
    <div className={styles.centerWrapper}>
      <Loader />
    </div>
  );

  useEffect(() => {
    fetchParentCommon(parentCommonId);
  }, [parentCommonId]);

  useEffect(() => {
    fetchCommonMember(parentCommonId, {}, true);
  }, [parentCommonId, userId]);

  if (!isParentCommonFetched) {
    return loaderEl;
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
  if (!isCommonMemberFetched) {
    return loaderEl;
  }

  const parentCommonRoute = ROUTE_PATHS.COMMON.replace(":id", parentCommon.id);

  if (
    !commonMember ||
    !commonMember.allowedActions[GovernanceActions.CREATE_PROJECT]
  ) {
    return <Redirect to={parentCommonRoute} />;
  }

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <NavLink className={styles.backLink} to={parentCommonRoute}>
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
        <ProjectCreationForm parentCommonId={parentCommon.id} />
      </div>
    </Container>
  );
};

export default ProjectCreation;
