import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCommonUpdate } from "@/pages/OldCommon/components/CommonListContainer/EditCommonModal/useCases";
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
import { projectsActions, selectCommonLayoutProjects } from "@/store/states";
import { generateCreationForm, CreationFormRef } from "../../../CreationForm";
import { UnsavedChangesPrompt } from "../UnsavedChangesPrompt";
import { getConfiguration } from "./configuration";
import { ProjectCreationFormValues } from "./types";
import styles from "./ProjectCreationForm.module.scss";

const CreationForm = generateCreationForm<ProjectCreationFormValues>();

interface ProjectCreationFormProps {
  parentCommonId: string;
  governanceCircles: Circles;
  initialCommon?: Project;
  isEditing: boolean;
  onFinish: (createdProject: Common) => void;
  onCancel: () => void;
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
            id: "space_image",
            title: "space_image",
            file: initialCommon.image,
          },
        ]
      : [],
    spaceName: initialCommon?.name || "",
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
    onCancel,
  } = props;
  const dispatch = useDispatch();
  const projects = useSelector(selectCommonLayoutProjects);

  const formRef = useRef<CreationFormRef>(null);
  const {
    isProjectCreationLoading,
    project,
    error: createProjectError,
    createProject,
  } = useProjectCreation();
  const {
    isCommonUpdateLoading,
    common: updatedProject,
    error: updateProjectError,
    updateCommon: updateProject,
  } = useCommonUpdate(initialCommon?.id);
  const isLoading = isProjectCreationLoading || isCommonUpdateLoading;
  const error = createProjectError || updateProjectError;
  const initialValues = useMemo(
    () => getInitialValues(governanceCircles, initialCommon),
    [governanceCircles],
  );

  const existingProjectsNames = projects
    .map((project) => project?.name)
    .filter((spaceName) => spaceName !== initialValues?.spaceName);

  const shouldPreventReload = useCallback(
    () => (!project && !updatedProject && formRef.current?.isDirty()) ?? true,
    [formRef, project, updatedProject],
  );

  const handleProjectCreate = (values: ProjectCreationFormValues) => {
    createProject(parentCommonId, values);
  };

  const handleProjectUpdate = (values: ProjectCreationFormValues) => {
    if (!formRef.current?.isDirty()) {
      onCancel();
      return;
    }

    const [image] = values.projectImages;

    if (!image) {
      return;
    }

    updateProject({
      ...values,
      image,
      name: values.spaceName,
    });
  };

  usePreventReload(shouldPreventReload);

  useEffect(() => {
    dispatch(projectsActions.setIsCommonCreationDisabled(true));

    return () => {
      dispatch(projectsActions.setIsCommonCreationDisabled(false));
    };
  }, []);

  useEffect(() => {
    const finalProject = project || updatedProject;

    if (finalProject) {
      onFinish(finalProject);
    }
  }, [project, updatedProject]);

  return (
    <>
      {isLoading && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
      <CreationForm
        ref={formRef}
        initialValues={initialValues}
        onSubmit={isEditing ? handleProjectUpdate : handleProjectCreate}
        items={getConfiguration(true, { existingNames: existingProjectsNames })}
        submitButtonText={isEditing ? "Save changes" : "Create Space"}
        disabled={isLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default ProjectCreationForm;
