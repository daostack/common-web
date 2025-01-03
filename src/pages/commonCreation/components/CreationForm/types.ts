import {
  LinksArrayWrapperProps,
  TextFieldProps,
  TextEditorProps,
  UploadFilesProps,
  RolesArrayWrapperProps,
  NotionIntegrationProps,
} from "@/shared/components/Form/Formik";
import { AdvancedSettingsProps } from "@/shared/components/Form/Formik/AdvancedSettings";
import { CreationFormItemType } from "./constants";

interface ItemValidation {
  required?: {
    value: boolean;
    message?: string;
  };
  max?: {
    value: number;
    message?: string;
  };
  min?: {
    value: number;
    message?: string;
  };
  links?: {
    enabled: boolean;
    max?: number;
  };
  unique?: {
    values?: string[];
    message?: string;
  };
}

interface BaseFormItem<Props extends { name: string } = { name: string }> {
  type: CreationFormItemType;
  className?: string;
  props: Props;
  validation?: ItemValidation;
}

export interface TextFieldFormItem extends BaseFormItem<TextFieldProps> {
  type: CreationFormItemType.TextField;
  validation?: Pick<ItemValidation, "required" | "max" | "unique">;
}

interface TextEditorFormItem extends BaseFormItem<TextEditorProps> {
  type: CreationFormItemType.TextEditor;
}

export interface UploadFilesFormItem extends BaseFormItem<UploadFilesProps> {
  type: CreationFormItemType.UploadFiles;
  validation?: Pick<ItemValidation, "min">;
}

export interface LinksFormItem extends BaseFormItem<LinksArrayWrapperProps> {
  type: CreationFormItemType.Links;
  validation?: Pick<ItemValidation, "links">;
}

export interface RolesFormItem extends BaseFormItem<RolesArrayWrapperProps> {
  type: CreationFormItemType.Roles;
  validation?: Pick<ItemValidation, "required">;
}

export interface NotionIntegrationFormItem
  extends BaseFormItem<NotionIntegrationProps> {
  type: CreationFormItemType.NotionIntegration;
}

export interface AdvancedSettingsFormItem
  extends BaseFormItem<AdvancedSettingsProps> {
  type: CreationFormItemType.AdvancedSettings;
}

export interface SecretSpaceFormItem extends BaseFormItem<{ name: string }> {
  type: CreationFormItemType.SecretSpace;
}

export type CreationFormItem =
  | TextFieldFormItem
  | TextEditorFormItem
  | UploadFilesFormItem
  | LinksFormItem
  | RolesFormItem
  | NotionIntegrationFormItem
  | AdvancedSettingsFormItem
  | SecretSpaceFormItem;
