import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { usePreventReload } from "@/shared/hooks";
import { useProjectCreation } from "@/shared/hooks/useCases";
import { Circles, Common } from "@/shared/models";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { getCirclesWithHighestTier } from "@/shared/utils";
import { projectsActions } from "@/store/states";
import { generateCreationForm, CreationFormRef } from "../../../CreationForm";
import { UnsavedChangesPrompt } from "../UnsavedChangesPrompt";
import { CONFIGURATION } from "./configuration";
import { ProjectCreationFormValues } from "./types";
import styles from "./ProjectCreationForm.module.scss";

const CreationForm = generateCreationForm<ProjectCreationFormValues>();

interface ProjectCreationFormProps {
  parentCommonId: string;
  governanceCircles: Circles;
  onFinish: (createdProject: Common) => void;
}

const getInitialValues = (
  governanceCircles: Circles,
): ProjectCreationFormValues => {
  const circlesWithHighestTier = getCirclesWithHighestTier(
    Object.values(governanceCircles),
  );

  return {
    projectImages: [],
    projectName: "",
    byline: "",
    description: parseStringToTextEditorValue(),
    videoUrl: "",
    gallery: [],
    highestCircleId: circlesWithHighestTier[0]?.id || "",
  };
};

const ProjectCreationForm: FC<ProjectCreationFormProps> = (props) => {
  const { parentCommonId, governanceCircles, onFinish } = props;
  const dispatch = useDispatch();
  const formRef = useRef<CreationFormRef>(null);
  const { isProjectCreationLoading, project, error, createProject } =
    useProjectCreation();
  const initialValues = useMemo(
    () => getInitialValues(governanceCircles),
    [governanceCircles],
  );

  const shouldPreventReload = useCallback(
    () => (!project && formRef.current?.isDirty()) ?? true,
    [formRef, project],
  );

  const handleSubmit = (values: ProjectCreationFormValues) => {
    createProject(parentCommonId, values);
  };

  usePreventReload(shouldPreventReload);

  useEffect(() => {
    dispatch(projectsActions.setIsCommonCreationDisabled(true));

    return () => {
      dispatch(projectsActions.setIsCommonCreationDisabled(false));
    };
  }, []);

  useEffect(() => {
    if (project) {
      onFinish(project);
    }
  }, [project]);

  return (
    <>
      {isProjectCreationLoading && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
      <CreationForm
        ref={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        items={CONFIGURATION}
        submitButtonText="Create Project"
        disabled={isProjectCreationLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default ProjectCreationForm;
