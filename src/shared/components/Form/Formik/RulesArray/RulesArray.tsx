import React, { useMemo, FC } from "react";
import classNames from "classnames";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { FormikTouched } from "formik/dist/types";
import DeleteIcon from "@/shared/icons/delete.icon";
import { BaseRule } from "@/shared/models";
import { ButtonIcon } from "../../../ButtonIcon";
import { ButtonLink } from "../../../ButtonLink";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import "./index.scss";

type Errors = string | string[] | FormikErrors<BaseRule[]> | undefined;
type Touched = FormikTouched<BaseRule>[] | undefined;

interface RulesArrayProps extends FieldArrayConfig {
  title?: string;
  description?: string;
  values: BaseRule[];
  errors: Errors;
  touched: Touched;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  className?: string;
  itemClassName?: string;
}

const getInputError = (
  errors: Errors,
  index: number,
  key: keyof BaseRule
): string => {
  if (!errors || typeof errors !== "object") {
    return "";
  }

  const error = errors[index];

  if (!error || typeof error === "string") {
    return "";
  }

  return error[key] || "";
};

const isTouched = (
  touched: Touched,
  index: number,
  key: keyof BaseRule
): boolean => Boolean(touched && touched[index] && touched[index][key]);

const RulesArray: FC<RulesArrayProps> = (props) => {
  const {
    title,
    description,
    values,
    errors,
    touched,
    maxTitleLength,
    maxDescriptionLength,
    className,
    itemClassName,
    ...restProps
  } = props;
  const isAddRuleButtonHidden = useMemo<boolean>(
    () =>
      Boolean(
        (errors && errors.length > 0) ||
          values?.some((value) => !value.title && !value.definition)
      ),
    [errors, values]
  );

  return (
    <FieldArray
      {...restProps}
      render={({ remove, push }) => {
        const handleNewRuleAdd = () =>
          push({ title: "", definition: "" } as BaseRule);

        return (
          <div className={classNames("description-array", className)}>
            {values.map((value, index) => {
              const titleError = isTouched(touched, index, "title")
                ? getInputError(errors, index, "title")
                : "";
              const valueError = isTouched(touched, index, "definition")
                ? getInputError(errors, index, "definition")
                : "";
              const error = titleError || valueError;
              const shouldDisplayDeleteButton = values.length > 1;

              return (
                <div
                  key={index}
                  className={classNames(
                    "description-array__item",
                    itemClassName
                  )}
                >
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
                          "description-array__title-input--without-bottom-border":
                            !titleError && valueError,
                        }),
                      },
                      error: "description-array__title-error",
                    }}
                  />
                  <div className="description-array__description-input-wrapper">
                    <TextField
                      id={`${restProps.name}.${index}.definition`}
                      name={`${restProps.name}.${index}.definition`}
                      placeholder="Rule description"
                      rows={5}
                      isTextarea
                      maxLength={maxDescriptionLength}
                      styles={{
                        input: {
                          default: classNames(
                            "description-array__description-input",
                            {
                              "description-array__description-input--without-top-border":
                                titleError || !valueError,
                              "description-array__description-input--with-delete-button": shouldDisplayDeleteButton,
                            }
                          ),
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
            {!isAddRuleButtonHidden && (
              <ButtonLink
                className="description-array__add-button"
                onClick={handleNewRuleAdd}
              >
                Add rule
              </ButtonLink>
            )}
          </div>
        );
      }}
    />
  );
};

export default RulesArray;
