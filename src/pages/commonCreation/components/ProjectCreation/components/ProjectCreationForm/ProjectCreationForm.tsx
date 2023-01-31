import React, { FC } from "react";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
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
import styles from "./ProjectCreationForm.module.scss";

const INITIAL_VALUES: ProjectCreationFormValues = {
  projectName: "",
  byline: "",
  description: parseStringToTextEditorValue(),
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
        id: "byline",
        name: "byline",
        label: "Subtitle",
        placeholder: "Add caption here",
        maxLength: MAX_PROJECT_TAGLINE_LENGTH,
        countAsHint: true,
      },
    },
    {
      type: CreationFormItemType.TextEditor,
      props: {
        id: "description",
        name: "description",
        label: "Mission",
        placeholder:
          "What exactly do you plan to do and how? How does it align with the Common's agenda and goals",
      },
    },
    {
      type: CreationFormItemType.TextField,
      className: styles.videoUrlTextField,
      props: {
        id: "videoUrl",
        name: "videoUrl",
        label: "YouTube video (optional)",
        placeholder: "https://",
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
