import * as Yup from "yup";
import { MAX_LINK_TITLE_LENGTH, URL_REGEXP } from "@/shared/constants";
import { CreationFormItemType } from "../constants";
import {
  CreationFormItem,
  LinksFormItem,
  TextFieldFormItem,
  UploadFilesFormItem,
  RolesFormItem,
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
  if (validation.unique?.values) {
    schema = schema.notOneOf(
      validation.unique.values,
      validation.unique.message,
    );
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

const getValidationSchemaForLinksItem = ({
  validation,
}: Pick<LinksFormItem, "validation">): Schema => {
  if (!validation || !validation.links || !validation.links.enabled) {
    return Yup.array();
  }

  return Yup.array().of(
    Yup.object().shape(
      {
        title: Yup.string().when("value", (value: string) => {
          if (value) {
            return Yup.string()
              .max(
                validation.links?.max || MAX_LINK_TITLE_LENGTH,
                "Entered title is too long",
              )
              .required("Please enter link title");
          }
        }),
        value: Yup.string().when("title", (title: string) => {
          if (title) {
            return Yup.string()
              .matches(URL_REGEXP, "Please enter correct URL")
              .required("Please enter a link");
          }
        }),
      },
      [["title", "value"]],
    ),
  );
};

const getValidationSchemaForRolesItem = ({
  validation,
}: Pick<RolesFormItem, "validation">): Schema => {
  if (!validation) {
    return Yup.array();
  }

  return Yup.array().of(
    Yup.object().shape({
      circleName: Yup.string().required(
        validation.required?.message || "Role name is required",
      ),
    }),
  );
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
    if (item.type === CreationFormItemType.Links) {
      schema = getValidationSchemaForLinksItem(item);
    }
    if (item.type === CreationFormItemType.Roles) {
      schema = getValidationSchemaForRolesItem(item);
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
