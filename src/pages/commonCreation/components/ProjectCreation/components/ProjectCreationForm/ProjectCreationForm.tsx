import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { usePreventReload } from "@/shared/hooks";
import { useProjectCreation } from "@/shared/hooks/useCases";
import { Circles, Common, Project } from "@/shared/models";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import {
  convertLinksToUploadFiles,
  getCirclesWithHighestTier,
} from "@/shared/utils";
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
  initialCommon?: Project;
  isEditing: boolean;
  onFinish: (createdProject: Common) => void;
}

const getInitialValues = (
  governanceCircles: Circles,
  initialCommon?: Project,
): ProjectCreationFormValues => {
  const circlesWithHighestTier = getCirclesWithHighestTier(
    Object.values(governanceCircles),
  );

  return {
    projectImages: initialCommon
      ? [
          {
            id: "project_image",
            title: "project_image",
            file: initialCommon.image,
          },
        ]
      : [],
    projectName: initialCommon?.name || "",
    byline: initialCommon?.byline || "",
    description: parseStringToTextEditorValue(initialCommon?.description),
    videoUrl: initialCommon?.video?.value || "",
    gallery: initialCommon?.gallery
      ? convertLinksToUploadFiles(initialCommon.gallery)
      : [],
    links: initialCommon?.links || [{ title: "", value: "" }],
    highestCircleId:
      initialCommon?.directParent.circleId ||
      circlesWithHighestTier[0]?.id ||
      "",
  };
};

const ProjectCreationForm: FC<ProjectCreationFormProps> = (props) => {
  const {
    parentCommonId,
    governanceCircles,
    initialCommon,
    isEditing,
    onFinish,
  } = props;
  const dispatch = useDispatch();
  const formRef = useRef<CreationFormRef>(null);
  const { isProjectCreationLoading, project, error, createProject } =
    useProjectCreation();
  const initialValues = useMemo(
    () => getInitialValues(governanceCircles, initialCommon),
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
        submitButtonText={isEditing ? "Save changes" : "Create Project"}
        disabled={isProjectCreationLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default ProjectCreationForm;
