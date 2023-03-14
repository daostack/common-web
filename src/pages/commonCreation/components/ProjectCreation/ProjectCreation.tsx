import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { updateCommonState } from "@/pages/OldCommon/store/actions";
import { CommonTab } from "@/pages/common";
import { GovernanceActions } from "@/shared/constants";
import { useCommon, useGovernance } from "@/shared/hooks/useCases";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common, Project } from "@/shared/models";
import { Container, Loader } from "@/shared/ui-kit";
import { getCommonPagePath } from "@/shared/utils";
import { commonActions, projectsActions } from "@/store/states";
import { CenterWrapper } from "../CenterWrapper";
import { ProjectCreationForm } from "./components";
import styles from "./ProjectCreation.module.scss";

interface ProjectCreationProps {
  parentCommonId: string;
  initialCommon?: Project;
}

const ProjectCreation: FC<ProjectCreationProps> = (props) => {
  const { parentCommonId, initialCommon } = props;
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
  const isEditing = Boolean(initialCommon);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const loaderEl = (
    <CenterWrapper>
      <Loader />
    </CenterWrapper>
  );

  const handleCreatedProject = (createdProject: Common) => {
    if (isEditing) {
      dispatch(
        projectsActions.updateProject({
          commonId: createdProject.id,
          image: createdProject.image,
          name: createdProject.name,
        }),
      );
    } else {
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
    }
    dispatch(
      updateCommonState({
        commonId: createdProject.id,
        state: {
          loading: false,
          fetched: true,
          data: createdProject,
        },
      }),
    );
    history.push(getCommonPagePath(createdProject.id, CommonTab.About));
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
    const commonId = isEditing ? initialCommon?.id : parentCommonId;

    if (commonId) {
      fetchCommonMember(commonId, {}, true);
    }
  }, [isEditing, initialCommon?.id, parentCommonId, userId]);

  if (!isParentCommonFetched) {
    return loaderEl;
  }
  if (!parentCommon) {
    return (
      <CenterWrapper>
        <p className={styles.dataErrorText}>Parent common does not exist</p>
      </CenterWrapper>
    );
  }
  if (!isParentGovernanceFetched || !isCommonMemberFetched) {
    return loaderEl;
  }
  if (!parentGovernance) {
    return (
      <CenterWrapper>
        <p className={styles.dataErrorText}>
          Governance for parent common was not found
        </p>
      </CenterWrapper>
    );
  }

  const parentCommonRoute = getCommonPagePath(parentCommon.id, CommonTab.About);
  const projectRoute = getCommonPagePath(
    initialCommon?.id || "",
    CommonTab.About,
  );
  const backRoute = isEditing ? projectRoute : parentCommonRoute;

  if (
    !commonMember ||
    !commonMember.allowedActions[
      isEditing
        ? GovernanceActions.UPDATE_COMMON
        : GovernanceActions.CREATE_PROJECT
    ]
  ) {
    return <Redirect to={backRoute} />;
  }

  const handleProjectCreationCancel = () => {
    history.push(backRoute);
  };

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <NavLink className={styles.backLink} to={backRoute}>
          <LongLeftArrowIcon className={styles.backArrowIcon} />
          Back
        </NavLink>
        <h1 className={styles.title}>
          {isEditing
            ? `Edit space ${initialCommon?.name}`
            : `Create a new space in ${parentCommon.name}`}
        </h1>
        <p className={styles.subtitle}>
          Space serves a certain group in the common to organize together and
          achieve more focused goals.
        </p>
        <ProjectCreationForm
          parentCommonId={parentCommon.id}
          governanceCircles={parentGovernance.circles}
          initialCommon={initialCommon}
          isEditing={isEditing}
          onFinish={handleCreatedProject}
          onCancel={handleProjectCreationCancel}
        />
      </div>
    </Container>
  );
};

export default ProjectCreation;
