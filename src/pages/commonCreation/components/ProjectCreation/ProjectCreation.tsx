import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { GovernanceActions, ROUTE_PATHS } from "@/shared/constants";
import { useCommon, useGovernance } from "@/shared/hooks/useCases";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Container, Loader } from "@/shared/ui-kit";
import { commonActions, projectsActions } from "@/store/states";
import { ProjectCreationForm } from "./components";
import styles from "./ProjectCreation.module.scss";

interface ProjectCreationProps {
  parentCommonId: string;
}

const ProjectCreation: FC<ProjectCreationProps> = (props) => {
  const { parentCommonId } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    data: parentCommon,
    fetched: isParentCommonFetched,
    fetchCommon: fetchParentCommon,
  } = useCommon();
  const {
    data: parentGovernance,
    fetched: isParentGovernanceFetched,
    fetchGovernance: fetchParentGovernance,
  } = useGovernance();
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

  const handleCreatedProject = (createdProject: Common) => {
    dispatch(commonActions.setIsNewProjectCreated(true));
    dispatch(
      projectsActions.addProject({
        commonId: createdProject.id,
        image: createdProject.image,
        name: createdProject.name,
        directParent: createdProject.directParent,
        hasMembership: true,
        notificationsAmount: 0,
      }),
    );
    history.push(ROUTE_PATHS.COMMON.replace(":id", createdProject.id));
  };

  useEffect(() => {
    fetchParentCommon(parentCommonId);
  }, [parentCommonId]);

  useEffect(() => {
    if (parentCommon?.governanceId) {
      fetchParentGovernance(parentCommon.governanceId);
    }
  }, [parentCommon?.governanceId]);

  useEffect(() => {
    fetchCommonMember(parentCommonId, {}, true);
  }, [parentCommonId, userId]);

  if (!isParentCommonFetched) {
    return loaderEl;
  }
  if (!parentCommon) {
    return (
      <div className={styles.centerWrapper}>
        <p className={styles.dataErrorText}>Parent common does not exist</p>
      </div>
    );
  }
  if (!isParentGovernanceFetched || !isCommonMemberFetched) {
    return loaderEl;
  }
  if (!parentGovernance) {
    return (
      <div className={styles.centerWrapper}>
        <p className={styles.dataErrorText}>
          Governance for parent common was not found
        </p>
      </div>
    );
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
        <ProjectCreationForm
          parentCommonId={parentCommon.id}
          governanceCircles={parentGovernance.circles}
          onFinish={handleCreatedProject}
        />
      </div>
    </Container>
  );
};

export default ProjectCreation;
