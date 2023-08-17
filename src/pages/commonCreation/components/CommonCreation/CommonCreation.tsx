import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { GovernanceActions } from "@/shared/constants";
import { useGoBack } from "@/shared/hooks";
import { LongLeftArrowIcon } from "@/shared/icons";
import { Common, Governance } from "@/shared/models";
import { Button, ButtonVariant, Container } from "@/shared/ui-kit";
import { getCommonPagePath } from "@/shared/utils";
import { styles as projectCreationStyles } from "../ProjectCreation";
import { CommonForm } from "./components";
import styles from "./CommonCreation.module.scss";

const CommonCreation: FC = () => {
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();

  const handleCreatedCommon = (createdCommonData: {
    common: Common;
    governance: Governance;
  }): void => {
    const { common, governance } = createdCommonData;
    const hasPermissionToAddProject = Object.values(governance.circles).some(
      (circle) => circle.allowedActions[GovernanceActions.CREATE_PROJECT],
    );

    CommonEventEmitter.emit(CommonEvent.ProjectCreated, {
      commonId: common.id,
      image: common.image,
      name: common.name,
      directParent: common.directParent,
      hasMembership: true,
      hasPermissionToAddProject,
      notificationsAmount: 0,
    });
    CommonEventEmitter.emit(CommonEvent.CommonCreated, common);

    history.push(getCommonPagePath(common.id));
  };

  return (
    <Container className={projectCreationStyles.container}>
      <div className={projectCreationStyles.content}>
        {canGoBack && (
          <Button
            className={styles.backButton}
            variant={ButtonVariant.Transparent}
            leftIcon={<LongLeftArrowIcon className={styles.backArrowIcon} />}
            onClick={goBack}
          >
            Back
          </Button>
        )}
        <h1 className={`${projectCreationStyles.title} ${styles.title}`}>
          Create a new common
        </h1>
        <CommonForm onFinish={handleCreatedCommon} onCancel={goBack} />
      </div>
    </Container>
  );
};

export default CommonCreation;
