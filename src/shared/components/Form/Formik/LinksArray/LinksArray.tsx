import React, { useMemo, FC } from "react";
import classNames from "classnames";
import {
  FieldArray,
  FieldArrayConfig,
  FormikErrors,
  useFormikContext,
} from "formik";
import { FormikTouched } from "formik/dist/types";
import DeleteIcon from "@/shared/icons/delete.icon";
import { CommonLink } from "@/shared/models";
import { ButtonIcon } from "../../../ButtonIcon";
import { ButtonLink } from "../../../ButtonLink";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import "./index.scss";

type Errors = string | string[] | FormikErrors<CommonLink[]> | undefined;
type Touched = FormikTouched<CommonLink>[] | undefined;

export interface LinksArrayProps extends FieldArrayConfig {
  values: CommonLink[];
  errors: Errors;
  touched: Touched;
  title?: string;
  hint?: string;
  maxTitleLength?: number;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

const getInputError = (
  errors: Errors,
  index: number,
  key: keyof CommonLink,
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
  key: keyof CommonLink,
): boolean => Boolean(touched && touched[index] && touched[index][key]);

const LinksArray: FC<LinksArrayProps> = (props) => {
  const {
    values,
    errors,
    touched,
    title = "Add links",
    hint = "Resources, related content, or social pages",
    maxTitleLength,
    className,
    itemClassName,
    labelClassName,
    disabled,
    ...restProps
  } = props;
  const { setFieldValue } = useFormikContext();
  const isAddLinkButtonHidden = useMemo<boolean>(
    () =>
      Boolean(
        (errors && errors.length > 0) ||
          values?.some((value) => !value.title && !value.value),
      ),
    [errors, values],
  );

  return (
    <FieldArray
      {...restProps}
      render={({ remove, push }) => {
        const handleNewLinkAdd = () =>
          push({ title: "", value: "" } as CommonLink);

        return (
          <div className={classNames("links-array", className)}>
            {values.map((value, index) => {
              const titleError = isTouched(touched, index, "title")
                ? getInputError(errors, index, "title")
                : "";
              const valueError = isTouched(touched, index, "value")
                ? getInputError(errors, index, "value")
                : "";
              const error = titleError || valueError;
              const shouldDisplayDeleteButton = values.length > 1;

              return (
                <div
                  key={index}
                  className={classNames("links-array__item", itemClassName)}
                >
                  <TextField
                    id={`${restProps.name}.${index}.title`}
                    name={`${restProps.name}.${index}.title`}
                    label={index === 0 ? title : ""}
                    placeholder="Link title"
                    maxLength={maxTitleLength}
                    hint={index === 0 ? hint : ""}
                    disabled={disabled}
                    styles={{
                      label: labelClassName,
                      input: {
                        default: classNames("links-array__title-input", {
                          "links-array__title-input--without-bottom-border":
                            !titleError && valueError,
                        }),
                      },
                      error: "links-array__title-error",
                    }}
                  />
                  <div className="links-array__link-input-wrapper">
                    <TextField
                      onBlurCapture={(value) => {
                        if (
                          !value.target.value.startsWith("http://") &&
                          !value.target.value.startsWith("https://")
                        ) {
                          setFieldValue(
                            `${restProps.name}.${index}.value`,
                            `https://${value.target.value}`,
                          );
                        }
                      }}
                      id={`${restProps.name}.${index}.value`}
                      name={`${restProps.name}.${index}.value`}
                      placeholder={`Link #${index + 1}`}
                      disabled={disabled}
                      styles={{
                        input: {
                          default: classNames("links-array__link-input", {
                            "links-array__link-input--without-top-border":
                              titleError || !valueError,
                            "links-array__link-input--with-delete-button":
                              shouldDisplayDeleteButton,
                          }),
                        },
                        error: "links-array__link-error",
                      }}
                    />
                    {shouldDisplayDeleteButton && (
                      <ButtonIcon
                        className="links-array__remove-button"
                        onClick={() => remove(index)}
                        disabled={disabled}
                      >
                        <DeleteIcon className="links-array__delete-icon" />
                      </ButtonIcon>
                    )}
                  </div>
                  {error && <ErrorText>{error}</ErrorText>}
                </div>
              );
            })}
            {!isAddLinkButtonHidden && (
              <ButtonLink
                className="links-array__add-button"
                onClick={handleNewLinkAdd}
                disabled={disabled}
              >
                Add link
              </ButtonLink>
            )}
          </div>
        );
      }}
    />
  );
};

export default LinksArray;
