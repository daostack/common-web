import {
  LinksArrayWrapperProps,
  TextFieldProps,
  TextEditorProps,
  UploadFilesProps,
  RolesArrayWrapperProps,
} from "@/shared/components/Form/Formik";
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
  validation?: Pick<ItemValidation, "required" | "max">;
}

export type CreationFormItem =
  | TextFieldFormItem
  | TextEditorFormItem
  | UploadFilesFormItem
  | LinksFormItem
  | RolesFormItem;
