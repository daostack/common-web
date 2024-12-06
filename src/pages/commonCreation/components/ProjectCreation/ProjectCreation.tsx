import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { ButtonLink } from "@/shared/components";
import { GovernanceActions } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack } from "@/shared/hooks";
import {
  useCommon,
  useGovernance,
  useGovernanceByCommonId,
} from "@/shared/hooks/useCases";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common, Governance, Project } from "@/shared/models";
import { Container, Loader } from "@/shared/ui-kit";
import { commonActions, ProjectsStateItem } from "@/store/states";
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
  const { canGoBack, goBack } = useGoBack();
  const dispatch = useDispatch();
  const { getCommonPagePath } = useRoutesContext();
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
    data: governance,
    fetched: isGovernanceFetched,
    fetchGovernance,
    setGovernance,
  } = useGovernanceByCommonId();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const projectId = initialCommon?.id;
  const isEditing = Boolean(initialCommon);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const loaderEl = (
    <CenterWrapper>
      <Loader />
    </CenterWrapper>
  );

  const handleCreatedProject = (project: Common) => {
    fetchGovernance(project.id);
  };

  const handleProjectCreationFinish = (data: {
    project: Common;
    governance: Governance;
  }) => {
    const { project: createdProject, governance } = data;

    if (isEditing) {
      CommonEventEmitter.emit(CommonEvent.ProjectUpdated, {
        commonId: createdProject.id,
        image: createdProject.image,
        name: createdProject.name,
      });
    } else {
      const projectsStateItem: ProjectsStateItem = {
        commonId: createdProject.id,
        image: createdProject.image,
        name: createdProject.name,
        directParent: createdProject.directParent,
        rootCommonId: createdProject.rootCommonId,
        hasMembership: true,
        hasPermissionToAddProject: Object.values(governance.circles).some(
          (circle) => circle.allowedActions[GovernanceActions.CREATE_PROJECT],
        ),
        notificationsAmount: 0,
      };

      dispatch(
        commonActions.setIsNewProjectCreated({
          isCreated: true,
          commonId: createdProject.id,
        }),
      );
      CommonEventEmitter.emit(
        CommonEvent.ProjectCreatedOrUpdated,
        projectsStateItem,
      );
    }
    CommonEventEmitter.emit(CommonEvent.CommonUpdated, createdProject);
    history.push(getCommonPagePath(createdProject.id));
  };

  const handleBackButtonClick = () => {
    if (canGoBack) {
      goBack();
    } else {
      history.push(backRoute);
    }
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
    if (projectId) {
      fetchGovernance(projectId);
    } else {
      setGovernance(null);
    }
  }, [projectId]);

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
  if (
    !isParentGovernanceFetched ||
    !isCommonMemberFetched ||
    (!isGovernanceFetched && isEditing)
  ) {
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

  const parentCommonRoute = getCommonPagePath(parentCommon.id);
  const projectRoute = getCommonPagePath(initialCommon?.id || "");
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
        <ButtonLink className={styles.backLink} onClick={handleBackButtonClick}>
          <LongLeftArrowIcon className={styles.backArrowIcon} />
          Back
        </ButtonLink>
        <h1 className={styles.title}>
          {isEditing
            ? `Edit space ${initialCommon?.name}`
            : `Create a new space in ${parentCommon.name}`}
        </h1>
        <p className={styles.subtitle}>
          Spaces are specific areas of collaboration which contain more focused
          subspaces and single-topic streams.
        </p>
        <ProjectCreationForm
          rootCommonId={parentCommon.rootCommonId ?? parentCommon.id}
          parentCommonId={parentCommon.id}
          parentCommonName={parentCommon.name}
          parentGovernanceCircles={parentGovernance.circles}
          parentGovernanceId={parentGovernance.id}
          initialCommon={initialCommon}
          governance={governance}
          isEditing={isEditing}
          onProjectCreated={handleCreatedProject}
          onFinish={handleProjectCreationFinish}
          onCancel={handleProjectCreationCancel}
        />
      </div>
    </Container>
  );
};

export default ProjectCreation;
