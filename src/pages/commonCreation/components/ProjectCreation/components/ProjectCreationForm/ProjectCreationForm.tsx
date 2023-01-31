import React, { FC } from "react";
import { useProjectCreation } from "@/shared/hooks/useCases";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { CreationForm } from "../../../CreationForm";
import { CONFIGURATION } from "./configuration";
import { ProjectCreationFormValues } from "./types";

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

  const handleSubmit = (values: ProjectCreationFormValues) => {
    createProject(parentCommonId, values);
  };

  return (
    <CreationForm
      initialValues={INITIAL_VALUES}
      onSubmit={handleSubmit}
      items={CONFIGURATION}
      submitButtonText="Create Project"
      disabled={isProjectCreationLoading}
      error={error}
    />
  );
};

export default ProjectCreationForm;
