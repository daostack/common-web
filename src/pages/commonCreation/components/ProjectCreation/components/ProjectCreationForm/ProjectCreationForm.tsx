import React, { FC } from "react";
import {
  CreationForm,
  CreationFormItem,
  CreationFormItemType,
} from "../../../CreationForm";
import {
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_TAGLINE_LENGTH,
} from "../../constants";
import { ProjectCreationFormValues } from "./types";

const INITIAL_VALUES: ProjectCreationFormValues = {
  projectName: "",
  tagline: "",
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
    {
      type: CreationFormItemType.TextField,
      props: {
        id: "tagline",
        name: "tagline",
        label: "Subtitle",
        placeholder: "Add caption here",
        maxLength: MAX_PROJECT_TAGLINE_LENGTH,
        countAsHint: true,
      },
    },
  ];

  const handleSubmit = (values: ProjectCreationFormValues) => {
    console.log(values);
  };

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
