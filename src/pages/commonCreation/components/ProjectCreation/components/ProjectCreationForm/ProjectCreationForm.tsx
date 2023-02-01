import React, { FC, useCallback, useRef } from "react";
import { usePreventReload } from "@/shared/hooks";
import { useProjectCreation } from "@/shared/hooks/useCases";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { generateCreationForm, CreationFormRef } from "../../../CreationForm";
import { UnsavedChangesPrompt } from "../UnsavedChangesPrompt";
import { CONFIGURATION } from "./configuration";
import { ProjectCreationFormValues } from "./types";
import styles from "./ProjectCreationForm.module.scss";

const CreationForm = generateCreationForm<ProjectCreationFormValues>();

const INITIAL_VALUES: ProjectCreationFormValues = {
  projectImages: [],
  projectName: "",
  byline: "",
  description: parseStringToTextEditorValue(),
  videoUrl: "",
  gallery: [],
};

interface ProjectCreationFormProps {
  parentCommonId: string;
}

const ProjectCreationForm: FC<ProjectCreationFormProps> = (props) => {
  const { parentCommonId } = props;
  const formRef = useRef<CreationFormRef>(null);
  const { isProjectCreationLoading, project, error, createProject } =
    useProjectCreation();

  const shouldPreventReload = useCallback(
    () => (!project && formRef.current?.isDirty()) ?? true,
    [formRef, project],
  );

  const handleSubmit = (values: ProjectCreationFormValues) => {
    createProject(parentCommonId, values);
  };

  usePreventReload(shouldPreventReload);

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
        initialValues={INITIAL_VALUES}
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
