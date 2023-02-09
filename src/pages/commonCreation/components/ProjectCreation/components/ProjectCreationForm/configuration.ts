import { CreationFormItem, CreationFormItemType } from "../../../CreationForm";
import {
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_TAGLINE_LENGTH,
} from "../../constants";
import styles from "./ProjectCreationForm.module.scss";

export const CONFIGURATION: CreationFormItem[] = [
  {
    type: CreationFormItemType.UploadFiles,
    className: styles.projectImages,
    props: {
      name: "projectImages",
      label: "Project picture",
      maxImagesAmount: 1,
    },
    validation: {
      min: {
        value: 1,
        message: "Project image is required",
      },
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
    validation: {
      required: {
        value: true,
        message: "Project name is required",
      },
      max: {
        value: MAX_PROJECT_NAME_LENGTH,
        message: "Project name is too long",
      },
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
    validation: {
      max: {
        value: MAX_PROJECT_TAGLINE_LENGTH,
        message: "Subtitle is too long",
      },
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
  {
    type: CreationFormItemType.Links,
    props: {
      name: "links",
      title: "Links",
      errors: [],
      values: [],
      touched: [],
    },
  },
];
