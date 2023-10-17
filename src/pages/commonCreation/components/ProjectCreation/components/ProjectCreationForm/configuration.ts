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

interface Options {
  isProject: boolean;
  roles?: Roles;
  shouldBeUnique?: { existingNames: string[] };
  isImageRequired?: boolean;
}

export const getConfiguration = (options: Options): CreationFormItem[] => {
  const {
    isProject = true,
    roles,
    shouldBeUnique,
    isImageRequired = false,
  } = options;
  const type = isProject ? "Space" : "Common";

  const items: CreationFormItem[] = [
    {
      type: CreationFormItemType.UploadFiles,
      className: styles.projectImages,
      props: {
        name: "projectImages",
        label: `${type} picture${isImageRequired ? " (required)" : ""}`,
        maxImagesAmount: 1,
      },
      validation: isImageRequired
        ? {
            min: {
              value: 1,
              message: `${type} picture is required`,
            },
          }
        : undefined,
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
          message: "Role name is required",
        },
      },
    });
  }

  return items;
};
