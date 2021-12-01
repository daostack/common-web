import React, { FC } from "react";
import classNames from "classnames";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { FormikTouched } from "formik/dist/types";

import DeleteIcon from "../../../../../shared/icons/delete.icon";
import { ButtonIcon } from "../../../ButtonIcon";
import { ButtonLink } from "../../../ButtonLink";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import "./index.scss";

export interface RulesArrayItem {
  title: string;
  description: string;
}

type Errors = string | string[] | FormikErrors<RulesArrayItem[]> | undefined;
type Touched = FormikTouched<RulesArrayItem>[] | undefined;

interface RulesArrayProps extends FieldArrayConfig {
  title?: string;
  description?: string;
  values: RulesArrayItem[];
  errors: Errors;
  touched: Touched;
  maxTitleLength?: number;
  className?: string;
  itemClassName?: string;
}

const getInputError = (errors: Errors, index: number, key: keyof RulesArrayItem): string => {
  if (!errors || typeof errors !== 'object') {
    return '';
  }

  const error = errors[index];

  if (!error || typeof error === 'string') {
    return '';
  }

  return error[key] || '';
};

const isTouched = (touched: Touched, index: number, key: keyof RulesArrayItem): boolean => (
  Boolean(touched && touched[index] && touched[index][key])
);

const RulesArray: FC<RulesArrayProps> = (props) => {
  const { title, description, values, errors, touched, maxTitleLength, className, itemClassName, ...restProps } = props;

  return (
    <FieldArray
      {...restProps}
      render={({ remove, push }) => (
        <div className={classNames("description-array", className)}>
          {values.map((value, index) => {
            const titleError = isTouched(touched, index, 'title') ? getInputError(errors, index, 'title') : '';
            const descriptionError = isTouched(touched, index, 'description')
              ? getInputError(errors, index, 'description')
              : '';
            const error = titleError || descriptionError;
            const shouldDisplayDeleteButton = values.length > 1 && Boolean(value.title && value.description);

            return (
              <div key={index} className={classNames("description-array__item", itemClassName)}>
                <TextField
                  id={`${restProps.name}.${index}.title`}
                  name={`${restProps.name}.${index}.title`}
                  label={index === 0 ? title : ""}
                  description={index === 0 ? description : ""}
                  placeholder={`Rule #${index + 1} title`}
                  maxLength={maxTitleLength}
                  styles={{
                    label: "description-array__title-label",
                    description: "description-array__title-description",
                    input: {
                      default: classNames("description-array__title-input", {
                        "description-array__title-input--without-bottom-border": !titleError && descriptionError,
                      }),
                    },
                    error: "description-array__title-error",
                  }}
                />
                <div className="description-array__description-input-wrapper">
                  <TextField
                    id={`${restProps.name}.${index}.description`}
                    name={`${restProps.name}.${index}.description`}
                    placeholder="Rule description"
                    rows={5}
                    isTextarea
                    styles={{
                      input: {
                        default: classNames("description-array__description-input", {
                          "description-array__description-input--without-top-border": titleError || !descriptionError,
                          "description-array__description-input--with-delete-button": shouldDisplayDeleteButton,
                        }),
                      },
                      error: "description-array__description-error",
                    }}
                  />
                  {shouldDisplayDeleteButton && (
                    <ButtonIcon
                      className="description-array__remove-button"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon className="description-array__delete-icon" />
                    </ButtonIcon>
                  )}
                </div>
                {error && <ErrorText>{error}</ErrorText>}
              </div>
            );
          })}
          <ButtonLink
            className="description-array__add-button"
            onClick={() => push({ title: '', description: '' })}
          >
            Add rule
          </ButtonLink>
        </div>
      )}
    />
  );
};

export default RulesArray;
