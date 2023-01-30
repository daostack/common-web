import React, { FC } from "react";
import {
  CreationForm,
  CreationFormItem,
  CreationFormItemType,
} from "../../../CreationForm";
import { MAX_PROJECT_NAME_LENGTH } from "../../constants";
import { ProjectCreationFormValues } from "./types";

const INITIAL_VALUES: ProjectCreationFormValues = {
  projectName: "",
};

const ProjectCreationForm: FC = () => {
  const formItems: CreationFormItem[] = [
    {
      type: CreationFormItemType.TextField,
      props: {
        id: "projectName",
        name: "projectName",
        label: "Project name (required)",
        maxLength: MAX_PROJECT_NAME_LENGTH,
        countAsHint: true,
      },
    },
  ];

  const handleSubmit = (values: ProjectCreationFormValues) => {};

  return (
    <CreationForm
      initialValues={INITIAL_VALUES}
      onSubmit={handleSubmit}
      items={formItems}
      submitButtonText="Create Project"
    />
  );
};

export default ProjectCreationForm;
