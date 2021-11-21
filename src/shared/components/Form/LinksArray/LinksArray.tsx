import React, { FC } from "react";
import classNames from "classnames";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { FormikTouched } from "formik/dist/types";

import { ButtonLink } from "../../ButtonLink";
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
  const { values, errors, touched, maxTitleLength, ...restProps } = props;

  return (
    <FieldArray
      {...restProps}
      render={({ insert, remove, push }) => (
        <div className="links-array">
          {values.map((value, index) => {
            const titleError = isTouched(touched, index, 'title') ? getInputError(errors, index, 'title') : '';
            const linkError = isTouched(touched, index, 'link') ? getInputError(errors, index, 'link') : '';

            return (
              <div key={index}>
                <TextField
                  id={`${restProps.name}.${index}.title`}
                  name={`${restProps.name}.${index}.title`}
                  label="Add links"
                  placeholder="Link title"
                  maxLength={maxTitleLength}
                  hint="Resources, related content, or social pages"
                  styles={{
                    input: {
                      default: classNames("links-array__title-input", {
                        "links-array__title-input--without-bottom-border": !titleError && linkError,
                      }),
                    },
                    error: "links-array__title-error",
                  }}
                />
                <TextField
                  id={`${restProps.name}.${index}.link`}
                  name={`${restProps.name}.${index}.link`}
                  placeholder={`Link #${index + 1}`}
                  styles={{
                    input: {
                      default: classNames("links-array__link-input", {
                        "links-array__link-input--without-top-border": titleError || !linkError,
                      }),
                    },
                  }}
                />
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
