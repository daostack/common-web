import React, { FC } from "react";
import { usePreventReload } from "@/shared/hooks";
import { useProjectCreation } from "@/shared/hooks/useCases";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { CreationForm } from "../../../CreationForm";
import { CONFIGURATION } from "./configuration";
import { ProjectCreationFormValues } from "./types";
import styles from "./ProjectCreationForm.module.scss";

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
  const { isProjectCreationLoading, project, error, createProject } =
    useProjectCreation();
  usePreventReload();

  const handleSubmit = (values: ProjectCreationFormValues) => {
    createProject(parentCommonId, values);
  };

  return (
    <>
      {isProjectCreationLoading && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
      <CreationForm
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        items={CONFIGURATION}
        submitButtonText="Create Project"
        disabled={isProjectCreationLoading}
        error={error}
      />
    </>
  );
};

export default ProjectCreationForm;
