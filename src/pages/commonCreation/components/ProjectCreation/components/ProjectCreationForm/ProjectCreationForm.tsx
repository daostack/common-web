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
  projectImages: [],
  projectName: "",
  byline: "",
  description: parseStringToTextEditorValue(),
  videoUrl: "",
  gallery: [],
};

const ProjectCreationForm: FC = () => {
  const formItems: CreationFormItem[] = [
    {
      type: CreationFormItemType.UploadFiles,
      className: styles.projectImages,
      props: {
        name: "projectImages",
        label: "Project picture",
        maxImagesAmount: 1,
      },
    },
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
      className: styles.description,
      props: {
        id: "description",
        name: "description",
        label: "Mission",
      },
    },
    {
      type: CreationFormItemType.TextField,
      props: {
        id: "videoUrl",
        name: "videoUrl",
        label: "YouTube video (optional)",
        placeholder: "https://",
      },
    },
    {
      type: CreationFormItemType.UploadFiles,
      className: styles.projectImages,
      props: {
        name: "gallery",
        label: "Gallery",
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
