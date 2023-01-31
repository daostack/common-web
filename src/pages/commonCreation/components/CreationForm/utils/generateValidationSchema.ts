import * as Yup from "yup";
import { CreationFormItemType } from "../constants";
import {
  CreationFormItem,
  TextFieldFormItem,
  UploadFilesFormItem,
} from "../types";

type Schema = Yup.Schema<unknown>;

const getValidationSchemaForTextFieldItem = ({
  validation,
}: Pick<TextFieldFormItem, "validation">): Schema => {
  let schema = Yup.string();

  if (!validation) {
    return schema;
  }
  if (validation.max) {
    schema = schema.max(validation.max.value, validation.max.message);
  }
  if (validation.required?.value) {
    schema = schema.required(validation.required.message);
  }

  return schema;
};

const getValidationSchemaForUploadFilesItem = ({
  validation,
}: Pick<UploadFilesFormItem, "validation">): Schema => {
  let schema = Yup.array();

  if (!validation) {
    return schema;
  }
  if (validation.min) {
    schema = schema.min(validation.min.value, validation.min.message);
  }

  return schema;
};

export const generateValidationSchema = (
  items: CreationFormItem[],
): Yup.ObjectSchema => {
  const shape = items.reduce<Record<string, Schema>>((shape, item) => {
    let schema: Schema | null = null;

    if (item.type === CreationFormItemType.TextField) {
      schema = getValidationSchemaForTextFieldItem(item);
    }
    if (item.type === CreationFormItemType.UploadFiles) {
      schema = getValidationSchemaForUploadFilesItem(item);
    }

    return schema
      ? {
          ...shape,
          [item.props.name]: schema,
        }
      : shape;
  }, {});

  return Yup.object().shape(shape);
};
