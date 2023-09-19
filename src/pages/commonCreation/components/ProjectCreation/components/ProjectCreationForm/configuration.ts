import { Roles } from "@/shared/models";
import { TextEditorSize } from "@/shared/ui-kit";
import { CreationFormItem, CreationFormItemType } from "../../../CreationForm";
import {
  MAX_LINK_TITLE_LENGTH,
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_TAGLINE_LENGTH,
  MAX_ROLE_TITLE_LENGTH,
} from "../../constants";
import styles from "./ProjectCreationForm.module.scss";

export const getConfiguration = (
  isProject = true,
  roles?: Roles,
  shouldBeUnique?: { existingNames: string[] },
): CreationFormItem[] => {
  const type = isProject ? "Space" : "Common";

  const items: CreationFormItem[] = [
    {
      type: CreationFormItemType.UploadFiles,
      className: styles.projectImages,
      props: {
        name: "projectImages",
        label: `${type} picture`,
        maxImagesAmount: 1,
      },
    },
    {
      type: CreationFormItemType.TextField,
      props: {
        id: "spaceName",
        name: "spaceName",
        label: `${type} name (required)`,
        maxLength: MAX_PROJECT_NAME_LENGTH,
        countAsHint: true,
      },
      validation: {
        required: {
          value: true,
          message: `${type} name is required`,
        },
        max: {
          value: MAX_PROJECT_NAME_LENGTH,
          message: `${type} name is too long`,
        },
        unique: {
          values: shouldBeUnique?.existingNames,
          message: "This name is already in use, please choose another name",
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
        size: TextEditorSize.Auto,
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
        maxTitleLength: MAX_LINK_TITLE_LENGTH,
      },
      validation: {
        links: {
          enabled: true,
          max: MAX_LINK_TITLE_LENGTH,
        },
      },
    },
  ];

  if (roles) {
    items.push({
      type: CreationFormItemType.Roles,
      props: {
        name: "roles",
        title: "Roles",
        maxTitleLength: MAX_ROLE_TITLE_LENGTH,
      },
      validation: {
        required: {
          value: true,
          message: "Role title required",
        },
        max: {
          value: MAX_ROLE_TITLE_LENGTH,
          message: "Role title is too long",
        },
      },
    });
  }

  return items;
};
