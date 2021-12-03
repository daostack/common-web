import React, { FC } from "react";
import classNames from "classnames";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { FormikTouched } from "formik/dist/types";

import DeleteIcon from '../../../../../shared/icons/delete.icon';
import { ButtonIcon } from "../../../ButtonIcon";
import { ButtonLink } from "../../../ButtonLink";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import "./index.scss";

export interface LinksArrayItem {
  title: string;
  link: string;
}

type Errors = string | string[] | FormikErrors<LinksArrayItem[]> | undefined;
type Touched = FormikTouched<LinksArrayItem>[] | undefined;

interface LinksArrayProps extends FieldArrayConfig {
  values: LinksArrayItem[];
  errors: Errors;
  touched: Touched;
  maxTitleLength?: number;
  className?: string;
  itemClassName?: string;
}

const getInputError = (errors: Errors, index: number, key: keyof LinksArrayItem): string => {
  if (!errors || typeof errors !== 'object') {
    return '';
  }

  const error = errors[index];

  if (!error || typeof error === 'string') {
    return '';
  }

  return error[key] || '';
};

const isTouched = (touched: Touched, index: number, key: keyof LinksArrayItem): boolean => (
  Boolean(touched && touched[index] && touched[index][key])
);

const LinksArray: FC<LinksArrayProps> = (props) => {
  const { values, errors, touched, maxTitleLength, className, itemClassName, ...restProps } = props;

  return (
    <FieldArray
      {...restProps}
      render={({ remove, push }) => (
        <div className={classNames("links-array", className)}>
          {values.map((value, index) => {
            const titleError = isTouched(touched, index, 'title') ? getInputError(errors, index, 'title') : '';
            const linkError = isTouched(touched, index, 'link') ? getInputError(errors, index, 'link') : '';
            const error = titleError || linkError;
            const shouldDisplayDeleteButton = values.length > 1 && Boolean(value.title && value.link);

            return (
              <div key={index} className={classNames("links-array__item", itemClassName)}>
                <TextField
                  id={`${restProps.name}.${index}.title`}
                  name={`${restProps.name}.${index}.title`}
                  label={index === 0 ? "Add links" : ""}
                  placeholder="Link title"
                  maxLength={maxTitleLength}
                  hint={index === 0 ? "Resources, related content, or social pages" : ""}
                  styles={{
                    input: {
                      default: classNames("links-array__title-input", {
                        "links-array__title-input--without-bottom-border": !titleError && linkError,
                      }),
                    },
                    error: "links-array__title-error",
                  }}
                />
                <div className="links-array__link-input-wrapper">
                  <TextField
                    id={`${restProps.name}.${index}.link`}
                    name={`${restProps.name}.${index}.link`}
                    placeholder={`Link #${index + 1}`}
                    styles={{
                      input: {
                        default: classNames("links-array__link-input", {
                          "links-array__link-input--without-top-border": titleError || !linkError,
                          "links-array__link-input--with-delete-button": shouldDisplayDeleteButton,
                        }),
                      },
                      error: "links-array__link-error",
                    }}
                  />
                  {shouldDisplayDeleteButton && (
                    <ButtonIcon
                      className="links-array__remove-button"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon className="links-array__delete-icon" />
                    </ButtonIcon>
                  )}
                </div>
                {error && <ErrorText>{error}</ErrorText>}
              </div>
            );
          })}
          <ButtonLink
            className="links-array__add-button"
            onClick={() => push({ title: '', link: '' })}
          >
            Add link
          </ButtonLink>
        </div>
      )}
    />
  );
};

export default LinksArray;
